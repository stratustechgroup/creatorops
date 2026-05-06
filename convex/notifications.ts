import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

const severityValidator = v.union(
  v.literal("info"),
  v.literal("success"),
  v.literal("warning"),
  v.literal("urgent"),
);

// =====================================================================
// Internal helpers — used by mutations/actions to fire notifications.
// =====================================================================

/**
 * Resolve the set of admin/staff clerkUserIds. Used when fanning out
 * admin-targeted notifications. Pulls from:
 *   1. ADMIN_CLERK_USER_IDS env var (comma-separated)
 *   2. staffMembers table (any role with clerkUserId set)
 *
 * Email-only admins who haven't signed in yet are skipped — they'll still
 * get the email notification path; in-app notifications light up once they
 * sign in and `syncStaffClerkId` populates their clerkUserId.
 */
async function getStaffClerkUserIds(
  ctx: QueryCtx | MutationCtx,
): Promise<string[]> {
  const fromEnv = (process.env.ADMIN_CLERK_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const staff = await ctx.db.query("staffMembers").collect();
  const fromTable = staff
    .map((s) => s.clerkUserId)
    .filter((id): id is string => !!id);

  return Array.from(new Set([...fromEnv, ...fromTable]));
}

/**
 * Insert a notification for a single recipient. Internal — call from other
 * mutations/actions only.
 */
export const notifyUser = internalMutation({
  args: {
    recipientClerkUserId: v.string(),
    type: v.string(),
    severity: severityValidator,
    title: v.string(),
    body: v.optional(v.string()),
    link: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Fan-out notification to every staff member with a known clerkUserId.
 * Internal — call from other mutations/actions only.
 */
export const notifyStaff = internalMutation({
  args: {
    type: v.string(),
    severity: severityValidator,
    title: v.string(),
    body: v.optional(v.string()),
    link: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const recipients = await getStaffClerkUserIds(ctx);
    const createdAt = Date.now();
    const ids: Id<"notifications">[] = [];
    for (const recipientClerkUserId of recipients) {
      const id = await ctx.db.insert("notifications", {
        recipientClerkUserId,
        ...args,
        createdAt,
      });
      ids.push(id);
    }
    return { count: ids.length, ids };
  },
});

/**
 * Fan-out notification to every user with a known clerkUserId who has
 * submitted any application. Used for broadcast announcements.
 * Internal — call from other mutations/actions only.
 */
export const notifyAllClients = internalMutation({
  args: {
    type: v.string(),
    severity: severityValidator,
    title: v.string(),
    body: v.optional(v.string()),
    link: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Pull every clientPterodactylUsers row — that's our best signal of
    // "active client account." Falls back to clerk-linked support tickets.
    const clients = await ctx.db.query("clientPterodactylUsers").collect();
    const ticketsWithClerk = await ctx.db
      .query("supportTickets")
      .collect();

    const ids = new Set<string>();
    for (const c of clients) ids.add(c.clerkUserId);
    for (const t of ticketsWithClerk) {
      if (t.clerkUserId) ids.add(t.clerkUserId);
    }

    const createdAt = Date.now();
    let count = 0;
    for (const recipientClerkUserId of ids) {
      await ctx.db.insert("notifications", {
        recipientClerkUserId,
        ...args,
        createdAt,
      });
      count++;
    }
    return { count };
  },
});

// =====================================================================
// Public queries (current user only).
// =====================================================================

async function requireClerkUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) throw new Error("Not authenticated.");
  return identity.subject;
}

/**
 * List notifications for the current user, newest first. Capped at 50.
 */
export const listMine = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) return [];
    const clerkUserId = identity.subject;

    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkUserId", clerkUserId),
      )
      .order("desc")
      .take(limit ?? 50);

    return rows;
  },
});

/**
 * Unread count for the current user. Used to drive the bell badge.
 * Optimized: uses the `by_recipient_unread` compound index.
 */
export const unreadCountMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) return 0;
    const clerkUserId = identity.subject;

    // Fetch up to 100 unread (more than enough — the UI caps at 99+).
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_unread", (q) =>
        q.eq("recipientClerkUserId", clerkUserId).eq("readAt", undefined),
      )
      .take(100);

    return unread.length;
  },
});

// =====================================================================
// Public mutations (current user only).
// =====================================================================

async function getOwnedNotification(
  ctx: MutationCtx,
  id: Id<"notifications">,
): Promise<Doc<"notifications">> {
  const clerkUserId = await requireClerkUserId(ctx);
  const row = await ctx.db.get(id);
  if (!row) throw new Error("Notification not found.");
  if (row.recipientClerkUserId !== clerkUserId) {
    throw new Error("Not authorized.");
  }
  return row;
}

/**
 * Mark a single notification as read. Idempotent.
 */
export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, { id }) => {
    const row = await getOwnedNotification(ctx, id);
    if (row.readAt) return { alreadyRead: true };
    await ctx.db.patch(id, { readAt: Date.now() });
    return { alreadyRead: false };
  },
});

/**
 * Atomic: mark a notification read AND return its deep link in one round-trip.
 * The bell component calls this when a user clicks a notification, then
 * navigates to the returned link.
 */
export const markReadAndGetLink = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, { id }) => {
    const row = await getOwnedNotification(ctx, id);
    if (!row.readAt) {
      await ctx.db.patch(id, { readAt: Date.now() });
    }
    return { link: row.link ?? null };
  },
});

/**
 * Mark every unread notification for the current user as read.
 */
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await requireClerkUserId(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_unread", (q) =>
        q.eq("recipientClerkUserId", clerkUserId).eq("readAt", undefined),
      )
      .collect();

    const now = Date.now();
    for (const row of unread) {
      await ctx.db.patch(row._id, { readAt: now });
    }
    return { count: unread.length };
  },
});

/**
 * Delete a single notification.
 */
export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, { id }) => {
    await getOwnedNotification(ctx, id);
    await ctx.db.delete(id);
    return { success: true };
  },
});

/**
 * Delete all read notifications for the current user. Useful for keeping
 * the list clean without having to delete one at a time.
 */
export const deleteAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await requireClerkUserId(ctx);
    const all = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkUserId", clerkUserId),
      )
      .collect();

    let count = 0;
    for (const row of all) {
      if (row.readAt) {
        await ctx.db.delete(row._id);
        count++;
      }
    }
    return { count };
  },
});

/**
 * Delete every notification for the current user (read + unread). Used by
 * the "Clear all" action in the popover.
 */
export const deleteAll = mutation({
  args: {},
  handler: async (ctx) => {
    const clerkUserId = await requireClerkUserId(ctx);
    const all = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) =>
        q.eq("recipientClerkUserId", clerkUserId),
      )
      .collect();

    for (const row of all) {
      await ctx.db.delete(row._id);
    }
    return { count: all.length };
  },
});
