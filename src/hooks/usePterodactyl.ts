import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export type PowerSignal = "start" | "stop" | "restart" | "kill";

// Types based on Pterodactyl Client API (`GET /api/client` and
// `GET /api/client/servers/{id}`). The proxy normalizes `is_suspended` to
// `suspended` so existing UI consumers keep working. Application-API-only
// fields (`user`, `node` as number, `created_at`, `updated_at`) are
// optional or absent — the client API doesn't expose them.
export interface ServerListItem {
  identifier: string;
  uuid: string;
  name: string;
  description: string;
  suspended: boolean;
  is_suspended?: boolean;
  server_owner?: boolean;
  internal_id?: number;
  node?: string;
  status?: string | null;
  is_installing?: boolean;
  is_transferring?: boolean;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads?: number | null;
    oom_disabled?: boolean;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
}

// Types for Client API responses (real-time data)
export interface ServerResources {
  current_state: "running" | "starting" | "stopping" | "offline";
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}

export interface Backup {
  uuid: string;
  name: string;
  ignored_files: string[];
  sha256_hash: string | null;
  bytes: number;
  created_at: string;
  completed_at: string | null;
  is_successful: boolean;
  is_locked: boolean;
}

export function useServers() {
  const proxy = useAction(api.pterodactyl.proxy);
  return useQuery({
    queryKey: ["servers"],
    queryFn: () =>
      proxy({ action: "list_servers" }) as Promise<{
        data: { attributes: ServerListItem }[];
      }>,
    staleTime: 60_000,
    retry: 2,
  });
}

export function useServerDetails(serverId: string | undefined) {
  const proxy = useAction(api.pterodactyl.proxy);
  return useQuery({
    queryKey: ["server-details", serverId],
    queryFn: () =>
      proxy({ action: "server_details", serverId }) as Promise<{
        attributes: ServerListItem;
      }>,
    staleTime: 60_000,
    enabled: !!serverId,
    retry: 1,
  });
}

export function useServerResources(serverId: string | undefined) {
  const proxy = useAction(api.pterodactyl.proxy);
  return useQuery({
    queryKey: ["server-resources", serverId],
    queryFn: () =>
      proxy({ action: "server_resources", serverId }) as Promise<{
        attributes: ServerResources;
      }>,
    refetchInterval: 30_000,
    enabled: !!serverId,
    retry: 1,
  });
}

export function useServerBackups(serverId: string | undefined) {
  const proxy = useAction(api.pterodactyl.proxy);
  return useQuery({
    queryKey: ["server-backups", serverId],
    queryFn: () =>
      proxy({ action: "server_backups", serverId }) as Promise<{
        data: { attributes: Backup }[];
      }>,
    staleTime: 5 * 60_000,
    enabled: !!serverId,
    retry: 1,
  });
}

/**
 * Send a power signal (start / stop / restart / kill) to a server.
 * Optimistically invalidates the resources query so status reflects the
 * change after a brief delay (Pterodactyl power is async — give the panel
 * a moment to update `current_state`).
 */
export function usePowerSignal(serverId: string | undefined) {
  const proxy = useAction(api.pterodactyl.proxy);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signal: PowerSignal) => {
      if (!serverId) throw new Error("Server ID required");
      return proxy({ action: "power_signal", serverId, signal }) as Promise<{
        success: true;
        signal: PowerSignal;
      }>;
    },
    onSuccess: () => {
      // Re-fetch resources after a short delay — Pterodactyl power signals
      // are async; the state transition isn't instant.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["server-resources", serverId] });
      }, 1500);
    },
  });
}

// Utility functions
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
