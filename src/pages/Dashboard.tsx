import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Database, Globe, ShieldCheck } from "lucide-react";

import {
  useServers,
  useServerBackups,
  useServerResources,
  type ServerListItem,
} from "@/hooks/usePterodactyl";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  ActivityFeed,
  type ActivityEvent,
} from "@/components/dashboard/ActivityFeed";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ---------- helpers ----------

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

function formatRelative(timestamp: number, now: number): string {
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(timestamp).toLocaleDateString();
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ---------- per-server data collector ----------

type ServerSnapshot = {
  identifier: string;
  name: string;
  state: string | null;
  events: ActivityEvent[];
  backupsAllTime: number;
  backupsLast7d: number;
  lastFailedBackupAt: number | null;
};

interface ServerStatsCollectorProps {
  server: ServerListItem;
  onSnapshot: (snapshot: ServerSnapshot) => void;
}

/**
 * Invisible component: subscribes to per-server resources and backups,
 * then reports a snapshot up to the parent. Lets us aggregate across
 * many servers without breaking hook rules.
 */
function ServerStatsCollector({ server, onSnapshot }: ServerStatsCollectorProps) {
  const { data: resourcesData } = useServerResources(server.identifier);
  const { data: backupsData } = useServerBackups(server.identifier);

  const state = resourcesData?.attributes?.current_state ?? null;
  const backups = backupsData?.data ?? [];

  // Stable identity from raw data so we only push when something meaningful
  // changes — prevents render loops.
  const backupsKey = backups
    .map((b) => `${b.attributes.uuid}:${b.attributes.is_successful}`)
    .join("|");

  useEffect(() => {
    const now = Date.now();
    const events: ActivityEvent[] = [];
    let backupsLast7d = 0;
    let lastFailedBackupAt: number | null = null;

    for (const entry of backups) {
      const b = entry.attributes;
      const tsRaw = b.completed_at ?? b.created_at;
      const ts = tsRaw ? new Date(tsRaw).getTime() : NaN;
      if (!Number.isFinite(ts)) continue;

      if (now - ts <= SEVEN_DAYS_MS) backupsLast7d += 1;

      if (!b.is_successful) {
        if (lastFailedBackupAt === null || ts > lastFailedBackupAt) {
          lastFailedBackupAt = ts;
        }
      }

      events.push({
        id: b.uuid,
        type: b.is_successful ? "backup_success" : "backup_failed",
        title: b.is_successful ? "Backup completed" : "Backup failed",
        description:
          (b.name ?? "Backup") +
          (b.bytes ? `, ${formatBytes(b.bytes)}` : ""),
        timestamp: ts,
        serverName: server.name,
      });
    }

    onSnapshot({
      identifier: server.identifier,
      name: server.name,
      state,
      events,
      backupsAllTime: backups.length,
      backupsLast7d,
      lastFailedBackupAt,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server.identifier, state, backupsKey]);

  return null;
}

// ---------- page ----------

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: serversData, isLoading, error } = useServers();

  const servers = useMemo(
    () => (serversData?.data ?? []).map((s) => s.attributes),
    [serversData],
  );

  const [snapshots, setSnapshots] = useState<Record<string, ServerSnapshot>>({});

  // Drop snapshots for servers that no longer exist
  useEffect(() => {
    setSnapshots((prev) => {
      const known = new Set(servers.map((s) => s.identifier));
      let changed = false;
      const next: Record<string, ServerSnapshot> = {};
      for (const [id, snap] of Object.entries(prev)) {
        if (known.has(id)) {
          next[id] = snap;
        } else {
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [servers]);

  const handleSnapshot = useMemo(
    () =>
      (snap: ServerSnapshot) =>
        setSnapshots((prev) => ({ ...prev, [snap.identifier]: snap })),
    [],
  );

  // Aggregated stats
  const onlineCount = Object.values(snapshots).filter(
    (s) => s.state === "running",
  ).length;
  const haveAnyState = Object.values(snapshots).some((s) => s.state !== null);
  const unreachableCount = Object.values(snapshots).filter(
    (s) => s.state !== null && !["running", "starting", "stopping", "offline"].includes(s.state),
  ).length;
  const transitionalCount = Object.values(snapshots).filter(
    (s) => s.state === "starting" || s.state === "offline",
  ).length;

  const totalBackupsAllTime = Object.values(snapshots).reduce(
    (acc, s) => acc + s.backupsAllTime,
    0,
  );
  const totalBackupsLast7d = Object.values(snapshots).reduce(
    (acc, s) => acc + s.backupsLast7d,
    0,
  );
  const haveAnyBackupData = Object.values(snapshots).length > 0;

  const lastFailedBackupAt = Object.values(snapshots).reduce<number | null>(
    (acc, s) => {
      if (s.lastFailedBackupAt === null) return acc;
      if (acc === null) return s.lastFailedBackupAt;
      return Math.max(acc, s.lastFailedBackupAt);
    },
    null,
  );

  const allEvents = useMemo<ActivityEvent[]>(() => {
    const out: ActivityEvent[] = [];
    for (const snap of Object.values(snapshots)) {
      out.push(...snap.events);
    }
    out.sort((a, b) => b.timestamp - a.timestamp);
    return out;
  }, [snapshots]);

  // Banner variant
  const banner: {
    variant: "operational" | "warning" | "critical";
    title: string;
    detail?: string;
  } = (() => {
    if (servers.length === 0) {
      return { variant: "operational", title: "All worlds operational" };
    }
    if (unreachableCount > 0) {
      return {
        variant: "critical",
        title: `${unreachableCount} world${unreachableCount === 1 ? "" : "s"} unreachable`,
        detail: "Check server health",
      };
    }
    if (transitionalCount > 0) {
      return {
        variant: "warning",
        title: "Some worlds need attention",
        detail: `${transitionalCount} starting or stopped`,
      };
    }
    if (!haveAnyState) {
      return {
        variant: "operational",
        title: "All worlds operational",
        detail: `${servers.length} world${servers.length === 1 ? "" : "s"} on your account`,
      };
    }
    return {
      variant: "operational",
      title: "All worlds operational",
      detail: `${servers.length} world${servers.length === 1 ? "" : "s"} running`,
    };
  })();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["servers"] });
    queryClient.invalidateQueries({ queryKey: ["server-resources"] });
    queryClient.invalidateQueries({ queryKey: ["server-backups"] });
  };

  // ---------- error state ----------

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reach the dashboard. Please try again in a moment.";
    return (
      <DashboardLayout>
        <PageHeader />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            Couldn't reach the dashboard
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {message}
          </p>
          <Button onClick={handleRetry} variant="default">
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // ---------- loading state ----------

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader />

        <div className="mb-8">
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Worlds online"
            value="—"
            icon={Globe}
            loading
          />
          <MetricCard
            label="Total worlds"
            value="—"
            icon={Database}
            loading
          />
          <MetricCard
            label="Backups (7d)"
            value="—"
            icon={ShieldCheck}
            loading
          />
          <MetricCard
            label="Last incident"
            value="—"
            icon={AlertCircle}
            loading
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Your worlds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </section>
          <aside className="lg:col-span-1">
            <ActivityFeed events={[]} loading />
          </aside>
        </div>
      </DashboardLayout>
    );
  }

  // ---------- empty state ----------

  if (servers.length === 0) {
    return (
      <DashboardLayout>
        <PageHeader />
        <EmptyDashboard />
      </DashboardLayout>
    );
  }

  // ---------- normal state ----------

  return (
    <DashboardLayout>
      {/* Hidden collectors — one per server, populate `snapshots` */}
      {servers.map((server) => (
        <ServerStatsCollector
          key={server.identifier}
          server={server}
          onSnapshot={handleSnapshot}
        />
      ))}

      <PageHeader />

      <div className="mb-8">
        <StatusBanner
          variant={banner.variant}
          title={banner.title}
          detail={banner.detail}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Worlds online"
          value={haveAnyState ? onlineCount : "—"}
          helperText={
            haveAnyState
              ? `of ${servers.length} total`
              : "Awaiting status"
          }
          icon={Globe}
        />
        <MetricCard
          label="Total worlds"
          value={servers.length}
          helperText="across your account"
          icon={Database}
        />
        <MetricCard
          label={
            haveAnyBackupData && totalBackupsLast7d > 0
              ? "Backups (7d)"
              : "Backups"
          }
          value={
            haveAnyBackupData
              ? totalBackupsLast7d > 0
                ? totalBackupsLast7d
                : totalBackupsAllTime
              : "—"
          }
          helperText={
            haveAnyBackupData
              ? totalBackupsLast7d > 0
                ? "successful + failed"
                : "all time"
              : "Awaiting data"
          }
          icon={ShieldCheck}
        />
        <MetricCard
          label="Last incident"
          value={
            lastFailedBackupAt
              ? formatRelative(lastFailedBackupAt, Date.now())
              : "—"
          }
          helperText={
            lastFailedBackupAt
              ? "Most recent failed backup"
              : "No incidents recorded"
          }
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Your worlds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((server) => (
              <ServerCard key={server.identifier} server={server} />
            ))}
          </div>
        </section>
        <aside className="lg:col-span-1">
          <ActivityFeed
            events={allEvents}
            maxItems={8}
            emptyMessage="Backups will appear here once your worlds are live."
          />
        </aside>
      </div>
    </DashboardLayout>
  );
}

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Operational status across your managed worlds.
      </p>
    </div>
  );
}
