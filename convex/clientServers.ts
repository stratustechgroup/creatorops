import { v, ConvexError } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type StaffRole = "admin" | "support" | "viewer";

export type ClientServerPermission = "view" | "power" | "backups";

const permissionValidator = v.union(
  v.literal("view"),
  v.literal("power"),
  v.literal("backups"),
);

// =====================================================================
// Auth helper — duplicate of admin.ts requireStaff so we don't depend
// across modules. Kept minimal: we only need the email + role.
// =====================================================================

async function requireStaff(
  ctx: QueryCtx | MutationCtx,
  requiredRole?: StaffRole,
): Promise<{ email: string; role: StaffRole; clerkUserId: string | null }> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Not authenticated.");
  const email = (identity.email ?? "").toLowerCase();
  const clerkUserId = identity.subject ?? null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const adminClerkUserIds = (process.env.ADMIN_CLERK_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (email && adminEmails.includes(email)) {
    return { email, role: "admin", clerkUserId };
  }
  if (clerkUserId && adminClerkUserIds.includes(clerkUserId)) {
    return { email: email || clerkUserId, role: "admin", clerkUserId };
  }

  let staff = null;
  if (email) {
    staff = await ctx.db
      .query("staffMembers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  }
  if (!staff && clerkUserId) {
    staff = await ctx.db
      .query("staffMembers")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", clerkUserId))
      .first();
  }

  if (!staff) throw new ConvexError("Not authorized.");

  if (requiredRole) {
    const order: Record<StaffRole, number> = { viewer: 0, support: 1, admin: 2 };
    if (order[staff.role] < order[requiredRole]) {
      throw new ConvexError(`Requires ${requiredRole} role.`);
    }
  }

  return { email: email || staff.email, role: staff.role, clerkUserId };
}

/**
 * Best-effort reverse lookup: given an email, find an existing clerkUserId.
 * Pulls from staffMembers + supportTickets. Returns null if the user
 * hasn't signed in anywhere yet — that's fine; the mapping activates
 * automatically when they do (we match by email at proxy time too).
 */
async function findClerkUserIdByEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<string | null> {
  const normalized = email.toLowerCase();

  const staff = await ctx.db
    .query("staffMembers")
    .withIndex("by_email", (q) => q.eq("email", normalized))
    .first();
  if (staff?.clerkUserId) return staff.clerkUserId;

  const ticket = await ctx.db
    .query("supportTickets")
    .withIndex("by_email", (q) => q.eq("email", email))
    .filter((q) => q.neq(q.field("clerkUserId"), undefined))
    .first();
  if (ticket?.clerkUserId) return ticket.clerkUserId;

  return null;
}

// =====================================================================
// Internal — used by the Pterodactyl proxy to filter the server list.
// =====================================================================

/**
 * Returns the set of servers + permissions that the calling user has
 * access to. Matches by clerkUserId AND email so an admin can pre-create
 * a mapping before the customer signs in.
 */
export const getMyClientServers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const clerkUserId = identity.subject;
    const email = (identity.email ?? "").toLowerCase();

    const byClerk = clerkUserId
      ? await ctx.db
          .query("clientServers")
          .withIndex("by_clerk_user", (q) =>
            q.eq("clerkUserId", clerkUserId),
          )
          .collect()
      : [];

    const byEmail = email
      ? await ctx.db
          .query("clientServers")
          .withIndex("by_email", (q) => q.eq("email", email))
          .collect()
      : [];

    // Merge + dedupe by row id. clerkUserId match is canonical; email
    // match is fallback for rows pre-created before the user signed in.
    const seen = new Set<string>();
    const merged = [];
    for (const row of [...byClerk, ...byEmail]) {
      if (seen.has(row._id)) continue;
      seen.add(row._id);
      merged.push(row);
    }

    return merged.map((r) => ({
      _id: r._id,
      serverIdentifier: r.serverIdentifier,
      serverName: r.serverName,
      permissions: r.permissions,
    }));
  },
});

// =====================================================================
// Admin queries.
// =====================================================================

/**
 * Lists every client-to-server mapping for admin display. Sorted by
 * most-recently-added first.
 */
export const listMappings = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const rows = await ctx.db.query("clientServers").collect();
    rows.sort((a, b) => b.addedAt - a.addedAt);
    return rows;
  },
});

// =====================================================================
// Admin mutations.
// =====================================================================

export const addMapping = mutation({
  args: {
    email: v.string(),
    serverIdentifier: v.string(),
    serverName: v.string(),
    permissions: v.array(permissionValidator),
    notes: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { email, serverIdentifier, serverName, permissions, notes },
  ) => {
    const caller = await requireStaff(ctx, "support");
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) throw new ConvexError("Email is required.");
    if (!serverIdentifier.trim()) {
      throw new ConvexError("Server identifier is required.");
    }
    if (permissions.length === 0) {
      throw new ConvexError("At least one permission is required.");
    }

    // Reject duplicates: one row per (email, serverIdentifier) pair.
    const existing = await ctx.db
      .query("clientServers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .collect();
    if (existing.some((r) => r.serverIdentifier === serverIdentifier)) {
      throw new ConvexError(
        "This user is already mapped to this server. Edit permissions instead.",
      );
    }

    const clerkUserId = await findClerkUserIdByEmail(ctx, normalizedEmail);

    const id = await ctx.db.insert("clientServers", {
      clerkUserId: clerkUserId ?? undefined,
      email: normalizedEmail,
      serverIdentifier: serverIdentifier.trim(),
      serverName: serverName.trim(),
      permissions,
      addedByEmail: caller.email,
      addedAt: Date.now(),
      notes: notes?.trim() || undefined,
    });

    await ctx.db.insert("adminAuditLog", {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "client_server.add",
      targetTable: "clientServers",
      targetId: id,
      metadata: {
        email: normalizedEmail,
        serverIdentifier,
        permissions,
        clerkUserIdResolved: !!clerkUserId,
      },
      createdAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const updatePermissions = mutation({
  args: {
    id: v.id("clientServers"),
    permissions: v.array(permissionValidator),
  },
  handler: async (ctx, { id, permissions }) => {
    const caller = await requireStaff(ctx, "support");
    const existing = await ctx.db.get(id);
    if (!existing) throw new ConvexError("Mapping not found.");
    if (permissions.length === 0) {
      throw new ConvexError("At least one permission is required.");
    }

    await ctx.db.patch(id, { permissions });

    await ctx.db.insert("adminAuditLog", {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "client_server.update_permissions",
      targetTable: "clientServers",
      targetId: id,
      metadata: {
        email: existing.email,
        serverIdentifier: existing.serverIdentifier,
        oldPermissions: existing.permissions,
        newPermissions: permissions,
      },
      createdAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const removeMapping = mutation({
  args: { id: v.id("clientServers") },
  handler: async (ctx, { id }) => {
    const caller = await requireStaff(ctx, "support");
    const existing = await ctx.db.get(id);
    if (!existing) throw new ConvexError("Mapping not found.");

    await ctx.db.delete(id);

    await ctx.db.insert("adminAuditLog", {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "client_server.remove",
      targetTable: "clientServers",
      targetId: id,
      metadata: {
        email: existing.email,
        serverIdentifier: existing.serverIdentifier,
        permissions: existing.permissions,
      },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Backfill clerkUserId on any pending email-only mappings for the calling
 * user. Idempotent — safe to call from the dashboard on every mount.
 * Most useful immediately after a customer signs up for the first time.
 */
export const syncMyClerkUserId = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { count: 0 };

    const clerkUserId = identity.subject;
    const email = (identity.email ?? "").toLowerCase();
    if (!email) return { count: 0 };

    const pending = await ctx.db
      .query("clientServers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    let updated = 0;
    for (const row of pending) {
      if (!row.clerkUserId) {
        await ctx.db.patch(row._id, { clerkUserId });
        updated++;
      }
    }

    return { count: updated };
  },
});

// Reference to keep Id<> import "used" — Convex linting can be picky.
export type _ClientServerRowId = Id<"clientServers">;
