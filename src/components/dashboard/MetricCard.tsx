import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  loading?: boolean;
}

const trendStyles: Record<
  NonNullable<MetricCardProps["trend"]>,
  { color: string; Icon: LucideIcon }
> = {
  up: { color: "text-emerald-400", Icon: TrendingUp },
  down: { color: "text-red-400", Icon: TrendingDown },
  flat: { color: "text-muted-foreground", Icon: Minus },
};

export function MetricCard({
  label,
  value,
  helperText,
  icon: Icon,
  trend,
  trendLabel,
  loading = false,
}: MetricCardProps) {
  const trendCfg = trend ? trendStyles[trend] : null;

  return (
    <div className="rounded-xl bg-card border border-white/10 p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-9 w-24" />
      ) : (
        <div className="text-3xl font-semibold tracking-tight font-mono text-foreground">
          {value}
        </div>
      )}

      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}

      {trendCfg && trendLabel ? (
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            trendCfg.color,
          )}
        >
          <trendCfg.Icon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{trendLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

export default MetricCard;
