import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type StaffRole = "admin" | "support" | "viewer";

const formTypeValidator = v.union(
  v.literal("founding"),
  v.literal("standard"),
  v.literal("studio"),
  v.literal("events"),
);

type FormType = "founding" | "standard" | "studio" | "events";

const formTypeToTable: Record<FormType, "foundingApplications" | "standardApplications" | "studioInquiries" | "eventsQuotes"> = {
  founding: "foundingApplications",
  standard: "standardApplications",
  studio: "studioInquiries",
  events: "eventsQuotes",
};

const applicationStatusValidator = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("needs_info"),
);

const ticketStatusValidator = v.union(
  v.literal("open"),
  v.literal("in_progress"),
  v.literal("resolved"),
  v.literal("closed"),
);

/**
 * Internal helper — NOT a Convex function. Verifies the caller is authenticated
 * staff (admin via ADMIN_EMAILS env var bootstrap or via staffMembers table)
 * and optionally enforces a minimum role.
 *
 * Role hierarchy: admin > support > viewer.
 */
async function requireStaff(
  ctx: QueryCtx | MutationCtx,
  requiredRole?: StaffRole,
): Promise<{ email: string; role: StaffRole; clerkUserId: string | null }> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated.");
  const email = (identity.email ?? "").toLowerCase();
  const clerkUserId = identity.subject ?? null;

  // Bootstrap admins via env vars. Email is preferred (readable), but the
  // Clerk default Convex JWT template doesn't include `email` — so we also
  // accept clerkUserId. Either env var works:
  //   ADMIN_EMAILS=foo@example.com,bar@example.com
  //   ADMIN_CLERK_USER_IDS=user_2abc...,user_2xyz...
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

  // Look up in staffMembers — by email if available, otherwise by clerkUserId.
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

  if (!staff) throw new Error("Not authorized.");

  if (requiredRole) {
    const order: Record<StaffRole, number> = { viewer: 0, support: 1, admin: 2 };
    if (order[staff.role] < order[requiredRole]) {
      throw new Error(`Requires ${requiredRole} role.`);
    }
  }

  return { email: email || staff.email, role: staff.role, clerkUserId };
}

// =====================================================================
// Queries
// =====================================================================

/**
 * Returns the caller's staff status. Does NOT throw if the user is not staff —
 * just returns isStaff: false. Safe to call from any authenticated client.
 */
/**
 * Diagnostic — returns what Convex is actually seeing for the current request.
 * Use this when admin access isn't working as expected. It does NOT leak
 * env-var values, only whether they're set + whether your identity matches.
 *
 * Call from the browser console on dash.creatorops.io once signed in:
 *   convex.query("admin:whoami").then(console.log)
 * or from the Convex dashboard's Run Function panel.
 */
export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        authenticated: false,
        message: "No identity. The Convex client isn't authenticated.",
      };
    }

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

    return {
      authenticated: true,
      identity: {
        email: identity.email ?? null,
        emailLowercased: email || null,
        clerkUserId,
        name: identity.name ?? null,
        issuer: identity.issuer ?? null,
      },
      env: {
        ADMIN_EMAILS_set: adminEmails.length > 0,
        ADMIN_EMAILS_count: adminEmails.length,
        ADMIN_CLERK_USER_IDS_set: adminClerkUserIds.length > 0,
        ADMIN_CLERK_USER_IDS_count: adminClerkUserIds.length,
      },
      matches: {
        email_in_ADMIN_EMAILS: !!email && adminEmails.includes(email),
        clerkUserId_in_ADMIN_CLERK_USER_IDS:
          !!clerkUserId && adminClerkUserIds.includes(clerkUserId),
      },
      verdict:
        (!!email && adminEmails.includes(email)) ||
        (!!clerkUserId && adminClerkUserIds.includes(clerkUserId))
          ? "Should be admin via env-var bootstrap."
          : "Not admin via env-var bootstrap. Check the matches/identity/env fields above for why.",
    };
  },
});

export const getStaffRole = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { isStaff: false, role: null, email: null };
    }
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
      return { isStaff: true, role: "admin" as const, email };
    }
    if (clerkUserId && adminClerkUserIds.includes(clerkUserId)) {
      return {
        isStaff: true,
        role: "admin" as const,
        email: email || null,
      };
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

    if (!staff) {
      return { isStaff: false, role: null, email: email || null };
    }

    return { isStaff: true, role: staff.role, email: email || staff.email };
  },
});

export const listStaff = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    return await ctx.db.query("staffMembers").collect();
  },
});

export const listApplications = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);

    const [founding, standard, studio, events] = await Promise.all([
      ctx.db.query("foundingApplications").collect(),
      ctx.db.query("standardApplications").collect(),
      ctx.db.query("studioInquiries").collect(),
      ctx.db.query("eventsQuotes").collect(),
    ]);

    type Row = {
      _id: string;
      formType: FormType;
      firstName: string;
      lastName: string;
      email: string;
      submittedAt: number;
      status: "pending" | "approved" | "rejected";
      fullData: unknown;
    };

    // Helper to look up the linked user (for first/last name).
    async function userByEmail(email: string) {
      return await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
    }

    const rows: Row[] = [];

    for (const row of founding) {
      const user = await userByEmail(row.email);
      rows.push({
        _id: row._id,
        formType: "founding",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: row.email,
        submittedAt: row.submittedAt,
        status: row.status,
        fullData: row,
      });
    }
    for (const row of standard) {
      const user = await userByEmail(row.email);
      rows.push({
        _id: row._id,
        formType: "standard",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: row.email,
        submittedAt: row.submittedAt,
        status: row.status,
        fullData: row,
      });
    }
    for (const row of studio) {
      const user = await userByEmail(row.email);
      rows.push({
        _id: row._id,
        formType: "studio",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: row.email,
        submittedAt: row.submittedAt,
        status: row.status,
        fullData: row,
      });
    }
    for (const row of events) {
      const user = await userByEmail(row.email);
      rows.push({
        _id: row._id,
        formType: "events",
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: row.email,
        submittedAt: row.submittedAt,
        status: row.status,
        fullData: row,
      });
    }

    rows.sort((a, b) => b.submittedAt - a.submittedAt);
    return rows;
  },
});

export const getApplicationDetail = query({
  args: {
    formType: formTypeValidator,
    id: v.string(),
  },
  handler: async (ctx, { formType, id }) => {
    await requireStaff(ctx);
    const table = formTypeToTable[formType];
    const row = await ctx.db.get(id as Id<typeof table>);
    if (!row) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", (row as { email: string }).email))
      .first();

    return { application: row, user };
  },
});

/**
 * Internal version of getApplicationDetail for use by actions (no auth check —
 * actions enforce auth at their own layer or are called only by trusted code).
 */
export const getApplicationDetailInternal = internalQuery({
  args: {
    formType: formTypeValidator,
    id: v.string(),
  },
  handler: async (ctx, { formType, id }) => {
    const table = formTypeToTable[formType];
    const row = await ctx.db.get(id as Id<typeof table>);
    if (!row) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", (row as { email: string }).email))
      .first();
    return { application: row, user };
  },
});

export const listSupportTickets = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const tickets = await ctx.db.query("supportTickets").collect();
    tickets.sort((a, b) => b.submittedAt - a.submittedAt);
    return tickets;
  },
});

export const getSupportTicketDetail = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    await requireStaff(ctx);
    return await ctx.db.get(id as Id<"supportTickets">);
  },
});

/**
 * Public-readable. Powers the landing page spots indicator. No auth required.
 */
export const getSpotsConfig = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", "spots"))
      .first();

    if (!row) {
      return { totalSpots: 10, spotsTaken: 5, spotsRemaining: 5 };
    }

    const value = row.value as {
      totalSpots: number;
      spotsTaken: number;
      lastChangeNote?: string;
    };
    return {
      totalSpots: value.totalSpots,
      spotsTaken: value.spotsTaken,
      spotsRemaining: Math.max(0, value.totalSpots - value.spotsTaken),
    };
  },
});

export const listAuditLog = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const rows = await ctx.db
      .query("adminAuditLog")
      .withIndex("by_created_at")
      .order("desc")
      .take(100);
    return rows;
  },
});

// =====================================================================
// Mutations
// =====================================================================

/**
 * Internal mutation called when a staff member signs in via Clerk.
 * Idempotent: only updates if record exists with matching email and no clerkUserId yet.
 */
export const syncStaffClerkId = internalMutation({
  args: {
    email: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { email, clerkUserId }) => {
    const normalized = email.toLowerCase();
    const staff = await ctx.db
      .query("staffMembers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    if (!staff) return { updated: false };
    if (staff.clerkUserId === clerkUserId) return { updated: false };
    await ctx.db.patch(staff._id, { clerkUserId });
    return { updated: true };
  },
});

export const addStaffMember = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("support"), v.literal("viewer")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { email, role, notes }) => {
    const caller = await requireStaff(ctx, "admin");
    const normalized = email.toLowerCase();

    const existing = await ctx.db
      .query("staffMembers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    if (existing) throw new Error("Staff member with that email already exists.");

    const id = await ctx.db.insert("staffMembers", {
      email: normalized,
      role,
      addedByEmail: caller.email,
      addedAt: Date.now(),
      notes,
    });

    await writeAuditLogInline(ctx, {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "staff.add",
      targetTable: "staffMembers",
      targetId: id,
      metadata: { email: normalized, role },
    });

    return await ctx.db.get(id);
  },
});

export const updateStaffRole = mutation({
  args: {
    id: v.id("staffMembers"),
    role: v.union(v.literal("admin"), v.literal("support"), v.literal("viewer")),
  },
  handler: async (ctx, { id, role }) => {
    const caller = await requireStaff(ctx, "admin");
    const target = await ctx.db.get(id);
    if (!target) throw new Error("Staff member not found.");
    if (target.email === caller.email) {
      throw new Error("You cannot change your own role.");
    }

    await ctx.db.patch(id, { role });

    await writeAuditLogInline(ctx, {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "staff.update_role",
      targetTable: "staffMembers",
      targetId: id,
      metadata: { email: target.email, oldRole: target.role, newRole: role },
    });

    return await ctx.db.get(id);
  },
});

export const removeStaffMember = mutation({
  args: { id: v.id("staffMembers") },
  handler: async (ctx, { id }) => {
    const caller = await requireStaff(ctx, "admin");
    const target = await ctx.db.get(id);
    if (!target) throw new Error("Staff member not found.");
    if (target.email === caller.email) {
      throw new Error("You cannot remove yourself.");
    }

    await ctx.db.delete(id);

    await writeAuditLogInline(ctx, {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "staff.remove",
      targetTable: "staffMembers",
      targetId: id,
      metadata: { email: target.email, role: target.role },
    });

    return { success: true };
  },
});

export const updateApplicationStatus = mutation({
  args: {
    formType: formTypeValidator,
    id: v.string(),
    status: applicationStatusValidator,
  },
  handler: async (ctx, { formType, id, status }) => {
    const caller = await requireStaff(ctx, "support");
    const table = formTypeToTable[formType];
    const docId = id as Id<typeof table>;
    const existing = await ctx.db.get(docId);
    if (!existing) throw new Error("Application not found.");

    await ctx.db.patch(docId, { status });

    await writeAuditLogInline(ctx, {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "application.update_status",
      targetTable: table,
      targetId: id,
      metadata: { formType, oldStatus: (existing as { status: string }).status, newStatus: status },
    });

    // Notify the applicant in-dashboard if we can find a clerkUserId for them.
    // Many applicants apply before signing up — for those, this is a no-op
    // and they get the email path only.
    if (status === "approved" || status === "rejected" || status === "needs_info") {
      const applicantEmail = (existing as { email: string }).email;
      const applicantClerkUserId = await findClerkUserIdByEmail(ctx, applicantEmail);
      if (applicantClerkUserId) {
        const titleByStatus: Record<string, string> = {
          approved: "Your application was approved",
          rejected: "Update on your application",
          needs_info: "We need a bit more info on your application",
        };
        const severityByStatus: Record<string, "success" | "info" | "warning"> = {
          approved: "success",
          rejected: "info",
          needs_info: "warning",
        };
        await ctx.db.insert("notifications", {
          recipientClerkUserId: applicantClerkUserId,
          type: `application.status.${status}`,
          severity: severityByStatus[status],
          title: titleByStatus[status],
          body:
            status === "approved"
              ? "Welcome aboard. Check your email for onboarding next steps."
              : status === "needs_info"
              ? "Reply to the email we sent so we can move forward."
              : "Thanks for applying. We'll keep your info on file in case anything changes.",
          link: "/dashboard",
          metadata: { applicationId: id, formType, status },
          createdAt: Date.now(),
        });
      }
    }

    return await ctx.db.get(docId);
  },
});

/**
 * Best-effort reverse lookup: given an email, find the user's clerkUserId
 * via clientPterodactylUsers, supportTickets, or staffMembers. Returns null
 * if no match — caller should handle that case (typically by skipping the
 * in-app notification and relying on the email path).
 */
async function findClerkUserIdByEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<string | null> {
  const normalized = email.toLowerCase();

  // staffMembers (lowercased emails)
  const staff = await ctx.db
    .query("staffMembers")
    .withIndex("by_email", (q) => q.eq("email", normalized))
    .first();
  if (staff?.clerkUserId) return staff.clerkUserId;

  // supportTickets (case-preserved emails)
  const ticket = await ctx.db
    .query("supportTickets")
    .withIndex("by_email", (q) => q.eq("email", email))
    .filter((q) => q.neq(q.field("clerkUserId"), undefined))
    .first();
  if (ticket?.clerkUserId) return ticket.clerkUserId;

  return null;
}

/**
 * Internal version of updateApplicationStatus — bypasses auth check.
 * Used by onboarding actions.
 */
export const updateApplicationStatusInternal = internalMutation({
  args: {
    formType: formTypeValidator,
    id: v.string(),
    status: applicationStatusValidator,
    actorEmail: v.string(),
    actorClerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, { formType, id, status, actorEmail, actorClerkUserId }) => {
    const table = formTypeToTable[formType];
    const docId = id as Id<typeof table>;
    const existing = await ctx.db.get(docId);
    if (!existing) throw new Error("Application not found.");

    await ctx.db.patch(docId, { status });

    await writeAuditLogInline(ctx, {
      actorEmail,
      actorClerkUserId,
      action: "application.update_status",
      targetTable: table,
      targetId: id,
      metadata: { formType, oldStatus: (existing as { status: string }).status, newStatus: status },
    });

    return await ctx.db.get(docId);
  },
});

export const updateTicketStatus = mutation({
  args: {
    id: v.id("supportTickets"),
    status: ticketStatusValidator,
  },
  handler: async (ctx, { id, status }) => {
    const caller = await requireStaff(ctx, "support");
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Ticket not found.");

    await ctx.db.patch(id, { status });

    await writeAuditLogInline(ctx, {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "ticket.update_status",
      targetTable: "supportTickets",
      targetId: id,
      metadata: { oldStatus: existing.status, newStatus: status },
    });

    // Notify the ticket owner of the status change, if they're a known user.
    const ownerClerkUserId =
      existing.clerkUserId ?? (await findClerkUserIdByEmail(ctx, existing.email));
    if (ownerClerkUserId && existing.status !== status) {
      const titleByStatus: Record<string, string> = {
        open: `Ticket reopened — ${existing.subject}`,
        in_progress: `We're working on your ticket — ${existing.subject}`,
        resolved: `Ticket resolved — ${existing.subject}`,
        closed: `Ticket closed — ${existing.subject}`,
      };
      const severityByStatus: Record<string, "info" | "success"> = {
        open: "info",
        in_progress: "info",
        resolved: "success",
        closed: "info",
      };
      await ctx.db.insert("notifications", {
        recipientClerkUserId: ownerClerkUserId,
        type: `ticket.status.${status}`,
        severity: severityByStatus[status],
        title: titleByStatus[status],
        link: "/support",
        metadata: { ticketId: id, status },
        createdAt: Date.now(),
      });
    }

    return await ctx.db.get(id);
  },
});

export const setSpotsConfig = mutation({
  args: {
    totalSpots: v.number(),
    spotsTaken: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { totalSpots, spotsTaken, note }) => {
    const caller = await requireStaff(ctx, "admin");

    const existing = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", "spots"))
      .first();

    const value = {
      totalSpots,
      spotsTaken,
      lastChangeNote: note,
    };

    let id: Id<"appConfig">;
    if (existing) {
      await ctx.db.patch(existing._id, {
        value,
        updatedByEmail: caller.email,
        updatedAt: Date.now(),
      });
      id = existing._id;
    } else {
      id = await ctx.db.insert("appConfig", {
        key: "spots",
        value,
        updatedByEmail: caller.email,
        updatedAt: Date.now(),
      });
    }

    await writeAuditLogInline(ctx, {
      actorEmail: caller.email,
      actorClerkUserId: caller.clerkUserId ?? undefined,
      action: "config.set_spots",
      targetTable: "appConfig",
      targetId: id,
      metadata: { totalSpots, spotsTaken, note },
    });

    return {
      totalSpots,
      spotsTaken,
      spotsRemaining: Math.max(0, totalSpots - spotsTaken),
    };
  },
});

/**
 * Internal mutation — append a row to adminAuditLog.
 * Used by other mutations and actions to log significant admin actions.
 */
export const writeAuditLog = internalMutation({
  args: {
    actorEmail: v.string(),
    actorClerkUserId: v.optional(v.string()),
    action: v.string(),
    targetTable: v.optional(v.string()),
    targetId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adminAuditLog", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Inline helper for in-mutation audit logging (no scheduler hop).
 * Internal helper — not a Convex function.
 */
async function writeAuditLogInline(
  ctx: MutationCtx,
  args: {
    actorEmail: string;
    actorClerkUserId?: string;
    action: string;
    targetTable?: string;
    targetId?: string;
    metadata?: unknown;
  },
) {
  await ctx.db.insert("adminAuditLog", {
    ...args,
    createdAt: Date.now(),
  });
}

// Reference internal API to avoid unused-import lint when adding more callers.
 
const _internalRef = internal;
