import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface NotificationToggle {
  id: string;
  label: string;
  description: string;
}

const TOGGLES: NotificationToggle[] = [
  {
    id: "backup-alerts",
    label: "Backup alerts",
    description: "Get notified when a scheduled backup fails or succeeds.",
  },
  {
    id: "incident-reports",
    label: "Incident reports",
    description: "Postmortems and downtime summaries for your worlds.",
  },
  {
    id: "billing-receipts",
    label: "Billing receipts",
    description: "Monthly invoices and payment confirmations.",
  },
  {
    id: "product-updates",
    label: "Product updates",
    description: "New features and platform changes that affect your account.",
  },
  {
    id: "marketing-emails",
    label: "Marketing emails",
    description: "Newsletters, creator stories, and occasional promotions.",
  },
];

export default function SettingsNotifications() {
  return (
    <div className="rounded-xl bg-card border border-white/10 p-6 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
        <Badge variant="secondary" className="text-xs">
          Coming soon
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Email preferences for backup alerts, incident reports, and product updates will live here. For now,
        all critical alerts go to the email on your account.
      </p>

      <ul className="border-t border-white/5">
        {TOGGLES.map((toggle) => (
          <li
            key={toggle.id}
            className="flex items-start justify-between gap-4 py-4 border-b border-white/5 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{toggle.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {toggle.description}
              </p>
            </div>
            <Switch
              disabled
              aria-label={toggle.label}
              className="mt-1 shrink-0"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
