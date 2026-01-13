import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useServerResources,
  useServerBackups,
  formatBytes,
  formatUptime,
  formatDate,
  ServerListItem,
} from "@/hooks/usePterodactyl";
import {
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  Archive,
  Loader2,
} from "lucide-react";

interface ServerCardProps {
  server: ServerListItem;
}

export function ServerCard({ server }: ServerCardProps) {
  const { data: resourcesData, isLoading: resourcesLoading, isError: resourcesError } =
    useServerResources(server.identifier);
  const { data: backupsData } = useServerBackups(server.identifier);

  const state = resourcesData?.attributes?.current_state ?? "offline";
  const resources = resourcesData?.attributes?.resources;

  // Calculate usage percentages
  const memoryPercent = resources
    ? (resources.memory_bytes / (server.limits.memory * 1024 * 1024)) * 100
    : 0;
  const diskPercent = resources
    ? (resources.disk_bytes / (server.limits.disk * 1024 * 1024)) * 100
    : 0;
  const cpuPercent = resources?.cpu_absolute ?? 0;

  const backups = backupsData?.data ?? [];
  const successfulBackups = backups.filter((b) => b.attributes.is_successful);
  const lastBackup = successfulBackups[0]?.attributes;

  // If resources failed to load (no client API key), show static view
  const showStaticView = resourcesError && !resourcesLoading;

  return (
    <Card className="border-white/5 hover:border-white/10 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base truncate">{server.name}</CardTitle>
              {server.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {server.description}
                </p>
              )}
            </div>
          </div>
          <StatusBadge
            state={state}
            isLoading={resourcesLoading}
            suspended={server.suspended}
            showStatic={showStaticView}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Uptime - only show if we have real-time data */}
        {!showStaticView && state === "running" && resources?.uptime && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Uptime: {formatUptime(resources.uptime)}</span>
          </div>
        )}

        {/* Resource metrics */}
        <div className="space-y-3">
          {/* CPU */}
          <ResourceRow
            icon={<Cpu className="w-4 h-4" />}
            label="CPU"
            value={showStaticView ? `${server.limits.cpu}%` : `${cpuPercent.toFixed(1)}%`}
            percent={showStaticView ? undefined : Math.min(cpuPercent, 100)}
            limit={`${server.limits.cpu}%`}
            showProgress={!showStaticView}
          />

          {/* Memory */}
          <ResourceRow
            icon={<MemoryStick className="w-4 h-4" />}
            label="Memory"
            value={showStaticView
              ? formatBytes(server.limits.memory * 1024 * 1024)
              : formatBytes(resources?.memory_bytes ?? 0)
            }
            percent={showStaticView ? undefined : Math.min(memoryPercent, 100)}
            limit={formatBytes(server.limits.memory * 1024 * 1024)}
            showProgress={!showStaticView}
          />

          {/* Disk */}
          <ResourceRow
            icon={<HardDrive className="w-4 h-4" />}
            label="Disk"
            value={showStaticView
              ? formatBytes(server.limits.disk * 1024 * 1024)
              : formatBytes(resources?.disk_bytes ?? 0)
            }
            percent={showStaticView ? undefined : Math.min(diskPercent, 100)}
            limit={formatBytes(server.limits.disk * 1024 * 1024)}
            showProgress={!showStaticView}
          />
        </div>

        {/* Backups section - only show if we have real-time data */}
        {!showStaticView && (
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Archive className="w-4 h-4" />
                <span>{successfulBackups.length} backups</span>
              </div>
              {lastBackup && (
                <span className="text-xs text-muted-foreground">
                  Last: {formatDate(lastBackup.created_at)}
                </span>
              )}
            </div>
            {lastBackup && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {lastBackup.name} ({formatBytes(lastBackup.bytes)})
              </p>
            )}
          </div>
        )}

        {/* Static view info */}
        {showStaticView && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs text-muted-foreground text-center">
              Real-time data unavailable
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  state,
  isLoading,
  suspended,
  showStatic,
}: {
  state: string;
  isLoading: boolean;
  suspended: boolean;
  showStatic: boolean;
}) {
  if (suspended) {
    return <Badge variant="destructive">Suspended</Badge>;
  }

  if (isLoading) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading
      </Badge>
    );
  }

  if (showStatic) {
    return (
      <Badge variant="default" className="gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        Active
      </Badge>
    );
  }

  const config: Record<
    string,
    { variant: "default" | "secondary" | "destructive"; label: string }
  > = {
    running: { variant: "default", label: "Online" },
    starting: { variant: "secondary", label: "Starting" },
    stopping: { variant: "secondary", label: "Stopping" },
    offline: { variant: "destructive", label: "Offline" },
  };

  const { variant, label } = config[state] ?? config.offline;

  return (
    <Badge variant={variant} className="gap-1.5">
      {state === "running" && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label}
    </Badge>
  );
}

function ResourceRow({
  icon,
  label,
  value,
  percent,
  limit,
  showProgress = true,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percent?: number;
  limit: string;
  showProgress?: boolean;
}) {
  // Color based on usage
  const getProgressColor = (pct: number) => {
    if (pct >= 90) return "bg-destructive";
    if (pct >= 70) return "bg-yellow-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="font-mono text-xs">
          {showProgress ? (
            <>
              {value} <span className="text-muted-foreground">/ {limit}</span>
            </>
          ) : (
            value
          )}
        </span>
      </div>
      {showProgress && percent !== undefined && (
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressColor(percent)}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
