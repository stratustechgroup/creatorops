import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { NavLink, Outlet } from "react-router-dom";
import { User, ShieldCheck, Bell, Users, CircleUserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsNavItem {
  to: string;
  label: string;
  icon: typeof User;
}

const SETTINGS_NAV: SettingsNavItem[] = [
  { to: "/settings/profile", label: "Profile", icon: User },
  { to: "/settings/security", label: "Security", icon: ShieldCheck },
  { to: "/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/settings/team", label: "Team", icon: Users },
  { to: "/settings/account", label: "Account", icon: CircleUserRound },
];

export default function SettingsLayout() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sub-nav: horizontal on mobile, vertical column on lg+ */}
        <nav
          aria-label="Settings sections"
          className="lg:w-56 lg:shrink-0"
        >
          <ul
            className={cn(
              "flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0",
            )}
          >
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} className="shrink-0 lg:shrink">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors whitespace-nowrap",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                      )
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}
