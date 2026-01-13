import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types based on Pterodactyl API responses
export interface ServerListItem {
  identifier: string;
  uuid: string;
  name: string;
  description: string;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
}

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

type PterodactylAction =
  | "list_servers"
  | "server_details"
  | "server_resources"
  | "server_backups";

async function callPterodactylProxy<T>(
  action: PterodactylAction,
  serverId?: string
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("pterodactyl-proxy", {
    body: { action, serverId },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch from Pterodactyl");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}

// List all servers for current user
export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: () =>
      callPterodactylProxy<{ data: { attributes: ServerListItem }[] }>(
        "list_servers"
      ),
    staleTime: 60_000, // 1 minute
    retry: 2,
  });
}

// Get real-time resources for a specific server
export function useServerResources(serverId: string | undefined) {
  return useQuery({
    queryKey: ["server-resources", serverId],
    queryFn: () =>
      callPterodactylProxy<{ attributes: ServerResources }>(
        "server_resources",
        serverId
      ),
    refetchInterval: 30_000, // Auto-refresh every 30 seconds
    enabled: !!serverId,
    retry: 1,
  });
}

// Get backups for a specific server
export function useServerBackups(serverId: string | undefined) {
  return useQuery({
    queryKey: ["server-backups", serverId],
    queryFn: () =>
      callPterodactylProxy<{ data: { attributes: Backup }[] }>(
        "server_backups",
        serverId
      ),
    staleTime: 5 * 60_000, // 5 minutes
    enabled: !!serverId,
    retry: 1,
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
