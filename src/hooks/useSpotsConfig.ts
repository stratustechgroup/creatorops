import { useQuery } from "convex/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../convex/_generated/api";

export function useSpotsConfig() {
  const data = useQuery(api.admin.getSpotsConfig) as
    | { totalSpots: number; spotsTaken: number; spotsRemaining: number }
    | undefined;

  return {
    totalSpots: data?.totalSpots ?? 10,
    spotsTaken: data?.spotsTaken ?? 5,
    spotsRemaining: data?.spotsRemaining ?? 5,
    loading: data === undefined,
  };
}
