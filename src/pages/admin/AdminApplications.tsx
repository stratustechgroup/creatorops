import { useMemo, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { Inbox, Search, ExternalLink, Check, X } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module is added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const FORM_TYPE_LABEL: Record<FormType, string> = {
  founding: "Founding Creator",
  standard: "Standard",
  studio: "Studio",
  events: "Events & Collabs",
};

const TABS: { key: "all" | FormType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "founding", label: "Founding" },
  { key: "standard", label: "Standard" },
  { key: "studio", label: "Studio" },
  { key: "events", label: "Events" },
];

// Field group definitions per form type
type FieldDef = {
  key: string;
  label: string;
  type?: "url" | "long-text" | "boolean";
};
type FieldGroup = {
  title: string;
  layout: "grid" | "full";
  fields: FieldDef[];
};

const FORM_SCHEMAS: Record<FormType, FieldGroup[]> = {
  standard: [
    {
      title: "Creator Profile",
      layout: "grid",
      fields: [
        { key: "creatorType", label: "Creator type" },
        { key: "subscriberCount", label: "Subscribers" },
        { key: "channelUrl", label: "Channel URL", type: "url" },
        { key: "budgetRange", label: "Budget range" },
        { key: "timeline", label: "Timeline" },
        { key: "onboardingPreference", label: "Onboarding preference" },
      ],
    },
    {
      title: "Contact preferences",
      layout: "grid",
      fields: [
        { key: "discordUsername", label: "Discord" },
        { key: "preferredContact", label: "Preferred contact" },
      ],
    },
    {
      title: "Current setup",
      layout: "full",
      fields: [{ key: "currentSetup", label: "Current setup", type: "long-text" }],
    },
    {
      title: "Use case & content goals",
      layout: "full",
      fields: [{ key: "useCase", label: "Use case", type: "long-text" }],
    },
    {
      title: "Other",
      layout: "grid",
      fields: [{ key: "referral", label: "How they found us" }],
    },
  ],
  founding: [
    {
      title: "Creator Profile",
      layout: "grid",
      fields: [
        { key: "audienceSize", label: "Audience size" },
        { key: "uploadFrequency", label: "Upload frequency" },
        { key: "channelUrl", label: "Channel URL", type: "url" },
        { key: "timezone", label: "Timezone" },
        { key: "collaborators", label: "Collaborators" },
        { key: "discordUsername", label: "Discord" },
      ],
    },
    {
      title: "Content description",
      layout: "full",
      fields: [{ key: "contentDescription", label: "Content description", type: "long-text" }],
    },
    {
      title: "World & server needs",
      layout: "full",
      fields: [
        { key: "worldDescription", label: "World description", type: "long-text" },
        { key: "currentPainPoints", label: "Current pain points", type: "long-text" },
      ],
    },
    {
      title: "Program fit",
      layout: "grid",
      fields: [
        { key: "feedbackStyle", label: "Feedback style" },
        { key: "availabilityCall", label: "Call availability" },
      ],
    },
    {
      title: "Why a founding creator",
      layout: "full",
      fields: [{ key: "whyFounder", label: "Why founding creator", type: "long-text" }],
    },
    {
      title: "Agreements",
      layout: "grid",
      fields: [
        { key: "agreeCommitment", label: "3-month commitment", type: "boolean" },
        { key: "agreeFeedback", label: "Provide feedback", type: "boolean" },
        { key: "agreeTestimonial", label: "Testimonial OK", type: "boolean" },
      ],
    },
    {
      title: "Other",
      layout: "grid",
      fields: [
        { key: "referral", label: "How they found us" },
        { key: "additionalNotes", label: "Additional notes" },
      ],
    },
  ],
  studio: [
    {
      title: "Operation details",
      layout: "grid",
      fields: [
        { key: "operationType", label: "Operation type" },
        { key: "peakPlayers", label: "Peak players" },
        { key: "currentPainPoint", label: "Biggest challenge" },
        { key: "timeline", label: "Timeline" },
      ],
    },
    {
      title: "Additional context",
      layout: "full",
      fields: [{ key: "tellUsMore", label: "Tell us more", type: "long-text" }],
    },
  ],
  events: [
    {
      title: "Event details",
      layout: "grid",
      fields: [
        { key: "eventType", label: "Event type" },
        { key: "concurrentPlayers", label: "Concurrent players" },
        { key: "duration", label: "Duration" },
        { key: "worldSetup", label: "World setup" },
        { key: "targetDate", label: "Target date" },
      ],
    },
  ],
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderValue(value: unknown, type?: FieldDef["type"]): React.ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground/50 italic text-xs">—</span>;
  }

  if (type === "boolean") {
    const checked = value === true || value === "true";
    return checked ? (
      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
        <Check className="w-3.5 h-3.5" /> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
        <X className="w-3.5 h-3.5" /> No
      </span>
    );
  }

  if (type === "url" && typeof value === "string") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline break-all text-sm"
      >
        {value}
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    );
  }

  if (type === "long-text" && typeof value === "string") {
    return (
      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
        {value}
      </p>
    );
  }

  if (Array.isArray(value)) return <span className="text-sm">{value.join(", ")}</span>;
  return <span className="text-sm">{String(value)}</span>;
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
        const haystack = `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase();
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

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          {selected && (
            <>
              {/* Header */}
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                      {selected.firstName} {selected.lastName}
                    </DialogTitle>
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-sm text-primary hover:underline font-mono mt-0.5 block"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground bg-white/5 capitalize">
                      {FORM_TYPE_LABEL[selected.formType]}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[selected.status]}`}
                    >
                      {selected.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Submitted {formatDate(selected.submittedAt)}
                </p>
              </DialogHeader>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                {(FORM_SCHEMAS[selected.formType] ?? []).map((group) => {
                  const populated = group.fields.filter(
                    (f) =>
                      selected.fullData[f.key] !== undefined &&
                      selected.fullData[f.key] !== null &&
                      selected.fullData[f.key] !== "",
                  );
                  if (populated.length === 0) return null;

                  return (
                    <section key={group.title}>
                      <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-3">
                        {group.title}
                      </h3>

                      {group.layout === "grid" ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                          {populated.map((f) => (
                            <div key={f.key} className="min-w-0">
                              <dt className="text-xs text-muted-foreground mb-0.5">
                                {f.label}
                              </dt>
                              <dd>{renderValue(selected.fullData[f.key], f.type)}</dd>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {populated.map((f) => (
                            <div key={f.key} className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                              <dt className="text-xs text-muted-foreground mb-1.5">
                                {f.label}
                              </dt>
                              <dd>{renderValue(selected.fullData[f.key], f.type)}</dd>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}

                {/* Catch-all for any unrecognized fields not in the schema */}
                {(() => {
                  const knownKeys = new Set(
                    (FORM_SCHEMAS[selected.formType] ?? []).flatMap((g) =>
                      g.fields.map((f) => f.key),
                    ),
                  );
                  const extra = Object.entries(selected.fullData ?? {}).filter(
                    ([k]) =>
                      !knownKeys.has(k) &&
                      !["firstName", "lastName", "email"].includes(k) &&
                      selected.fullData[k] !== undefined &&
                      selected.fullData[k] !== null &&
                      selected.fullData[k] !== "",
                  );
                  if (extra.length === 0) return null;
                  return (
                    <section>
                      <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-3">
                        Additional fields
                      </h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {extra.map(([k, v]) => (
                          <div key={k} className="min-w-0">
                            <dt className="text-xs text-muted-foreground mb-0.5 capitalize">
                              {k.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                            </dt>
                            <dd>
                              <span className="text-sm">{String(v)}</span>
                            </dd>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })()}
              </div>

              {/* Footer actions */}
              <div className="px-6 py-4 border-t border-white/[0.06] shrink-0 flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetStatus("needs_info")}
                  disabled={busy}
                >
                  Needs more info
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReject}
                  disabled={busy || selected.status === "rejected"}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={busy || selected.status === "approved"}
                >
                  Approve
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
                  {row.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
