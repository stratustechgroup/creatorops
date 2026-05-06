import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Sparkles } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module is added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type SpotsConfig = {
  totalSpots: number;
  spotsTaken: number;
  spotsRemaining: number;
};

type AuditLogEntry = {
  _id: string;
  actorEmail: string;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
};

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function AdminSpots() {
  const config = useQuery(api.admin.getSpotsConfig) as
    | SpotsConfig
    | undefined;
  const audit = useQuery(api.admin.listAuditLog) as
    | AuditLogEntry[]
    | undefined;
  const setSpots = useMutation(api.admin.setSpotsConfig);
  const { toast } = useToast();

  const [totalSpots, setTotal] = useState<string>("");
  const [spotsTaken, setTaken] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [busy, setBusy] = useState(false);

  // Initialize form once config loads
  useEffect(() => {
    if (config && totalSpots === "" && spotsTaken === "") {
      setTotal(String(config.totalSpots));
      setTaken(String(config.spotsTaken));
    }
  }, [config, totalSpots, spotsTaken]);

  const totalNum = Number(totalSpots);
  const takenNum = Number(spotsTaken);
  const valid =
    Number.isFinite(totalNum) &&
    Number.isFinite(takenNum) &&
    totalNum >= 0 &&
    takenNum >= 0 &&
    takenNum <= totalNum;
  const previewRemaining = valid ? totalNum - takenNum : null;

  const spotsAudit = (audit ?? []).filter(
    (a) => a.action === "spots.update" || a.action === "spots.set",
  );

  const handleSave = async () => {
    if (!valid) return;
    setBusy(true);
    try {
      await setSpots({
        totalSpots: totalNum,
        spotsTaken: takenNum,
        note: note.trim() || undefined,
      });
      toast({
        title: "Spots updated",
        description: `${totalNum - takenNum} remaining`,
      });
      setNote("");
    } catch (err) {
      toast({
        title: "Failed to save",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Spots</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage Founding Creator program availability shown on the marketing
          site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Current state */}
        <div className="rounded-xl bg-card border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold">Current state</h2>
          </div>

          {config === undefined ? (
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Total" value={config.totalSpots} />
              <Stat label="Taken" value={config.spotsTaken} />
              <Stat
                label="Remaining"
                value={config.spotsRemaining}
                accent
              />
            </div>
          )}
        </div>

        {/* Edit form */}
        <div className="rounded-xl bg-card border border-white/10 p-6">
          <h2 className="text-base font-semibold mb-4">Update spots</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="total">Total spots</Label>
                <Input
                  id="total"
                  type="number"
                  min={0}
                  value={totalSpots}
                  onChange={(e) => setTotal(e.target.value)}
                  className="font-mono mt-1"
                />
              </div>
              <div>
                <Label htmlFor="taken">Spots taken</Label>
                <Input
                  id="taken"
                  type="number"
                  min={0}
                  value={spotsTaken}
                  onChange={(e) => setTaken(e.target.value)}
                  className="font-mono mt-1"
                />
              </div>
            </div>

            <div className="rounded-lg bg-background/50 border border-white/5 p-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Remaining preview
              </span>
              <span
                className={`font-mono text-2xl font-semibold ${valid ? "text-primary" : "text-red-400"}`}
              >
                {previewRemaining ?? "—"}
              </span>
            </div>

            {!valid && (totalSpots || spotsTaken) ? (
              <p className="text-xs text-red-400">
                Total and taken must be non-negative numbers, and taken cannot
                exceed total.
              </p>
            ) : null}

            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="What changed?"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!valid || busy}
              className="w-full"
            >
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="rounded-xl bg-card border border-white/10 p-6">
        <h2 className="text-base font-semibold mb-4">Recent changes</h2>
        {audit === undefined ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : spotsAudit.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No changes recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {spotsAudit.map((entry) => {
              const meta = entry.metadata ?? {};
              return (
                <li
                  key={entry._id}
                  className="py-3 flex items-center gap-3 text-sm"
                >
                  <span className="font-mono text-xs text-muted-foreground truncate w-48">
                    {entry.actorEmail}
                  </span>
                  <span className="text-muted-foreground">
                    set spots →
                  </span>
                  <span className="font-mono text-xs">
                    {String(meta.totalSpots ?? "?")} total /{" "}
                    {String(meta.spotsTaken ?? "?")} taken
                  </span>
                  {meta.note ? (
                    <span className="text-xs text-muted-foreground italic truncate">
                      “{String(meta.note)}”
                    </span>
                  ) : null}
                  <span className="ml-auto text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {formatRelative(entry.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-background/50 border border-white/5 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
        {label}
      </div>
      <div
        className={`font-mono text-3xl font-semibold ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}
