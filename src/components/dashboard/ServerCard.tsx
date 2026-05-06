import { useState } from "react";
import {
  useServerResources,
  useServerBackups,
  usePowerSignal,
  formatDate,
  ServerListItem,
  type PowerSignal,
} from "@/hooks/usePterodactyl";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, RotateCcw, Server, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerCardProps {
  server: ServerListItem;
}

type ServerStatus = "running" | "starting" | "stopping" | "offline" | "suspended" | "unknown";

const STATUS_TOKENS: Record<
  ServerStatus,
  { className: string; label: string; pulse: boolean }
> = {
  running: {
    className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    label: "Running",
    pulse: true,
  },
  offline: {
    className: "text-muted-foreground bg-white/[0.04] border-white/10",
    label: "Stopped",
    pulse: false,
  },
  starting: {
    className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    label: "Starting",
    pulse: false,
  },
  stopping: {
    className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    label: "Stopping",
    pulse: false,
  },
  suspended: {
    className: "text-red-400 bg-red-500/10 border-red-500/20",
    label: "Suspended",
    pulse: false,
  },
  unknown: {
    className: "text-red-400 bg-red-500/10 border-red-500/20",
    label: "Unknown",
    pulse: false,
  },
};

function getThresholdColor(percent: number): string {
  if (percent > 85) return "bg-red-500/70";
  if (percent >= 60) return "bg-amber-500/70";
  return "bg-emerald-500/70";
}

function formatGB(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return gb.toFixed(1);
}

function formatLimitGB(megabytes: number): string {
  // Pterodactyl reports limits in MiB. Convert to GB display.
  const gb = megabytes / 1024;
  // Show whole numbers without decimal when clean.
  return gb >= 10 || Number.isInteger(gb)
    ? gb.toFixed(0)
    : gb.toFixed(1);
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(iso);
}

export function ServerCard({ server }: ServerCardProps) {
  const {
    data: resourcesData,
    isLoading: resourcesLoading,
    isError: resourcesError,
  } = useServerResources(server.identifier);
  const {
    data: backupsData,
    isLoading: backupsLoading,
    isError: backupsError,
  } = useServerBackups(server.identifier);
  const powerSignal = usePowerSignal(server.identifier);
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState<"stop" | "restart" | null>(
    null,
  );

  const rawState = resourcesData?.attributes?.current_state;
  const resources = resourcesData?.attributes?.resources;

  const status: ServerStatus = (server.suspended || server.is_suspended)
    ? "suspended"
    : resourcesError
    ? "unknown"
    : (rawState as ServerStatus | undefined) ?? "unknown";

  const statusToken = STATUS_TOKENS[status] ?? STATUS_TOKENS.unknown;

  // Resource percentages — null when unavailable.
  const cpuPercent =
    resourcesError || !resources
      ? null
      : Math.min(resources.cpu_absolute ?? 0, 100);

  const memoryUsedBytes = resources?.memory_bytes ?? null;
  const memoryLimitBytes = server.limits.memory * 1024 * 1024;
  const memoryPercent =
    resourcesError || memoryUsedBytes == null || memoryLimitBytes === 0
      ? null
      : Math.min((memoryUsedBytes / memoryLimitBytes) * 100, 100);

  const diskUsedBytes = resources?.disk_bytes ?? null;
  const diskLimitBytes = server.limits.disk * 1024 * 1024;
  const diskPercent =
    resourcesError || diskUsedBytes == null || diskLimitBytes === 0
      ? null
      : Math.min((diskUsedBytes / diskLimitBytes) * 100, 100);

  // Backups
  const backups = backupsData?.data ?? [];
  const successfulBackups = backups
    .filter((b) => b.attributes.is_successful)
    .sort(
      (a, b) =>
        new Date(b.attributes.created_at).getTime() -
        new Date(a.attributes.created_at).getTime()
    );
  const lastBackup = successfulBackups[0]?.attributes;

  // Try to derive a tier from the description (Solo/Plus/Pro/Studio).
  const tierMatch = server.description?.match(/\b(Solo|Plus|Pro|Studio)\b/i);
  const tier = tierMatch ? tierMatch[1].charAt(0).toUpperCase() + tierMatch[1].slice(1).toLowerCase() : null;

  const handleClick = () => {
    // TODO: route to server detail page
    console.debug("server detail not yet implemented", server.identifier);
  };

  // Power state — derives which buttons are enabled. Transitional states
  // (starting/stopping) and unknown/suspended disable everything to avoid
  // double-actioning during a transition.
  const isRunning = status === "running";
  const isOffline = status === "offline";
  const isTransitioning = status === "starting" || status === "stopping";
  const isPending = powerSignal.isPending;
  const allDisabled = isTransitioning || isPending || status === "suspended" || status === "unknown";

  const executePowerSignal = async (signal: PowerSignal) => {
    try {
      await powerSignal.mutateAsync(signal);
      const verb =
        signal === "start"
          ? "Starting"
          : signal === "restart"
          ? "Restarting"
          : signal === "stop"
          ? "Stopping"
          : "Killing";
      toast({
        title: `${verb} ${server.name}…`,
        description: "Status will refresh in a moment.",
      });
    } catch (error) {
      toast({
        title: "Power action failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handlePowerClick =
    (signal: PowerSignal) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // Restart and stop disconnect players — confirm before firing.
      if (signal === "restart" || signal === "stop") {
        setConfirmAction(signal);
        return;
      }
      void executePowerSignal(signal);
    };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="rounded-xl bg-card border border-white/10 hover:border-white/20 p-6 cursor-pointer transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {/* Row 1: Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Server className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-semibold text-foreground truncate">
            {server.name}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground truncate">
              {server.identifier}
            </span>
            {tier && (
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
                {tier}
              </span>
            )}
          </div>
        </div>
        <div
          className={`ml-auto flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border ${statusToken.className}`}
        >
          {statusToken.pulse ? (
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
          )}
          <span>{statusToken.label}</span>
        </div>
      </div>

      {/* Row 2: Resources */}
      <div className="grid grid-cols-3 gap-4 mt-5">
        <ResourceMetric
          label="CPU"
          value={
            cpuPercent == null ? null : `${cpuPercent.toFixed(0)}%`
          }
          percent={cpuPercent}
          isLoading={resourcesLoading}
        />
        <ResourceMetric
          label="Memory"
          value={
            memoryUsedBytes == null
              ? null
              : `${formatGB(memoryUsedBytes)} / ${formatLimitGB(server.limits.memory)} GB`
          }
          percent={memoryPercent}
          isLoading={resourcesLoading}
        />
        <ResourceMetric
          label="Disk"
          value={
            diskUsedBytes == null
              ? null
              : `${formatGB(diskUsedBytes)} / ${formatLimitGB(server.limits.disk)} GB`
          }
          percent={diskPercent}
          isLoading={resourcesLoading}
        />
      </div>

      {/* Row 3: Footer */}
      <div className="border-t border-white/5 mt-5 pt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Last backup</div>
          {backupsLoading ? (
            <Skeleton className="h-4 w-16 mt-1" />
          ) : backupsError || !lastBackup ? (
            <div className="font-mono text-sm text-muted-foreground">
              {backupsError ? "—" : "Never"}
            </div>
          ) : (
            <div className="font-mono text-sm text-foreground">
              {formatRelativeTime(lastBackup.created_at)}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Version</div>
          <div className="font-mono text-sm text-foreground">—</div>
        </div>
      </div>

      {/* Row 4: Power controls */}
      <div className="border-t border-white/5 mt-4 pt-4 flex items-center justify-end gap-2">
        <PowerButton
          icon={isPending && powerSignal.variables === "start" ? Loader2 : Play}
          label="Start"
          onClick={handlePowerClick("start")}
          disabled={allDisabled || !isOffline}
          spinning={isPending && powerSignal.variables === "start"}
          tone="default"
        />
        <PowerButton
          icon={
            isPending && powerSignal.variables === "restart" ? Loader2 : RotateCcw
          }
          label="Restart"
          onClick={handlePowerClick("restart")}
          disabled={allDisabled || !isRunning}
          spinning={isPending && powerSignal.variables === "restart"}
          tone="default"
        />
        <PowerButton
          icon={isPending && powerSignal.variables === "stop" ? Loader2 : Square}
          label="Stop"
          onClick={handlePowerClick("stop")}
          disabled={allDisabled || !isRunning}
          spinning={isPending && powerSignal.variables === "stop"}
          tone="danger"
        />
      </div>

      {/* Confirmation for stop/restart — both kick players off. */}
      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "restart"
                ? `Restart ${server.name}?`
                : `Stop ${server.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "restart"
                ? "All players currently online will be disconnected. They can rejoin once the world is back up — usually within 30 seconds."
                : "All players currently online will be disconnected. The world will stay offline until you start it again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                const action = confirmAction;
                setConfirmAction(null);
                if (action) void executePowerSignal(action);
              }}
              className={
                confirmAction === "stop"
                  ? "bg-red-500/90 hover:bg-red-500 text-white"
                  : undefined
              }
            >
              {confirmAction === "restart" ? "Restart" : "Stop"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PowerButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  spinning,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  spinning: boolean;
  tone: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-colors",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        tone === "danger"
          ? "border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
          : "border-white/10 text-foreground/80 hover:bg-white/[0.04] hover:border-white/20 hover:text-foreground",
      )}
    >
      <Icon className={cn("w-3.5 h-3.5", spinning && "animate-spin")} />
      {label}
    </button>
  );
}

function ResourceMetric({
  label,
  value,
  percent,
  isLoading,
}: {
  label: string;
  value: string | null;
  percent: number | null;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {isLoading ? (
        <Skeleton className="h-4 w-16" />
      ) : (
        <div className="text-sm font-mono text-foreground">
          {value ?? "—"}
        </div>
      )}
      <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
        {percent != null && !isLoading && (
          <div
            className={`h-full rounded-full transition-all duration-300 ${getThresholdColor(percent)}`}
            style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
          />
        )}
      </div>
    </div>
  );
}
