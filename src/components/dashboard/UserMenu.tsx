import { Link } from "react-router-dom";
import { ChevronUp, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  compact?: boolean;
}

interface ClerkLikeUser {
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
  emailAddresses?: Array<{ emailAddress?: string | null }> | null;
  email?: string | null;
}

function resolveEmail(user: ClerkLikeUser | null): string | null {
  if (!user) return null;
  const primary = user.primaryEmailAddress?.emailAddress;
  if (primary) return primary;
  const first = user.emailAddresses?.[0]?.emailAddress;
  if (first) return first;
  return user.email ?? null;
}

function resolveDisplayName(user: ClerkLikeUser | null, email: string | null): string {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user?.firstName) return user.firstName;
  if (email) return email.split("@")[0] ?? "Account";
  return "Account";
}

function resolveInitials(user: ClerkLikeUser | null, email: string | null): string {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  }
  if (user?.firstName && user.firstName.length >= 2) {
    return user.firstName.slice(0, 2).toUpperCase();
  }
  if (email && email.length >= 2) {
    return email.slice(0, 2).toUpperCase();
  }
  return "?";
}

export function UserMenu({ compact = false }: UserMenuProps) {
  const { user, signOut } = useAuth();

  const userLike = user as ClerkLikeUser | null;
  const email = resolveEmail(userLike);
  const displayName = resolveDisplayName(userLike, email);
  const initials = resolveInitials(userLike, email);

  const handleSignOut = async () => {
    // AuthContext.signOut already does a hard redirect to the marketing host,
    // so no in-app navigate is needed (and would only cause a flash).
    await signOut();
  };

  const avatar = (
    <div
      className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-semibold shrink-0"
      aria-hidden="true"
    >
      {initials}
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button
            type="button"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={`Account menu for ${displayName}`}
          >
            {avatar}
          </button>
        ) : (
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={`Account menu for ${displayName}`}
          >
            {avatar}
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground truncate">
                {displayName}
              </span>
            </span>
            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={compact ? "end" : "start"}
        side="top"
        sideOffset={8}
        className="w-60"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground truncate">
              {displayName}
            </span>
            {email && (
              <span className="text-xs text-muted-foreground truncate font-mono">
                {email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/settings"
            className="cursor-pointer text-muted-foreground focus:text-foreground flex items-center"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-muted-foreground focus:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
