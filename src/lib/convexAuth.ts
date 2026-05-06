import { useAuth } from "@clerk/clerk-react";
import { useCallback, useMemo } from "react";

export function useConvexAuth() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      return (await getToken({ template: "convex", skipCache: forceRefreshToken })) ?? null;
    },
    [getToken]
  );

  return useMemo(
    () => ({
      isLoading: !isLoaded,
      isAuthenticated: isSignedIn ?? false,
      fetchAccessToken,
    }),
    [isLoaded, isSignedIn, fetchAccessToken]
  );
}
