import { v, ConvexError } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { internal, api } from "./_generated/api";

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
    const appApiKey = process.env.PTERODACTYL_API_KEY;
    const clientApiKey = process.env.PTERODACTYL_CLIENT_API_KEY;

    // Pterodactyl not configured (pre-launch state). For list_servers, return
    // empty so the dashboard renders the welcome / empty state rather than
    // an error toast. Server-specific actions still throw — those imply the
    // caller already has a server and config really should be present.
    if (!process.env.PTERODACTYL_URL || !appApiKey) {
      if (pterodactylAction === "list_servers") {
        return { data: [] };
      }
      throw new ConvexError("Pterodactyl configuration missing");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    // Staff (admin/support/viewer) bypass per-user ownership filtering and
    // see every server on the panel — they're operating the platform, not
    // consuming it. Non-staff users see only servers they own per their
    // clientPterodactylUsers mapping.
    const staffStatus = await ctx.runQuery(api.admin.getStaffRole, {});
    const isStaff = staffStatus?.isStaff === true;

    let pterodactylUserId: number | null = null;
    if (!isStaff) {
      pterodactylUserId = await ctx.runQuery(
        internal.pterodactyl.getPterodactylUserId,
        { clerkUserId: identity.subject }
      );

      // No Pterodactyl mapping yet — normal for pending applicants and
      // users whose worlds aren't provisioned yet. Return empty results
      // instead of throwing so the dashboard renders the welcome / empty
      // state cleanly. Server-specific actions still throw because there's
      // no valid server to operate on.
      if (pterodactylUserId === null) {
        if (pterodactylAction === "list_servers") {
          return { data: [] };
        }
        throw new ConvexError("User not linked to Pterodactyl account");
      }
    }

    // For non-staff server-specific actions, verify the user owns this
    // server. Staff skip this check — they can hit any server on the panel.
    if (
      !isStaff &&
      serverId &&
      ["server_details", "server_resources", "server_backups"].includes(pterodactylAction)
    ) {
      const allServers = (await callPterodactyl("/api/application/servers", appApiKey)) as {
        data: { attributes: { user: number; identifier: string } }[];
      };
      const userServerIds = new Set(
        (allServers.data ?? [])
          .filter((s) => s.attributes.user === pterodactylUserId)
          .map((s) => s.attributes.identifier)
      );
      if (!userServerIds.has(serverId)) {
        throw new ConvexError("Access denied to this server");
      }
    }

    switch (pterodactylAction) {
      case "list_servers": {
        const data = (await callPterodactyl("/api/application/servers", appApiKey)) as {
          data: { attributes: { user: number } }[];
        };
        // Staff see everything; non-staff filtered to their own servers.
        if (isStaff) return data;
        return {
          ...data,
          data: (data.data ?? []).filter((s) => s.attributes.user === pterodactylUserId),
        };
      }

      case "server_details": {
        if (!serverId) throw new ConvexError("Server ID required");
        const data = (await callPterodactyl("/api/application/servers", appApiKey)) as {
          data: { attributes: { identifier: string; user: number } }[];
        };
        const server = (data.data ?? []).find((s) =>
          isStaff
            ? s.attributes.identifier === serverId
            : s.attributes.identifier === serverId &&
              s.attributes.user === pterodactylUserId,
        );
        if (!server) throw new ConvexError("Server not found");
        return server;
      }

      case "server_resources": {
        if (!clientApiKey) throw new ConvexError("Client API key not configured");
        if (!serverId) throw new ConvexError("Server ID required");
        return callPterodactyl(`/api/client/servers/${serverId}/resources`, clientApiKey);
      }

      case "server_backups": {
        if (!clientApiKey) throw new ConvexError("Client API key not configured");
        if (!serverId) throw new ConvexError("Server ID required");
        return callPterodactyl(`/api/client/servers/${serverId}/backups`, clientApiKey);
      }

      default:
        throw new ConvexError("Invalid action");
    }
  },
});
