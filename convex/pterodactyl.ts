import { v, ConvexError } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { api } from "./_generated/api";

async function callPterodactyl(path: string, apiKey: string): Promise<unknown> {
  const url = process.env.PTERODACTYL_URL;
  if (!url) throw new ConvexError("PTERODACTYL_URL not configured");

  const response = await fetch(`${url}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ConvexError(`Pterodactyl API error ${response.status}: ${text}`);
  }

  return response.json();
}

export const getPterodactylUserId = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const mapping = await ctx.db
      .query("clientPterodactylUsers")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    return mapping?.pterodactylUserId ?? null;
  },
});

export const proxy = action({
  args: {
    action: v.union(
      v.literal("list_servers"),
      v.literal("server_details"),
      v.literal("server_resources"),
      v.literal("server_backups")
    ),
    serverId: v.optional(v.string()),
  },
  handler: async (ctx, { action: pterodactylAction, serverId }) => {
    // Single client-tier key (ptlc_*) covers everything we need:
    //   /api/client                          — list servers the key owner can see
    //   /api/client/servers/{id}             — server details
    //   /api/client/servers/{id}/resources   — live CPU/RAM/disk/uptime
    //   /api/client/servers/{id}/backups     — backup history
    //
    // We accept the key under either env name (CLIENT preferred, falls back
    // to API_KEY) so the existing PTERODACTYL_API_KEY env var keeps working
    // even though the application-tier endpoints are no longer used.
    const clientKey =
      process.env.PTERODACTYL_CLIENT_API_KEY ??
      process.env.PTERODACTYL_API_KEY;

    // Not configured (pre-launch state). For list_servers, return empty so
    // the dashboard renders the welcome / empty state rather than an error
    // toast. Server-specific actions still throw — those imply the caller
    // already has a server and config really should be present.
    if (!process.env.PTERODACTYL_URL || !clientKey) {
      if (pterodactylAction === "list_servers") {
        return { data: [] };
      }
      throw new ConvexError("Pterodactyl configuration missing");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    // Staff (admin/support/viewer) see everything the configured panel-admin
    // client key has access to — they're operating the platform, not
    // consuming it.
    //
    // Non-staff users currently get an empty list. The proper multi-tenant
    // path is to issue per-user client keys (or store a clerkUserId ->
    // serverIdentifier[] mapping) so each client only sees their own
    // servers. Until that's in place, we deliberately return nothing rather
    // than leak admin-scope data.
    const staffStatus = await ctx.runQuery(api.admin.getStaffRole, {});
    const isStaff = staffStatus?.isStaff === true;

    if (!isStaff) {
      if (pterodactylAction === "list_servers") {
        return { data: [] };
      }
      throw new ConvexError("Per-user Pterodactyl mapping not yet provisioned");
    }

    switch (pterodactylAction) {
      case "list_servers": {
        const data = (await callPterodactyl("/api/client", clientKey)) as {
          data: { attributes: Record<string, unknown> }[];
        };
        // Map is_suspended -> suspended so existing UI consumers keep working.
        return {
          ...data,
          data: (data.data ?? []).map((s) => ({
            ...s,
            attributes: {
              ...s.attributes,
              suspended: Boolean(s.attributes.is_suspended),
            },
          })),
        };
      }

      case "server_details": {
        if (!serverId) throw new ConvexError("Server ID required");
        const data = (await callPterodactyl(
          `/api/client/servers/${serverId}`,
          clientKey,
        )) as { attributes: Record<string, unknown> };
        return {
          ...data,
          attributes: {
            ...data.attributes,
            suspended: Boolean(data.attributes.is_suspended),
          },
        };
      }

      case "server_resources": {
        if (!serverId) throw new ConvexError("Server ID required");
        return callPterodactyl(
          `/api/client/servers/${serverId}/resources`,
          clientKey,
        );
      }

      case "server_backups": {
        if (!serverId) throw new ConvexError("Server ID required");
        return callPterodactyl(
          `/api/client/servers/${serverId}/backups`,
          clientKey,
        );
      }

      default:
        throw new ConvexError("Invalid action");
    }
  },
});
