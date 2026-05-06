import { UserProfile, useUser } from "@clerk/clerk-react";
import {
  ShieldCheck,
  KeyRound,
  Activity,
  Lock,
  Smartphone,
  Link2,
  MailCheck,
} from "lucide-react";

type StatusTone = "good" | "warn" | "neutral";

interface MetricProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  tone: StatusTone;
  helper: string;
}

function toneClasses(tone: StatusTone) {
  switch (tone) {
    case "good":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "warn":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-white/5 text-muted-foreground border-white/10";
  }
}

function MetricCard({ label, icon: Icon, status, tone, helper }: MetricProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span className="text-[10px] uppercase tracking-[0.08em] font-medium">
            {label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${toneClasses(
            tone,
          )}`}
        >
          {status}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{helper}</p>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-2 animate-pulse">
      <div className="h-3 w-20 bg-white/5 rounded" />
      <div className="h-5 w-16 bg-white/10 rounded-md" />
      <div className="h-3 w-full bg-white/5 rounded" />
    </div>
  );
}

interface TipProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

function Tip({ icon: Icon, title, body }: TipProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex gap-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function SettingsSecurity() {
  const { user, isLoaded } = useUser();

  const passwordSet = user?.passwordEnabled ?? false;
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;
  const externalAccountsCount = user?.externalAccounts?.length ?? 0;
  const emailVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";

  return (
    <div className="max-w-5xl">
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Security
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          Protect your account with strong authentication and review recent
          activity.
        </p>
      </div>

      {/* Zone 1 — Status summary */}
      <div className="mb-8 rounded-xl bg-card border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Account security overview
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              A snapshot of your current account protections.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {!isLoaded ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                label="Password"
                icon={Lock}
                status={passwordSet ? "Set" : "Not set"}
                tone={passwordSet ? "good" : "warn"}
                helper={
                  passwordSet
                    ? "A password is configured for this account."
                    : "Add a password to enable email sign-in."
                }
              />
              <MetricCard
                label="Two-factor auth"
                icon={Smartphone}
                status={twoFactorEnabled ? "Enabled" : "Not enabled"}
                tone={twoFactorEnabled ? "good" : "warn"}
                helper={
                  twoFactorEnabled
                    ? "Second-factor verification is active."
                    : "Enable 2FA to add a second verification step."
                }
              />
              <MetricCard
                label="Connected accounts"
                icon={Link2}
                status={
                  externalAccountsCount === 1
                    ? "1 linked"
                    : `${externalAccountsCount} linked`
                }
                tone={externalAccountsCount > 0 ? "good" : "neutral"}
                helper={
                  externalAccountsCount > 0
                    ? "Sign in with linked providers."
                    : "Link Google or GitHub for faster sign-in."
                }
              />
              <MetricCard
                label="Email verified"
                icon={MailCheck}
                status={emailVerified ? "Verified" : "Pending"}
                tone={emailVerified ? "good" : "warn"}
                helper={
                  emailVerified
                    ? "Your primary email is verified."
                    : "Confirm your email to secure recovery."
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Zone 2 — Embedded Clerk UserProfile */}
      <div className="mb-8 rounded-xl bg-card border border-white/10 overflow-hidden p-0">
        <UserProfile
          routing="virtual"
          appearance={{
            variables: {
              colorPrimary: "rgb(45 184 123)",
              colorText: "rgb(243 244 246)",
              colorTextSecondary: "rgb(156 163 175)",
              colorBackground: "transparent",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "rgb(243 244 246)",
              colorDanger: "rgb(248 113 113)",
              fontFamily:
                "Inter, system-ui, -apple-system, sans-serif",
              borderRadius: "0.5rem",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-transparent border-0 shadow-none p-0",
              pageScrollBox: "p-6 lg:p-8",
              navbar:
                "bg-card/30 border-r border-white/5",
              navbarButton:
                "text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md",
              navbarButton__active:
                "text-primary bg-primary/10 hover:bg-primary/15",
              navbarButtonIcon: "text-current",
              headerTitle:
                "text-foreground text-lg font-semibold",
              headerSubtitle: "text-muted-foreground text-sm",
              profileSection:
                "border-b border-white/5 last:border-0 py-6",
              profileSectionTitle: "border-b-0 mb-3",
              profileSectionTitleText:
                "text-foreground text-base font-semibold",
              profileSectionContent: "text-foreground",
              profileSectionPrimaryButton:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              profileSectionPrimaryButton__danger:
                "bg-red-500/10 text-red-400 hover:bg-red-500/15 border border-red-500/20",
              formFieldLabel:
                "text-foreground text-sm font-medium",
              formFieldInput:
                "bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/40",
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90 normal-case",
              formButtonReset:
                "text-muted-foreground hover:text-foreground",
              formFieldErrorText: "text-red-400",
              dividerRow: "border-white/5",
              dividerText: "text-muted-foreground bg-card",
              accordionTriggerButton:
                "text-foreground hover:bg-white/5",
              accordionContent: "text-muted-foreground",
              badge:
                "bg-white/5 text-muted-foreground border border-white/10",
              badge__primary:
                "bg-primary/10 text-primary border border-primary/20",
              badge__success:
                "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
              badge__danger:
                "bg-red-500/10 text-red-400 border border-red-500/20",
              socialButtonsBlockButton:
                "bg-white/5 border border-white/10 text-foreground hover:bg-white/10",
              socialButtonsBlockButtonText: "text-foreground",
              avatarBox: "border border-white/10",
              avatarImageActionsUpload:
                "bg-white/5 border border-white/10 text-foreground hover:bg-white/10",
              modalContent:
                "bg-card border border-white/10",
              modalCloseButton:
                "text-muted-foreground hover:text-foreground",
            },
          }}
        />
      </div>

      {/* Zone 3 — Recommended security tips */}
      <div className="rounded-xl bg-card border border-white/10 p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-foreground">
            Recommended best practices
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hardening tips trusted by teams running production infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Tip
            icon={KeyRound}
            title="Use a unique password"
            body="Generate one with a password manager. Avoid reusing across services."
          />
          <Tip
            icon={ShieldCheck}
            title="Enable two-factor authentication"
            body="Adds a second verification step. Highly recommended."
          />
          <Tip
            icon={Activity}
            title="Review active sessions monthly"
            body="Sign out devices you don't recognize."
          />
        </div>
      </div>
    </div>
  );
}
