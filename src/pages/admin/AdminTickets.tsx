import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Search, Ticket as TicketIcon } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - admin module is added by parallel agent; contract documented in CLAUDE.md
import { api } from "../../../convex/_generated/api";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "low" | "normal" | "high";

type AdminTicket = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  submittedAt: number;
};

const STATUS_PILL: Record<TicketStatus, string> = {
  open: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  resolved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-white/10",
};

const PRIORITY_PILL: Record<TicketPriority, string> = {
  low: "bg-muted text-muted-foreground border-white/10",
  normal: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  high: "bg-red-500/10 text-red-300 border-red-500/20",
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

export default function AdminTickets() {
  const tickets = useQuery(api.admin.listSupportTickets) as
    | AdminTicket[]
    | undefined;
  const updateTicketStatus = useMutation(api.admin.updateTicketStatus);
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => tickets?.find((t) => t._id === selectedId) ?? null,
    [tickets, selectedId],
  );

  const filtered = useMemo(() => {
    if (!tickets) return [];
    return tickets
      .filter((t) => statusFilter === "all" || t.status === statusFilter)
      .filter((t) => {
        if (!search) return true;
        const haystack = `${t.email} ${t.subject} ${t.firstName ?? ""} ${t.lastName ?? ""}`
          .toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
      .sort((a, b) => b.submittedAt - a.submittedAt);
  }, [tickets, statusFilter, search]);

  const handleSetStatus = async (status: TicketStatus) => {
    if (!selected) return;
    setBusy(true);
    try {
      await updateTicketStatus({ id: selected._id as never, status });
      toast({ title: `Ticket marked ${status.replace("_", " ")}` });
    } catch (err) {
      toast({
        title: "Failed to update",
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
        <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Respond to support requests from clients.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or email…"
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tickets === undefined ? (
        <div className="rounded-xl bg-card border border-white/10 p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-card border border-white/10 p-12 text-center">
          <TicketIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No tickets match your filters.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium">Subject</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium">Priority</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row._id}
                  onClick={() => setSelectedId(row._id)}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                    {row.email}
                  </td>
                  <td className="px-4 py-3 font-medium truncate max-w-xs">
                    {row.subject}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize hidden lg:table-cell">
                    {row.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${PRIORITY_PILL[row.priority]}`}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[row.status]}`}
                    >
                      {row.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">
                    {new Date(row.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                  <div className="min-w-0">
                    <SheetTitle className="text-lg break-words">
                      {selected.subject}
                    </SheetTitle>
                    <SheetDescription className="font-mono text-xs">
                      {selected.email}
                    </SheetDescription>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[selected.status]}`}
                  >
                    {selected.status.replace("_", " ")}
                  </span>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <section className="grid grid-cols-2 gap-3 text-sm">
                  <Field
                    label="From"
                    value={
                      [selected.firstName, selected.lastName]
                        .filter(Boolean)
                        .join(" ") || "—"
                    }
                  />
                  <Field
                    label="Submitted"
                    value={
                      <span className="font-mono text-xs">
                        {formatDate(selected.submittedAt)}
                      </span>
                    }
                  />
                  <Field label="Category" value={selected.category} />
                  <Field
                    label="Priority"
                    value={
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${PRIORITY_PILL[selected.priority]}`}
                      >
                        {selected.priority}
                      </span>
                    }
                  />
                </section>

                <section>
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm whitespace-pre-wrap break-words bg-card/50 border border-white/10 rounded-lg p-4">
                    {selected.description}
                  </p>
                </section>

                <section>
                  <label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    Update status
                  </label>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => handleSetStatus(v as TicketStatus)}
                  >
                    <SelectTrigger className="w-full" disabled={busy}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </section>
              </div>

              <SheetFooter className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => setSelectedId(null)}
                  disabled={busy}
                >
                  Close
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
