import { cn } from "@/lib/utils";

export interface StatusBannerProps {
  variant: "operational" | "warning" | "critical";
  title: string;
  detail?: string;
}

const variantStyles: Record<
  StatusBannerProps["variant"],
  { container: string; dot: string }
> = {
  operational: {
    container:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  warning: {
    container: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
  },
  critical: {
    container: "text-red-400 bg-red-500/10 border-red-500/20",
    dot: "bg-red-400",
  },
};

export function StatusBanner({ variant, title, detail }: StatusBannerProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "w-full rounded-xl border p-5 flex items-start lg:items-center gap-4",
        styles.container,
      )}
    >
      <div className="flex items-start lg:items-center gap-3 flex-1 min-w-0">
        <span className="relative flex w-2 h-2 mt-2 lg:mt-0 shrink-0">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
              styles.dot,
            )}
          />
          <span
            className={cn(
              "relative inline-flex w-2 h-2 rounded-full animate-pulse",
              styles.dot,
            )}
          />
        </span>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2 min-w-0">
          <span className="text-base font-semibold text-foreground truncate">
            {title}
          </span>
          {detail ? (
            <>
              <span
                aria-hidden="true"
                className="hidden lg:inline text-muted-foreground"
              >
                ·
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {detail}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StatusBanner;
