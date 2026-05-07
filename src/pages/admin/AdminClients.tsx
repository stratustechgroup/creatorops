import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Eye,
  KeyRound,
  Power,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useServers } from "@/hooks/usePterodactyl";

type Permission = "view" | "power" | "backups";

type Mapping = {
  _id: string;
  clerkUserId?: string;
  email: string;
  serverIdentifier: string;
  serverName: string;
  permissions: Permission[];
  addedByEmail: string;
  addedAt: number;
  notes?: string;
};

const PERMISSION_META: Record<
  Permission,
  { label: string; help: string; icon: React.ComponentType<{ className?: string }> }
> = {
  view: {
    label: "View",
    help: "See world status, resource bars, and activity",
    icon: Eye,
  },
  power: {
    label: "Power",
    help: "Start, stop, and restart the world",
    icon: Power,
  },
  backups: {
    label: "Backups",
    help: "List + (later) download backup files",
    icon: ShieldCheck,
  },
};

const PERMISSION_ORDER: Permission[] = ["view", "power", "backups"];

function formatDate(ts: number): string {
  const date = new Date(ts);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays < 1) return "today";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function AdminClients() {
  const mappings = useQuery(api.clientServers.listMappings) as
    | Mapping[]
    | undefined;
  const addMapping = useMutation(api.clientServers.addMapping);
  const updatePermissions = useMutation(api.clientServers.updatePermissions);
  const removeMapping = useMutation(api.clientServers.removeMapping);
  const { data: serversData, isLoading: serversLoading } = useServers();
  const { toast } = useToast();

  const servers = useMemo(
    () => (serversData?.data ?? []).map((s) => s.attributes),
    [serversData],
  );

  // Form state
  const [email, setEmail] = useState("");
  const [serverIdentifier, setServerIdentifier] = useState("");
  const [permissions, setPermissions] = useState<Set<Permission>>(
    new Set(["view", "power"]),
  );
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const togglePermission = (p: Permission) => {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const handleAdd = async () => {
    if (!email.trim() || !serverIdentifier) return;
    if (permissions.size === 0) {
      toast({
        title: "Pick at least one permission",
        variant: "destructive",
      });
      return;
    }
    const selectedServer = servers.find((s) => s.identifier === serverIdentifier);
    if (!selectedServer) {
      toast({
        title: "Server not found",
        description: "Refresh and try again.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      await addMapping({
        email: email.trim(),
        serverIdentifier,
        serverName: selectedServer.name,
        permissions: Array.from(permissions),
        notes: notes.trim() || undefined,
      });
      toast({
        title: "Client mapped to server",
        description: `${email.trim()} now has access to ${selectedServer.name}.`,
      });
      setEmail("");
      setServerIdentifier("");
      setPermissions(new Set(["view", "power"]));
      setNotes("");
    } catch (err) {
      toast({
        title: "Failed to add mapping",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePermissionInline = async (
    mapping: Mapping,
    permission: Permission,
  ) => {
    const next = new Set(mapping.permissions);
    if (next.has(permission)) next.delete(permission);
    else next.add(permission);
    if (next.size === 0) {
      toast({
        title: "Mapping must have at least one permission",
        description: "Remove the mapping instead if they should lose all access.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      await updatePermissions({
        id: mapping._id as never,
        permissions: Array.from(next),
      });
    } catch (err) {
      toast({
        title: "Failed to update permissions",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    setBusy(true);
    try {
      await removeMapping({ id: id as never });
      toast({ title: "Mapping removed" });
    } catch (err) {
      toast({
        title: "Failed to remove",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
      setConfirmRemoveId(null);
    }
  };

  const confirmTarget = mappings?.find((m) => m._id === confirmRemoveId) ?? null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Map customers to the Pterodactyl servers they're allowed to see in
          their dashboard. Mappings can be created before the customer signs
          in — they activate automatically the first time their email matches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Add form */}
        <div className="rounded-xl bg-card border border-white/10 p-6 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold">Add mapping</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="client-email">Customer email</Label>
              <Input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                className="font-mono mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Mapping activates when this user signs in for the first time.
              </p>
            </div>

            <div>
              <Label htmlFor="client-server">Server</Label>
              <Select
                value={serverIdentifier}
                onValueChange={setServerIdentifier}
                disabled={serversLoading || servers.length === 0}
              >
                <SelectTrigger id="client-server" className="mt-1">
                  <SelectValue
                    placeholder={
                      serversLoading
                        ? "Loading servers…"
                        : servers.length === 0
                        ? "No servers found"
                        : "Pick a server"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((s) => (
                    <SelectItem key={s.identifier} value={s.identifier}>
                      <span className="font-medium">{s.name}</span>{" "}
                      <span className="text-muted-foreground font-mono text-xs">
                        ({s.identifier})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="space-y-2 mt-2">
                {PERMISSION_ORDER.map((p) => {
                  const meta = PERMISSION_META[p];
                  const Icon = meta.icon;
                  return (
                    <label
                      key={p}
                      className="flex items-start gap-3 p-2.5 rounded-md border border-white/5 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={permissions.has(p)}
                        onCheckedChange={() => togglePermission(p)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-medium">
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {meta.help}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="client-notes">Notes (optional)</Label>
              <Textarea
                id="client-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Founding creator — approved 2026-04-22"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleAdd}
              disabled={busy || !email.trim() || !serverIdentifier}
              className="w-full"
            >
              {busy ? "Saving…" : "Add mapping"}
            </Button>
          </div>
        </div>

        {/* Mappings table */}
        <div className="rounded-xl bg-card border border-white/10 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-base font-semibold">Current mappings</h2>
            {mappings && (
              <span className="text-xs text-muted-foreground">
                {mappings.length} {mappings.length === 1 ? "mapping" : "mappings"}
              </span>
            )}
          </div>
          {mappings === undefined ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : mappings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No client mappings yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add a mapping to give a customer access to their world.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">World</th>
                    <th className="text-left px-4 py-3 font-medium">
                      Permissions
                    </th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                      Added
                    </th>
                    <th className="text-right px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => {
                    const isPending = !m.clerkUserId;
                    return (
                      <tr
                        key={m._id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span>{m.email}</span>
                            {isPending && (
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase tracking-wide bg-amber-500/10 text-amber-300 border-amber-500/20"
                                title="Mapping created — activates when this user signs in"
                              >
                                Pending sign-in
                              </Badge>
                            )}
                          </div>
                          {m.notes && (
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {m.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{m.serverName}</div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {m.serverIdentifier}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {PERMISSION_ORDER.map((p) => {
                              const meta = PERMISSION_META[p];
                              const Icon = meta.icon;
                              const has = m.permissions.includes(p);
                              return (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() =>
                                    handleTogglePermissionInline(m, p)
                                  }
                                  disabled={busy}
                                  title={`${has ? "Remove" : "Add"} ${meta.label}`}
                                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-colors ${
                                    has
                                      ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                                      : "border-white/5 text-muted-foreground/60 hover:border-white/10 hover:text-muted-foreground"
                                  }`}
                                >
                                  <Icon className="w-3 h-3" />
                                  {meta.label}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">
                          {formatDate(m.addedAt)}
                          <div className="text-[10px]">{m.addedByEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={busy}
                            onClick={() => setConfirmRemoveId(m._id)}
                            className="text-muted-foreground hover:text-red-400"
                            aria-label={`Remove mapping for ${m.email}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!confirmRemoveId}
        onOpenChange={(open) => !open && setConfirmRemoveId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this mapping?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget
                ? `${confirmTarget.email} will lose access to ${confirmTarget.serverName} immediately. This does not remove them as a sub-user on Pufferfish — do that separately if needed.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={() => confirmRemoveId && handleRemove(confirmRemoveId)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
