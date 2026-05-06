import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { Inbox, Sparkles, Ticket, Users, ArrowRight } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module is added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type AdminApplication = {
  _id: string;
  formType: "founding" | "standard" | "studio" | "events";
  firstName: string;
  lastName: string;
  email: string;
  submittedAt: number;
  status: "pending" | "approved" | "rejected" | "needs_info";
};

type AdminTicket = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  category: string;
  subject: string;
  description: string;
  priority: "low" | "normal" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  submittedAt: number;
};

type StaffMember = {
  _id: string;
  email: string;
  role: "admin" | "support" | "viewer";
  addedByEmail: string;
  addedAt: number;
};

type SpotsConfig = {
  totalSpots: number;
  spotsTaken: number;
  spotsRemaining: number;
};

type AuditLogEntry = {
  _id: string;
  actorEmail: string;
  action: string;
  targetTable?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
};

const STATUS_PILL: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-300 border-red-500/20",
  needs_info: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  open: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  resolved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-white/10",
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

export default function AdminOverview() {
  const applications = useQuery(api.admin.listApplications) as
    | AdminApplication[]
    | undefined;
  const tickets = useQuery(api.admin.listSupportTickets) as
    | AdminTicket[]
    | undefined;
  const spots = useQuery(api.admin.getSpotsConfig) as SpotsConfig | undefined;
  const staff = useQuery(api.admin.listStaff) as StaffMember[] | undefined;
  const audit = useQuery(api.admin.listAuditLog) as AuditLogEntry[] | undefined;

  const pendingApps =
    applications?.filter((a) => a.status === "pending").length ?? 0;
  const openTickets =
    tickets?.filter((t) => t.status === "open").length ?? 0;
  const recentApps = (applications ?? [])
    .slice()
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .slice(0, 5);
  const recentOpenTickets = (tickets ?? [])
    .filter((t) => t.status === "open")
    .slice()
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .slice(0, 5);
  const recentAudit = (audit ?? []).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage applications, support tickets, and access.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Pending applications"
          value={pendingApps}
          icon={Inbox}
          loading={applications === undefined}
          helperText="Awaiting review"
        />
        <MetricCard
          label="Open tickets"
          value={openTickets}
          icon={Ticket}
          loading={tickets === undefined}
          helperText="Need response"
        />
        <MetricCard
          label="Spots remaining"
          value={spots?.spotsRemaining ?? "—"}
          icon={Sparkles}
          loading={spots === undefined}
          helperText={
            spots ? `${spots.spotsTaken}/${spots.totalSpots} taken` : undefined
          }
        />
        <MetricCard
          label="Staff members"
          value={staff?.length ?? 0}
          icon={Users}
          loading={staff === undefined}
        />
      </div>

      {/* Two-column lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Recent applications */}
        <div className="rounded-xl bg-card border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent applications</h2>
            <Link
              to="/admin/applications"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {applications === undefined ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No applications yet.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentApps.map((app) => (
                <li key={app._id} className="py-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {app.firstName} {app.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {app.email}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="capitalize text-[11px] uppercase tracking-wide bg-white/5 border-white/10 text-muted-foreground"
                  >
                    {app.formType}
                  </Badge>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[app.status] ?? ""}`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {formatRelative(app.submittedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent tickets */}
        <div className="rounded-xl bg-card border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Open tickets</h2>
            <Link
              to="/admin/tickets"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {tickets === undefined ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentOpenTickets.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No open tickets.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentOpenTickets.map((t) => (
                <li key={t._id} className="py-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {t.subject}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {t.email}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="capitalize text-[11px] bg-white/5 border-white/10 text-muted-foreground"
                  >
                    {t.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {formatRelative(t.submittedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Audit log */}
      <div className="rounded-xl bg-card border border-white/10 p-6">
        <h2 className="text-base font-semibold mb-4">Recent admin activity</h2>
        {audit === undefined ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : recentAudit.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentAudit.map((entry) => (
              <li
                key={entry._id}
                className="py-3 flex items-center gap-3 text-sm"
              >
                <span className="font-mono text-xs text-muted-foreground truncate w-48">
                  {entry.actorEmail}
                </span>
                <span className="font-medium">{entry.action}</span>
                {entry.targetTable ? (
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {entry.targetTable}
                    {entry.targetId ? `:${String(entry.targetId).slice(0, 8)}` : ""}
                  </span>
                ) : null}
                <span className="ml-auto text-xs text-muted-foreground font-mono whitespace-nowrap">
                  {formatRelative(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
