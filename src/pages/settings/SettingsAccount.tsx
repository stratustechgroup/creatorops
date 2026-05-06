import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  X,
  Database,
  ShieldCheck,
  Mail,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: Date | string | number | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}

interface MetadataRowProps {
  label: string;
  children: React.ReactNode;
}

function MetadataRow({ label, children }: MetadataRowProps) {
  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-white/5 last:border-b-0 md:border-b-0 md:py-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

interface IncludedRowProps {
  icon: "check" | "x";
  children: React.ReactNode;
}

function IncludedRow({ icon, children }: IncludedRowProps) {
  if (icon === "check") {
    return (
      <li className="flex items-start gap-2.5 text-sm text-foreground">
        <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <span>{children}</span>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
      <X className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function SettingsAccount() {
  const { user, loading } = useAuth();

  const accountId = user?.id ?? null;
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;
  const memberSince = formatDate(user?.createdAt ?? null);
  const lastSignIn = formatDate(user?.lastSignInAt ?? null);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="max-w-4xl">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Account
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your Creator Ops account details, data, and lifecycle controls.
          </p>
        </div>

        {/* 2. Account overview */}
        <section className="mb-8">
          <div className="rounded-xl bg-card border border-white/10 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Account overview
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Identity and lifecycle metadata associated with this login.
                </p>
              </div>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium"
                >
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                  Active
                </Badge>
              )}
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-6 md:gap-x-8">
              <MetadataRow label="Account ID">
                {loading ? (
                  <Skeleton className="h-4 w-48" />
                ) : accountId ? (
                  <span className="font-mono text-xs text-foreground break-all">
                    {accountId}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">—</span>
                )}
              </MetadataRow>

              <MetadataRow label="Email">
                {loading ? (
                  <Skeleton className="h-4 w-56" />
                ) : email ? (
                  <span className="font-mono text-sm text-foreground break-all">
                    {email}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">—</span>
                )}
              </MetadataRow>

              <MetadataRow label="Member since">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <span className="font-mono text-sm text-foreground">
                    {memberSince}
                  </span>
                )}
              </MetadataRow>

              <MetadataRow label="Last sign-in">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <span className="font-mono text-sm text-foreground">
                    {lastSignIn}
                  </span>
                )}
              </MetadataRow>

              <MetadataRow label="Status">
                {loading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="text-sm text-foreground">
                    Authenticated session
                  </span>
                )}
              </MetadataRow>

              <MetadataRow label="Plan">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-muted-foreground">—</span>
                  <span className="text-xs text-muted-foreground">
                    (billing not yet configured)
                  </span>
                </div>
              </MetadataRow>
            </dl>
          </div>
        </section>

        {/* 3. Email preferences */}
        <section className="mb-8">
          <div className="rounded-xl bg-card border border-white/10 p-6">
            <div className="flex items-start gap-3 mb-1">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Email preferences
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage which transactional and product emails you receive.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-muted-foreground">
              Detailed notification preferences live under{" "}
              <Link
                to="/settings/notifications"
                className="text-primary hover:underline"
              >
                Settings → Notifications
              </Link>
              .
            </div>

            <div className="mt-4 divide-y divide-white/5 rounded-lg border border-white/5">
              <div className="flex items-start justify-between gap-6 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-sm font-medium text-foreground">
                      Account security alerts
                    </p>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wide font-mono"
                    >
                      Locked on
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Always on for safety. Cannot be disabled.
                  </p>
                </div>
                <Switch checked disabled aria-label="Account security alerts" />
              </div>

              <div className="flex items-start justify-between gap-6 px-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Product updates and announcements
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Manage from Settings → Notifications when available.
                  </p>
                </div>
                <Switch
                  disabled
                  aria-label="Product updates and announcements"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Data export */}
        <section className="mb-8">
          <div className="rounded-xl bg-card border border-white/10 p-6">
            <div className="flex items-start gap-3 mb-1">
              <Database className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Export your data
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Download a complete archive of your account, world
                  configurations, backup metadata, and support history.
                  Sensitive data is excluded; world files are linked to your
                  dashboard, not duplicated.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Included
                  </span>
                  <span className="h-px flex-1 bg-white/5" />
                </div>
                <ul className="space-y-2.5">
                  <IncludedRow icon="check">
                    Account profile and email history
                  </IncludedRow>
                  <IncludedRow icon="check">
                    Active subscription and billing records
                  </IncludedRow>
                  <IncludedRow icon="check">Support ticket history</IncludedRow>
                  <IncludedRow icon="check">
                    Application submission history
                  </IncludedRow>
                  <IncludedRow icon="check">
                    Notification preferences
                  </IncludedRow>
                </ul>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Excluded
                  </span>
                  <span className="h-px flex-1 bg-white/5" />
                </div>
                <ul className="space-y-2.5">
                  <IncludedRow icon="x">
                    Payment method details (held by our payment processor)
                  </IncludedRow>
                  <IncludedRow icon="x">
                    World save files (download from your dashboard)
                  </IncludedRow>
                  <IncludedRow icon="x">
                    Server logs older than 30 days
                  </IncludedRow>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Last export
                </span>
                <span className="font-mono text-sm text-foreground">Never</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex">
                    <Button disabled variant="outline">
                      Request export
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Available once you have an active subscription.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* 5. Account closure (danger zone) */}
        <section className="mb-8">
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6">
            <div className="flex items-start gap-3 mb-1">
              <AlertTriangle className="h-4 w-4 mt-1 text-red-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Close account
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-red-500/30 bg-red-500/10 text-red-400 text-[10px] uppercase tracking-wide font-mono"
                  >
                    Danger zone
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Closing your account is permanent. Review what happens before
                  you proceed.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                What happens when you close your account
              </span>
              <ul className="mt-3 space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <X className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
                  <span>
                    Your subscription is canceled at the end of the current
                    billing period.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <X className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
                  <span>
                    Your worlds remain online for 30 days, then are permanently
                    deleted.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <X className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
                  <span>
                    All backups are deleted after the 30-day window. Download
                    anything you want to keep first.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <X className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
                  <span>
                    Your account ID and any audit records are anonymized but
                    retained per our privacy policy.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-red-500/15">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex w-fit">
                    <Button variant="destructive" disabled>
                      Close account
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Reach out at hi@creatorops.io to close your account.
                  Self-serve closure ships in a future release.
                </TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground">
                Need help instead?{" "}
                <a
                  href="mailto:hi@creatorops.io"
                  className="text-primary hover:underline"
                >
                  hi@creatorops.io
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
