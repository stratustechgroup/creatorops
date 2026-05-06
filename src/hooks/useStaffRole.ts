import { useQuery } from "convex/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../convex/_generated/api";

export function useStaffRole() {
  const data = useQuery(api.admin.getStaffRole) as
    | {
        isStaff: boolean;
        role: "admin" | "support" | "viewer" | null;
        email: string | null;
      }
    | undefined;

  return {
    isStaff: data?.isStaff ?? false,
    role: data?.role ?? null,
    email: data?.email ?? null,
    loading: data === undefined,
  };
}
