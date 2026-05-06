import { Component, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  Info,
  Trash2,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, type NotificationDoc } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { Id } from "../../../convex/_generated/dataModel";

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const seconds = Math.max(0, Math.floor(diff / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

const severityRing: Record<NotificationDoc["severity"], string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  urgent: "bg-red-500/10 text-red-400",
};

const severityIcon: Record<NotificationDoc["severity"], React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: Check,
  warning: AlertCircle,
  urgent: AlertCircle,
};

interface NotificationRowProps {
  notification: NotificationDoc;
  onOpen: (id: Id<"notifications">) => void | Promise<unknown>;
  onDelete: (id: Id<"notifications">) => void | Promise<unknown>;
}

function NotificationRow({ notification, onOpen, onDelete }: NotificationRowProps) {
  const Icon = severityIcon[notification.severity];
  const isUnread = !notification.readAt;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "group relative flex gap-3 px-4 py-3 border-b border-white/5 last:border-0 transition-colors",
        "cursor-pointer hover:bg-white/[0.03]",
        isUnread && "bg-primary/[0.02]",
      )}
      onClick={() => onOpen(notification._id)}
    >
      {/* Severity indicator */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          severityRing[notification.severity],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-start gap-2">
          <p
            className={cn(
              "text-sm leading-snug truncate",
              isUnread ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span
              className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary"
              aria-label="Unread"
            />
          )}
        </div>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-snug">
            {notification.body}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground/70">
          {formatRelative(notification.createdAt)}
        </p>
      </div>

      {/* Delete button — appears on hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification._id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground"
        aria-label="Delete notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/**
 * Defense-in-depth: hide the bell entirely if anything inside throws — most
 * commonly because Convex hasn't pushed the `notifications` schema yet, or
 * the user's auth identity hasn't propagated. Better to render no bell than
 * to crash the whole dashboard.
 */
class NotificationBellErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") {
      // Surface in dev so it's debuggable, but don't break the dashboard.
      console.warn("[NotificationBell] hidden due to error:", error);
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function NotificationBellInner() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllRead,
    deleteOne,
    deleteAllRead,
    openNotification,
  } = useNotifications(25);

  const handleOpen = async (id: Id<"notifications">) => {
    setOpen(false);
    await openNotification(id);
  };

  const hasUnread = unreadCount > 0;
  const hasAny = (notifications?.length ?? 0) > 0;
  const hasRead = notifications?.some((n) => n.readAt) ?? false;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={
            hasUnread
              ? `Notifications (${unreadCount} unread)`
              : "Notifications"
          }
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center leading-none"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] max-w-[calc(100vw-2rem)] p-0 border-white/10 bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
            {hasUnread && (
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>
          {hasUnread && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : !hasAny ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                You're all caught up
              </p>
              <p className="text-xs text-muted-foreground">
                New notifications will appear here.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications!.map((n) => (
                <NotificationRow
                  key={n._id}
                  notification={n}
                  onOpen={handleOpen}
                  onDelete={(id) => void deleteOne(id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {hasRead && (
          <div className="border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => void deleteAllRead()}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear read
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function NotificationBell() {
  return (
    <NotificationBellErrorBoundary>
      <NotificationBellInner />
    </NotificationBellErrorBoundary>
  );
}
