import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type ActivityEventType =
  | "backup_success"
  | "backup_failed"
  | "monitor_alert"
  | "system_update"
  | "info";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description?: string;
  timestamp: number;
  serverName?: string;
}

export interface ActivityFeedProps {
  events: ActivityEvent[];
  emptyMessage?: string;
  maxItems?: number;
  loading?: boolean;
}

const eventStyles: Record<
  ActivityEventType,
  { icon: LucideIcon; container: string }
> = {
  backup_success: {
    icon: CheckCircle2,
    container: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  backup_failed: {
    icon: AlertCircle,
    container: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  monitor_alert: {
    icon: AlertTriangle,
    container: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  system_update: {
    icon: RefreshCw,
    container: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  info: {
    icon: Info,
    container: "text-muted-foreground bg-muted/40 border-white/10",
  },
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({
  events,
  emptyMessage = "No recent activity",
  maxItems = 8,
  loading = false,
}: ActivityFeedProps) {
  const visible = events.slice(0, maxItems);

  return (
    <div className="rounded-xl bg-card border border-white/10">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-foreground">
          Recent activity
        </h2>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>

      <div className="px-6 py-5">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-lg bg-muted/40 border border-white/10 text-muted-foreground flex items-center justify-center mb-3">
              <Inbox className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {visible.map((event) => {
              const cfg = eventStyles[event.type];
              const Icon = cfg.icon;
              return (
                <li key={event.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0",
                      cfg.container,
                    )}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{event.title}</p>
                    {event.description ? (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.description}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-2 mt-1">
                      {event.serverName ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {event.serverName}
                        </span>
                      ) : null}
                      {event.serverName ? (
                        <span
                          aria-hidden="true"
                          className="text-muted-foreground/60 text-xs"
                        >
                          ·
                        </span>
                      ) : null}
                      <span className="font-mono text-xs text-muted-foreground">
                        {relativeTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;
