import { v, ConvexError } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";

type PterodactylInit = {
  method?: "GET" | "POST";
  body?: unknown;
};

async function callPterodactyl(
  path: string,
  apiKey: string,
  init: PterodactylInit = {},
): Promise<unknown> {
  const rawUrl = process.env.PTERODACTYL_URL;
  if (!rawUrl) throw new ConvexError("PTERODACTYL_URL not configured");

  // Defensive: strip trailing slashes so `host/` + `/api/client` doesn't
  // produce a `host//api/client` that some panels 404.
  const url = rawUrl.replace(/\/+$/, "");
  const fullUrl = `${url}${path}`;

  const response = await fetch(fullUrl, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    // Include the full URL we hit in the error so 404s are easy to debug.
    throw new ConvexError(
      `Pterodactyl API error ${response.status} from ${fullUrl}: ${text}`,
    );
  }

  // Power signal endpoint returns 204 No Content with empty body.
  if (response.status === 204) return null;
  // Some endpoints (rare) return empty body with 200. Handle defensively.
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
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
      v.literal("server_backups"),
      v.literal("power_signal"),
    ),
    serverId: v.optional(v.string()),
    signal: v.optional(
      v.union(
        v.literal("start"),
        v.literal("stop"),
        v.literal("restart"),
        v.literal("kill"),
      ),
    ),
  },
  handler: async (ctx, { action: pterodactylAction, serverId, signal }) => {
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

    // Non-staff users are restricted to servers explicitly mapped to them
    // in the clientServers table. Each mapping carries per-server permissions
    // (view, power, backups) — we enforce those for sensitive actions.
    type ClientMapping = {
      serverIdentifier: string;
      permissions: ("view" | "power" | "backups")[];
    };
    let myMappings: ClientMapping[] = [];

    if (!isStaff) {
      myMappings = (await ctx.runQuery(
        internal.clientServers.getMyClientServers,
        {},
      )) as ClientMapping[];

      const allowedIds = new Set(myMappings.map((m) => m.serverIdentifier));

      // Per-server actions: gate access to mapped servers + check permissions.
      if (
        serverId &&
        ["server_details", "server_resources", "server_backups", "power_signal"].includes(
          pterodactylAction,
        )
      ) {
        if (!allowedIds.has(serverId)) {
          throw new ConvexError("Access denied to this server");
        }
        // Power requires the `power` permission specifically.
        if (pterodactylAction === "power_signal") {
          const mapping = myMappings.find((m) => m.serverIdentifier === serverId);
          if (!mapping?.permissions.includes("power")) {
            throw new ConvexError("You don't have power permission on this server");
          }
        }
        // Backups list requires the `backups` permission.
        if (pterodactylAction === "server_backups") {
          const mapping = myMappings.find((m) => m.serverIdentifier === serverId);
          if (!mapping?.permissions.includes("backups")) {
            throw new ConvexError("You don't have backup permission on this server");
          }
        }
      }
    }

    switch (pterodactylAction) {
      case "list_servers": {
        const data = (await callPterodactyl("/api/client", clientKey)) as {
          data: { attributes: Record<string, unknown> }[];
        };
        // Normalize is_suspended -> suspended for UI consumers. Cast preserves
        // the index signature so downstream `.attributes.identifier` reads
        // typecheck without widening to `unknown`.
        type NormalizedServer = {
          attributes: Record<string, unknown> & { suspended: boolean };
        };
        const normalized: NormalizedServer[] = (data.data ?? []).map((s) => ({
          ...s,
          attributes: {
            ...s.attributes,
            suspended: Boolean(s.attributes.is_suspended),
          },
        }));
        // Staff see everything; non-staff see only mapped servers.
        if (isStaff) return { ...data, data: normalized };
        const allowedIds = new Set(myMappings.map((m) => m.serverIdentifier));
        return {
          ...data,
          data: normalized.filter((s) =>
            allowedIds.has(String(s.attributes.identifier ?? "")),
          ),
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

      case "power_signal": {
        if (!serverId) throw new ConvexError("Server ID required");
        if (!signal) throw new ConvexError("Power signal required");
        await callPterodactyl(
          `/api/client/servers/${serverId}/power`,
          clientKey,
          { method: "POST", body: { signal } },
        );
        return { success: true, signal };
      }

      default:
        throw new ConvexError("Invalid action");
    }
  },
});
