import { useServers } from "@/hooks/usePterodactyl";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ServerCard } from "@/components/dashboard/ServerCard";
import { AlertCircle, Server } from "lucide-react";

export default function Dashboard() {
  const { data: serversData, isLoading, error, isRefetching } = useServers();

  const servers = serversData?.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Worlds</h1>
            <p className="text-muted-foreground">
              Monitor your Minecraft server instances
            </p>
          </div>
          {isRefetching && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Updating...
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-xl border border-white/5 bg-card animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Failed to load servers</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {error instanceof Error
                ? error.message
                : "Unable to connect to the server. Please try again later."}
            </p>
          </div>
        )}

        {/* Server grid */}
        {!isLoading && !error && servers.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <ServerCard
                key={server.attributes.identifier}
                server={server.attributes}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && servers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No servers found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your account doesn't have any servers assigned yet. Contact support
              if you believe this is an error.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
