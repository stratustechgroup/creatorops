import { v, ConvexError } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

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

    if (!process.env.PTERODACTYL_URL || !appApiKey) {
      throw new ConvexError("Pterodactyl configuration missing");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const pterodactylUserId = await ctx.runQuery(
      internal.pterodactyl.getPterodactylUserId,
      { clerkUserId: identity.subject }
    );

    if (pterodactylUserId === null) {
      throw new ConvexError("User not linked to Pterodactyl account");
    }

    // For server-specific actions, verify the user owns this server
    if (
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
        const server = (data.data ?? []).find(
          (s) => s.attributes.identifier === serverId && s.attributes.user === pterodactylUserId
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
