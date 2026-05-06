import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Gauge,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  RefreshCw,
  Server,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { useStaffRole } from "@/hooks/useStaffRole";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Support", to: "/support", icon: LifeBuoy },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/admin", icon: Gauge },
  { label: "Applications", to: "/admin/applications", icon: Inbox },
  { label: "Tickets", to: "/admin/tickets", icon: Ticket },
  { label: "Spots", to: "/admin/spots", icon: Sparkles },
  { label: "Staff", to: "/admin/staff", icon: Users },
  { label: "Infrastructure", to: "/admin/infrastructure", icon: Server },
];

const BREADCRUMB_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/settings": "Settings",
  "/settings/profile": "Settings · Profile",
  "/settings/security": "Settings · Security",
  "/settings/notifications": "Settings · Notifications",
  "/settings/team": "Settings · Team",
  "/settings/account": "Settings · Account",
  "/support": "Support",
  "/admin": "Admin · Overview",
  "/admin/applications": "Admin · Applications",
  "/admin/tickets": "Admin · Tickets",
  "/admin/spots": "Admin · Spots",
  "/admin/staff": "Admin · Staff",
  "/admin/infrastructure": "Admin · Infrastructure",
};

function formatRelativeTime(from: Date, to: Date): string {
  const diffMs = to.getTime() - from.getTime();
  const seconds = Math.max(0, Math.floor(diffMs / 1000));

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

function SidebarContent({
  pathname,
  onNavigate,
  onClose,
  showCloseButton = false,
}: SidebarContentProps) {
  const { isStaff } = useStaffRole();
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 group"
        >
          <Logo className="w-7 h-7 transition-transform group-hover:scale-105" />
          <span className="font-semibold text-foreground tracking-tight">
            Creator Ops
          </span>
        </Link>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.to ||
              (item.to !== "/" && pathname.startsWith(`${item.to}/`));

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-colors border-l-2",
                    isActive
                      ? "text-primary bg-primary/10 border-primary font-medium"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin section — pinned just above the user menu when staff */}
      {isStaff && (
        <div className="px-3 pt-3 pb-2 border-t border-white/5">
          <div className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Admin
          </div>
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.to ||
                (item.to !== "/admin" &&
                  pathname.startsWith(`${item.to}/`)) ||
                (item.to === "/admin" && pathname === "/admin");

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-colors border-l-2",
                      isActive
                        ? "text-primary bg-primary/10 border-primary font-medium"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* User menu pinned bottom */}
      <div className="border-t border-white/5 p-2">
        <UserMenu />
      </div>
    </div>
  );
}


export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [now, setNow] = useState<Date>(() => new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tick clock for relative-time pill
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 5000);
    return () => window.clearInterval(id);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["servers"] }),
        queryClient.invalidateQueries({ queryKey: ["server-resources"] }),
        queryClient.invalidateQueries({ queryKey: ["server-backups"] }),
        queryClient.invalidateQueries({ queryKey: ["pterodactyl-servers"] }),
      ]);
      setLastUpdated(new Date());
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const breadcrumbLabel =
    BREADCRUMB_LABELS[location.pathname] ??
    (location.pathname.split("/").filter(Boolean)[0]
      ? location.pathname
          .split("/")
          .filter(Boolean)[0]
          .replace(/^./, (c) => c.toUpperCase())
      : "Dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-60 lg:flex-col lg:bg-card/30 lg:border-r lg:border-white/5">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[17rem] max-w-[85vw] bg-card border-r border-white/5 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <SidebarContent
                pathname={location.pathname}
                onNavigate={() => setMobileOpen(false)}
                onClose={() => setMobileOpen(false)}
                showCloseButton
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-60">
        {/* Sticky header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-white/5">
          <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground p-2 -ml-2 rounded-md hover:bg-white/5 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav
                className="flex items-center gap-2 min-w-0"
                aria-label="Breadcrumb"
              >
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  /
                </span>
                <span className="text-sm font-medium text-foreground truncate">
                  {breadcrumbLabel}
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4 sm:mr-2",
                    isRefreshing && "animate-spin",
                  )}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <span
                className="hidden sm:inline text-xs text-muted-foreground font-mono whitespace-nowrap"
                title={lastUpdated.toLocaleString()}
              >
                Updated {formatRelativeTime(lastUpdated, now)}
              </span>

              <NotificationBell />

              <div className="lg:hidden">
                <UserMenu compact />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
