import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function getInitials(firstName?: string | null, lastName?: string | null, email?: string | null): string {
  const f = (firstName ?? "").trim();
  const l = (lastName ?? "").trim();
  if (f || l) {
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || "?";
  }
  const e = (email ?? "").trim();
  return e.charAt(0).toUpperCase() || "?";
}

interface FieldRowProps {
  label: string;
  value: string;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 py-3 border-b border-white/5 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-mono truncate">{value || "—"}</span>
    </div>
  );
}

export default function SettingsProfile() {
  const { user } = useAuth();

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const imageUrl = user?.imageUrl;

  const initials = getInitials(firstName, lastName, email);

  return (
    <div className="rounded-xl bg-card border border-white/10 p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your basic account information.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${firstName} ${lastName}`.trim() || "Profile avatar"}
            className="w-16 h-16 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-lg"
            aria-label="Profile initials"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-base font-medium text-foreground truncate">
            {`${firstName} ${lastName}`.trim() || "Your account"}
          </p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <FieldRow label="First name" value={firstName} />
        <FieldRow label="Last name" value={lastName} />
        <FieldRow label="Primary email" value={email} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Edit name, email, or avatar in{" "}
        <Link to="/settings/security" className="text-primary hover:underline">
          Security
        </Link>
        .
      </p>
    </div>
  );
}
