import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Trash2, UserPlus } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module is added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { useStaffRole } from "@/hooks/useStaffRole";

type Role = "admin" | "support" | "viewer";

type StaffMember = {
  _id: string;
  email: string;
  clerkUserId?: string;
  role: Role;
  addedByEmail: string;
  addedAt: number;
  notes?: string;
};

const ROLE_PILL: Record<Role, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  support: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  viewer: "bg-muted text-muted-foreground border-white/10",
};

const ROLE_HELP: Record<Role, string> = {
  admin: "Full access — manage staff, applications, tickets, and settings.",
  support: "Respond to tickets and review applications.",
  viewer: "Read-only access to admin views.",
};

export default function AdminStaff() {
  const staff = useQuery(api.admin.listStaff) as StaffMember[] | undefined;
  const addStaff = useMutation(api.admin.addStaffMember);
  const updateRole = useMutation(api.admin.updateStaffRole);
  const removeStaff = useMutation(api.admin.removeStaffMember);
  const { email: currentEmail } = useStaffRole();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!email.trim()) return;
    setBusy(true);
    try {
      await addStaff({
        email: email.trim().toLowerCase(),
        role,
        notes: notes.trim() || undefined,
      });
      toast({ title: "Staff member added" });
      setEmail("");
      setNotes("");
      setRole("viewer");
    } catch (err) {
      toast({
        title: "Failed to add staff member",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: Role) => {
    setBusy(true);
    try {
      await updateRole({ id: id as never, role: newRole });
      toast({ title: "Role updated" });
    } catch (err) {
      toast({
        title: "Failed to update role",
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
      await removeStaff({ id: id as never });
      toast({ title: "Staff member removed" });
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

  const confirmRemoveTarget =
    staff?.find((s) => s._id === confirmRemoveId) ?? null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage who has access to the admin area.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Add form */}
        <div className="rounded-xl bg-card border border-white/10 p-6 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold">Add staff member</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="staff-email">Email</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@creatorops.gg"
                className="font-mono mt-1"
              />
            </div>
            <div>
              <Label htmlFor="staff-role">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as Role)}
              >
                <SelectTrigger id="staff-role" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                {ROLE_HELP[role]}
              </p>
            </div>
            <div>
              <Label htmlFor="staff-notes">Notes (optional)</Label>
              <Textarea
                id="staff-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={busy || !email.trim()}
              className="w-full"
            >
              {busy ? "Adding…" : "Add staff member"}
            </Button>
          </div>
        </div>

        {/* Staff table */}
        <div className="rounded-xl bg-card border border-white/10 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-base font-semibold">Current staff</h2>
          </div>
          {staff === undefined ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : staff.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">
              No staff members yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                    Added by
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                    Added
                  </th>
                  <th className="text-right px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => {
                  const isSelf =
                    !!currentEmail &&
                    s.email.toLowerCase() === currentEmail.toLowerCase();
                  return (
                    <tr
                      key={s._id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span>{s.email}</span>
                          {isSelf && (
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary border-primary/20"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isSelf ? (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${ROLE_PILL[s.role]}`}
                          >
                            {s.role}
                          </span>
                        ) : (
                          <Select
                            value={s.role}
                            onValueChange={(v) =>
                              handleRoleChange(s._id, v as Role)
                            }
                            disabled={busy}
                          >
                            <SelectTrigger className="h-8 w-32 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                        {s.addedByEmail}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                        {new Date(s.addedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSelf || busy}
                          onClick={() => setConfirmRemoveId(s._id)}
                          className="text-muted-foreground hover:text-red-400"
                          aria-label={`Remove ${s.email}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!confirmRemoveId}
        onOpenChange={(open) => !open && setConfirmRemoveId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmRemoveTarget
                ? `${confirmRemoveTarget.email} will lose admin access immediately. This can be undone by re-adding them.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={() =>
                confirmRemoveId && handleRemove(confirmRemoveId)
              }
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
