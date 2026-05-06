import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type NotificationSeverity = "info" | "success" | "warning" | "urgent";

export interface NotificationDoc {
  _id: Id<"notifications">;
  _creationTime: number;
  recipientClerkUserId: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  body?: string;
  link?: string;
  metadata?: unknown;
  readAt?: number;
  createdAt: number;
}

/**
 * useNotifications — wraps the Convex notifications module for the dashboard
 * UI. Realtime by default (Convex queries are reactive — when a fan-out
 * inserts a new row, this hook re-renders without polling).
 */
export function useNotifications(limit = 25) {
  const notifications = useQuery(api.notifications.listMine, { limit }) as
    | NotificationDoc[]
    | undefined;
  const unreadCount = useQuery(api.notifications.unreadCountMine) ?? 0;

  const markReadMutation = useMutation(api.notifications.markRead);
  const markReadAndGetLinkMutation = useMutation(api.notifications.markReadAndGetLink);
  const markAllReadMutation = useMutation(api.notifications.markAllRead);
  const deleteOneMutation = useMutation(api.notifications.deleteNotification);
  const deleteAllReadMutation = useMutation(api.notifications.deleteAllRead);
  const deleteAllMutation = useMutation(api.notifications.deleteAll);

  const navigate = useNavigate();

  const markRead = useCallback(
    (id: Id<"notifications">) => markReadMutation({ id }),
    [markReadMutation],
  );

  const markAllRead = useCallback(() => markAllReadMutation({}), [markAllReadMutation]);

  const deleteOne = useCallback(
    (id: Id<"notifications">) => deleteOneMutation({ id }),
    [deleteOneMutation],
  );

  const deleteAllRead = useCallback(() => deleteAllReadMutation({}), [deleteAllReadMutation]);

  const deleteAll = useCallback(() => deleteAllMutation({}), [deleteAllMutation]);

  /**
   * Click handler: marks the notification read AND navigates to its link
   * in one round-trip. If there's no link, just marks read.
   */
  const openNotification = useCallback(
    async (id: Id<"notifications">) => {
      const result = await markReadAndGetLinkMutation({ id });
      if (result.link) {
        navigate(result.link);
      }
      return result.link;
    },
    [markReadAndGetLinkMutation, navigate],
  );

  return {
    notifications,
    unreadCount,
    isLoading: notifications === undefined,
    markRead,
    markAllRead,
    deleteOne,
    deleteAllRead,
    deleteAll,
    openNotification,
  };
}
