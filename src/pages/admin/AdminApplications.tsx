import { useMemo, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { Inbox, Search } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module is added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type FormType = "founding" | "standard" | "studio" | "events";
type AppStatus = "pending" | "approved" | "rejected" | "needs_info";

type AdminApplication = {
  _id: string;
  formType: FormType;
  firstName: string;
  lastName: string;
  email: string;
  submittedAt: number;
  status: AppStatus;
  fullData: Record<string, unknown>;
};

const STATUS_PILL: Record<AppStatus, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-300 border-red-500/20",
  needs_info: "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

const TABS: { key: "all" | FormType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "founding", label: "Founding" },
  { key: "standard", label: "Standard" },
  { key: "studio", label: "Studio" },
  { key: "events", label: "Events" },
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  return JSON.stringify(value);
}

export default function AdminApplications() {
  const applications = useQuery(api.admin.listApplications) as
    | AdminApplication[]
    | undefined;
  const updateStatus = useMutation(api.admin.updateApplicationStatus);
  const approveApp = useAction(api.onboarding.approveApplication);
  const rejectApp = useAction(api.onboarding.rejectApplication);

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | FormType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AppStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => applications?.find((a) => a._id === selectedId) ?? null,
    [applications, selectedId],
  );

  const filtered = useMemo(() => {
    if (!applications) return [];
    return applications
      .filter((a) => activeTab === "all" || a.formType === activeTab)
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter((a) => {
        if (!search) return true;
        const haystack =
          `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
      .sort((a, b) => b.submittedAt - a.submittedAt);
  }, [applications, activeTab, statusFilter, search]);

  const handleApprove = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await approveApp({ formType: selected.formType, id: selected._id as never });
      toast({ title: "Application approved" });
      setSelectedId(null);
    } catch (err) {
      toast({
        title: "Failed to approve",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await rejectApp({ formType: selected.formType, id: selected._id as never });
      toast({ title: "Application rejected" });
      setSelectedId(null);
    } catch (err) {
      toast({
        title: "Failed to reject",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSetStatus = async (status: AppStatus) => {
    if (!selected) return;
    setBusy(true);
    try {
      await updateStatus({
        formType: selected.formType,
        id: selected._id as never,
        status,
      });
      toast({ title: `Status set to ${status}` });
    } catch (err) {
      toast({
        title: "Failed to update status",
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
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and respond to incoming creator applications.
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="needs_info">Needs info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
      >
        <TabsList className="mb-4">
          {TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-0">
            <ApplicationsTable
              loading={applications === undefined}
              rows={filtered}
              onSelect={(id) => setSelectedId(id)}
              tabKey={t.key}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail drawer */}
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto bg-background border-l border-white/10"
        >
          {selected ? (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <SheetTitle className="text-lg">
                      {selected.firstName} {selected.lastName}
                    </SheetTitle>
                    <SheetDescription className="font-mono text-xs">
                      {selected.email}
                    </SheetDescription>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[selected.status]}`}
                  >
                    {selected.status}
                  </span>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <DetailSection title="Submission">
                  <DetailRow
                    label="Form type"
                    value={
                      <span className="capitalize">{selected.formType}</span>
                    }
                  />
                  <DetailRow
                    label="Submitted"
                    value={
                      <span className="font-mono">
                        {formatDate(selected.submittedAt)}
                      </span>
                    }
                  />
                  <DetailRow
                    label="ID"
                    value={
                      <span className="font-mono text-xs">{selected._id}</span>
                    }
                  />
                </DetailSection>

                <DetailSection title="Application body">
                  {Object.entries(selected.fullData ?? {}).map(([k, v]) => (
                    <DetailRow
                      key={k}
                      label={formatFieldLabel(k)}
                      value={
                        <span className="text-sm whitespace-pre-wrap break-words">
                          {renderValue(v)}
                        </span>
                      }
                    />
                  ))}
                </DetailSection>
              </div>

              <SheetFooter className="mt-8 flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSetStatus("needs_info")}
                  disabled={busy}
                >
                  Needs more info
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={busy || selected.status === "rejected"}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={busy || selected.status === "approved"}
                >
                  Approve
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

function ApplicationsTable({
  loading,
  rows,
  onSelect,
  tabKey,
}: {
  loading: boolean;
  rows: AdminApplication[];
  onSelect: (id: string) => void;
  tabKey: "all" | FormType;
}) {
  if (loading) {
    return (
      <div className="rounded-xl bg-card border border-white/10 p-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-white/10 p-12 text-center">
        <Inbox className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          {tabKey === "all"
            ? "No applications match your filters."
            : `No ${tabKey} applications yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted-foreground">
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
              Email
            </th>
            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
              Form
            </th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
              Submitted
            </th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row._id}
              onClick={() => onSelect(row._id)}
              className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-medium">
                {row.firstName} {row.lastName}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                {row.email}
              </td>
              <td className="px-4 py-3 capitalize text-muted-foreground hidden lg:table-cell">
                {row.formType}
              </td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">
                {new Date(row.submittedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[row.status]}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
        {title}
      </h3>
      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 items-start text-sm">
      <dt className="text-muted-foreground col-span-1">{label}</dt>
      <dd className="col-span-2">{value}</dd>
    </div>
  );
}
