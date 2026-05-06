import { useQuery } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

// Types based on Pterodactyl Application API responses
export interface ServerListItem {
  id: number;
  identifier: string;
  uuid: string;
  name: string;
  description: string;
  suspended: boolean;
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
  user: number;
  node: number;
  created_at: string;
  updated_at: string;
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
