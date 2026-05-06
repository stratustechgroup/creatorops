import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Cpu,
  HardDrive,
  Server,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = "bloom" | "pufferfish";

type Plan = { ram: number; cores: number; storage: number; price: number };

type Tier = {
  name: string;
  monthly: number;
  annual: number;
  bloomRam: number;
  puffRam: number;
  maxPlayers: number;
  worlds: string;
  modpack: string;
  desc: string;
};

type Signals = {
  creatorType: string;
  subscriberCount: string;
  budgetRange: string;
  operationType: string;
  peakPlayers: string;
  modpackTier: string;
  needsStaging: string;
  needsEvents: string;
};

type RecommendResult = {
  tierIdx: number;
  signals: string[];
  warnings: string[];
  confidence: "low" | "medium" | "high";
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BLOOM: Plan[] = [
  { ram: 8,  cores: 2,  storage: 150,  price: 24  },
  { ram: 12, cores: 3,  storage: 225,  price: 36  },
  { ram: 16, cores: 4,  storage: 300,  price: 48  },
  { ram: 20, cores: 5,  storage: 375,  price: 60  },
  { ram: 24, cores: 6,  storage: 450,  price: 72  },
  { ram: 32, cores: 8,  storage: 600,  price: 96  },
  { ram: 40, cores: 10, storage: 750,  price: 120 },
  { ram: 48, cores: 12, storage: 900,  price: 144 },
  { ram: 64, cores: 16, storage: 1200, price: 192 },
];

const PUFFERFISH: Plan[] = [
  { ram: 4,  cores: 1,  storage: 50,  price: 16  },
  { ram: 8,  cores: 2,  storage: 100, price: 32  },
  { ram: 12, cores: 3,  storage: 150, price: 48  },
  { ram: 16, cores: 4,  storage: 200, price: 64  },
  { ram: 24, cores: 6,  storage: 300, price: 96  },
  { ram: 32, cores: 8,  storage: 400, price: 128 },
  { ram: 48, cores: 12, storage: 600, price: 192 },
];

const TIERS: Tier[] = [
  { name: "Creator Solo",   monthly: 99,  annual: 79,  bloomRam: 8,  puffRam: 8,  maxPlayers: 5,   worlds: "1 production",      modpack: "Light only",                desc: "Solo creator, 1 world, vanilla/light mods" },
  { name: "Creator Plus",   monthly: 129, annual: 103, bloomRam: 12, puffRam: 12, maxPlayers: 10,  worlds: "Prod + staging",     modpack: "Light – Medium",            desc: "Prod + staging, managed updates" },
  { name: "Creator Pro",    monthly: 199, annual: 159, bloomRam: 16, puffRam: 16, maxPlayers: 20,  worlds: "Unlimited",          modpack: "Any up to medium-heavy",    desc: "Unlimited worlds, 4-hr SLA, priority support" },
  { name: "Creator Studio", monthly: 399, annual: 319, bloomRam: 32, puffRam: 32, maxPlayers: 100, worlds: "Unlimited + custom", modpack: "All packs incl. ultra-heavy", desc: "Dedicated server, custom SLA, account manager" },
];

const TIER_SHORT = ["Solo", "Plus", "Pro", "Studio"] as const;

// ─── Recommendation engine ────────────────────────────────────────────────────

function getRecommendation(sig: Signals): RecommendResult {
  const signals: string[] = [];
  const warnings: string[] = [];
  let score = 0;

  // modpackTier
  if (sig.modpackTier === "ultra") { score = Math.max(score, 3); signals.push("Ultra-heavy modpack"); }
  else if (sig.modpackTier === "heavy") { score = Math.max(score, 2); signals.push("Heavy modpack"); }
  else if (sig.modpackTier === "medium") { score = Math.max(score, 1); signals.push("Medium modpack"); }

  // peakPlayers
  if (sig.peakPlayers === "100+") {
    score = Math.max(score, 3);
    signals.push("100+ peak players");
    warnings.push("Requires custom infra scoping");
  } else if (sig.peakPlayers === "50-100") {
    score = Math.max(score, 3);
    signals.push("50–100 peak players");
  } else if (sig.peakPlayers === "20-50") {
    score = Math.max(score, 2);
    signals.push("20–50 peak players");
  } else if (sig.peakPlayers === "under-20") {
    score = Math.max(score, 1);
  }

  // staging / events
  if (sig.needsStaging === "yes") { score = Math.max(score, 1); signals.push("Needs staging environment"); }
  if (sig.needsEvents === "yes") { score = Math.max(score, 2); signals.push("Hosts events"); }

  // operationType
  if (["multi-creator-org", "competitive-org", "media-company"].includes(sig.operationType)) {
    score = Math.max(score, 3);
    signals.push(`Org type: ${sig.operationType.replace(/-/g, " ")}`);
  } else if (["large-smp", "content-studio"].includes(sig.operationType)) {
    score = Math.max(score, 2);
    signals.push(`Org type: ${sig.operationType.replace(/-/g, " ")}`);
  }

  // creatorType
  if (sig.creatorType === "smp") { score = Math.max(score, 1); signals.push("SMP creator type"); }

  // subscriberCount
  if (["500k-1m", "1m-plus"].includes(sig.subscriberCount)) {
    score = Math.max(score, 2);
    signals.push(`Subscriber count: ${sig.subscriberCount}`);
  } else if (sig.subscriberCount === "100k-500k" && score === 0) {
    score = 1;
    signals.push("Subscriber count: 100k–500k");
  }

  // budget clamp (LAST)
  if (sig.budgetRange === "under-50") {
    score = 0;
    warnings.push("Budget under $50/mo — only Creator Solo is viable");
  } else if (sig.budgetRange === "50-100" && score > 1) {
    warnings.push("Budget $50–100/mo may be tight for this tier");
  }

  const tierIdx = Math.min(Math.max(score, 0), 3);
  const confidence: "low" | "medium" | "high" =
    signals.length >= 3 ? "high" : signals.length >= 1 ? "medium" : "low";

  return { tierIdx, signals, warnings, confidence };
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function getPlansForProvider(provider: Provider): Plan[] {
  return provider === "bloom" ? BLOOM : PUFFERFISH;
}

function getRequiredRam(tier: Tier, provider: Provider): number {
  return provider === "bloom" ? tier.bloomRam : tier.puffRam;
}

function findHostingPlan(tierIdx: number, plans: Plan[], provider: Provider): Plan | undefined {
  const ram = getRequiredRam(TIERS[tierIdx], provider);
  return plans.find((p) => p.ram >= ram);
}

/** Returns the plan index that first satisfies each tier's RAM requirement. */
function tierPlanIndices(plans: Plan[], provider: Provider): Map<number, number> {
  const map = new Map<number, number>();
  TIERS.forEach((tier, ti) => {
    const ram = getRequiredRam(tier, provider);
    const idx = plans.findIndex((p) => p.ram >= ram);
    if (idx !== -1) map.set(ti, idx);
  });
  return map;
}

interface SignalSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function SignalSelect({ id, label, value, onChange, options, placeholder = "Select…" }: SignalSelectProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs text-muted-foreground mb-1 block">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-8 text-xs">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const EMPTY_SIGNALS: Signals = {
  creatorType: "", subscriberCount: "", budgetRange: "",
  operationType: "", peakPlayers: "", modpackTier: "",
  needsStaging: "", needsEvents: "",
};

export default function AdminInfrastructure() {
  const [provider, setProvider] = useState<Provider>("bloom");
  const [signals, setSignals] = useState<Signals>(EMPTY_SIGNALS);

  const plans = getPlansForProvider(provider);
  const planMap = tierPlanIndices(plans, provider);

  const hasInput = Object.values(signals).some((v) => v !== "");
  const rec = hasInput ? getRecommendation(signals) : null;
  const recPlanIdx = rec !== null ? plans.findIndex((p) => p.ram >= getRequiredRam(TIERS[rec.tierIdx], provider)) : -1;

  function setSig<K extends keyof Signals>(key: K, value: string) {
    setSignals((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Infrastructure</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hosting cost reference, tier economics, and plan recommender.
        </p>
      </div>

      {/* Provider toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setProvider("bloom")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-colors border",
            provider === "bloom"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5",
          )}
        >
          Bloom.host PPG
        </button>
        <button
          type="button"
          onClick={() => setProvider("pufferfish")}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-colors border",
            provider === "pufferfish"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5",
          )}
        >
          Pufferfish.host Premium
        </button>
      </div>

      {/* Plans table + Tier Economics side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        {/* Plans table */}
        <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              {provider === "bloom" ? "Bloom.host PPG Plans" : "Pufferfish.host Premium Plans"}
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">RAM</th>
                <th className="text-left px-5 py-3 font-medium">Cores</th>
                <th className="text-left px-5 py-3 font-medium">NVMe</th>
                <th className="text-left px-5 py-3 font-medium">$/mo</th>
                <th className="text-left px-5 py-3 font-medium">Tier</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, idx) => {
                const mappedTierIdx = [...planMap.entries()].find(([, pi]) => pi === idx)?.[0];
                const isRec = idx === recPlanIdx;
                return (
                  <tr
                    key={plan.ram}
                    className={cn(
                      "border-b border-white/5 last:border-0",
                      isRec && "bg-primary/10",
                      !isRec && mappedTierIdx !== undefined && "bg-white/[0.02]",
                    )}
                  >
                    <td className="px-5 py-2.5 font-mono font-medium">{plan.ram} GB</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{plan.cores}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{plan.storage} GB</td>
                    <td className="px-5 py-2.5 text-emerald-400 font-medium">${plan.price}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {mappedTierIdx !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground font-medium">
                            {TIER_SHORT[mappedTierIdx]}
                          </span>
                        )}
                        {isRec && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary font-semibold">
                            REC
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tier Economics */}
        <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Tier Economics (monthly list price)</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Tier</th>
                <th className="text-left px-5 py-3 font-medium">Revenue</th>
                <th className="text-left px-5 py-3 font-medium">Host Cost</th>
                <th className="text-left px-5 py-3 font-medium">Gross Profit</th>
                <th className="text-left px-5 py-3 font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier, ti) => {
                const hostPlan = findHostingPlan(ti, plans, provider);
                const hostCost = hostPlan?.price ?? 0;
                const profit = tier.monthly - hostCost;
                const margin = tier.monthly > 0 ? Math.round((profit / tier.monthly) * 100) : 0;
                const isRec = rec !== null && rec.tierIdx === ti;
                return (
                  <tr
                    key={tier.name}
                    className={cn(
                      "border-b border-white/5 last:border-0",
                      isRec && "bg-primary/10",
                    )}
                  >
                    <td className="px-5 py-2.5 font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        {tier.name.replace("Creator ", "")}
                        {isRec && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary font-semibold">
                            REC
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-muted-foreground">${tier.monthly}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">${hostCost}</td>
                    <td className={cn("px-5 py-2.5 font-medium", profit >= 0 ? "text-emerald-400" : "text-red-400")}>
                      ${profit}
                    </td>
                    <td className={cn("px-5 py-2.5 font-medium", margin >= 60 ? "text-emerald-400" : margin >= 40 ? "text-amber-400" : "text-red-400")}>
                      {margin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Resource Reference */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Tier Resource Reference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {TIERS.map((tier, ti) => {
            const ram = getRequiredRam(tier, provider);
            const hostPlan = findHostingPlan(ti, plans, provider);
            const isRec = rec !== null && rec.tierIdx === ti;
            return (
              <div
                key={tier.name}
                className={cn(
                  "bg-card border rounded-xl p-5",
                  isRec ? "border-primary/30 bg-primary/5" : "border-white/10",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {tier.name.replace("Creator ", "")}
                    </div>
                    <div className="text-lg font-semibold mt-0.5">${tier.monthly}<span className="text-xs text-muted-foreground font-normal">/mo</span></div>
                  </div>
                  {isRec && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary font-semibold shrink-0">
                      REC
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cpu className="w-3 h-3 shrink-0" />
                    <span>{ram} GB RAM · {hostPlan?.cores ?? "?"} cores</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HardDrive className="w-3 h-3 shrink-0" />
                    <span>{hostPlan?.storage ?? "?"} GB NVMe</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-3 h-3 shrink-0" />
                    <span>Up to {tier.maxPlayers} players</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="w-3 h-3 shrink-0" />
                    <span>{tier.modpack}</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 text-muted-foreground/70 leading-snug">
                    {tier.worlds}
                  </div>
                  {hostPlan && (
                    <div className="pt-1 text-muted-foreground/60">
                      Host: <span className="text-emerald-400">${hostPlan.price}/mo</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Recommender */}
      <div className="bg-card border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Plan Recommender</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SignalSelect
              id="creatorType" label="Creator Type" value={signals.creatorType} onChange={(v) => setSig("creatorType", v)}
              options={[
                { value: "youtube", label: "YouTube" }, { value: "twitch", label: "Twitch" },
                { value: "tiktok", label: "TikTok" }, { value: "smp", label: "SMP" },
                { value: "builder", label: "Builder" }, { value: "educator", label: "Educator" },
                { value: "other", label: "Other" },
              ]}
            />
            <SignalSelect
              id="subscriberCount" label="Subscriber Count" value={signals.subscriberCount} onChange={(v) => setSig("subscriberCount", v)}
              options={[
                { value: "under-1k", label: "Under 1K" }, { value: "1k-10k", label: "1K – 10K" },
                { value: "10k-100k", label: "10K – 100K" }, { value: "100k-500k", label: "100K – 500K" },
                { value: "500k-1m", label: "500K – 1M" }, { value: "1m-plus", label: "1M+" },
              ]}
            />
            <SignalSelect
              id="peakPlayers" label="Peak Concurrent Players" value={signals.peakPlayers} onChange={(v) => setSig("peakPlayers", v)}
              options={[
                { value: "under-20", label: "Under 20" }, { value: "20-50", label: "20 – 50" },
                { value: "50-100", label: "50 – 100" }, { value: "100+", label: "100+" },
              ]}
            />
            <SignalSelect
              id="modpackTier" label="Modpack Weight" value={signals.modpackTier} onChange={(v) => setSig("modpackTier", v)}
              options={[
                { value: "none", label: "None / Vanilla" }, { value: "light", label: "Light" },
                { value: "medium", label: "Medium" }, { value: "heavy", label: "Heavy" },
                { value: "ultra", label: "Ultra-heavy" },
              ]}
            />
            <SignalSelect
              id="budgetRange" label="Monthly Budget" value={signals.budgetRange} onChange={(v) => setSig("budgetRange", v)}
              options={[
                { value: "under-50", label: "Under $50" }, { value: "50-100", label: "$50 – $100" },
                { value: "100-200", label: "$100 – $200" }, { value: "200-plus", label: "$200+" },
                { value: "not-sure", label: "Not sure" },
              ]}
            />
            <SignalSelect
              id="operationType" label="Operation Type" value={signals.operationType} onChange={(v) => setSig("operationType", v)}
              options={[
                { value: "multi-creator-org", label: "Multi-creator org" }, { value: "large-smp", label: "Large SMP" },
                { value: "media-company", label: "Media company" }, { value: "competitive-org", label: "Competitive org" },
                { value: "content-studio", label: "Content studio" }, { value: "other", label: "Other / Solo" },
              ]}
            />
            <SignalSelect
              id="needsStaging" label="Needs Staging?" value={signals.needsStaging} onChange={(v) => setSig("needsStaging", v)}
              options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
            />
            <SignalSelect
              id="needsEvents" label="Hosts Events?" value={signals.needsEvents} onChange={(v) => setSig("needsEvents", v)}
              options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
            />
          </div>

          {/* Output */}
          <div>
            {!hasInput ? (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                <Zap className="w-8 h-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Fill in any signal to see a recommendation.</p>
              </div>
            ) : rec !== null ? (
              <div className="space-y-4">
                {/* Recommended tier */}
                <div className={cn("rounded-lg border p-4", "bg-primary/5 border-primary/20")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">Recommended</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded border font-medium",
                      rec.confidence === "high" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                      rec.confidence === "medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      "bg-white/5 border-white/10 text-muted-foreground",
                    )}>
                      {rec.confidence} confidence
                    </span>
                  </div>
                  <div className="text-xl font-semibold">{TIERS[rec.tierIdx].name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{TIERS[rec.tierIdx].desc}</div>
                </div>

                {/* Rev/cost/profit */}
                {(() => {
                  const hostPlan = findHostingPlan(rec.tierIdx, plans, provider);
                  const tier = TIERS[rec.tierIdx];
                  const cost = hostPlan?.price ?? 0;
                  const profit = tier.monthly - cost;
                  const margin = tier.monthly > 0 ? Math.round((profit / tier.monthly) * 100) : 0;
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Revenue", value: `$${tier.monthly}/mo`, cls: "text-foreground" },
                        { label: "Host Cost", value: `$${cost}/mo`, cls: "text-muted-foreground" },
                        { label: "Gross Profit", value: `$${profit}/mo`, cls: "text-emerald-400" },
                      ].map(({ label, value, cls }) => (
                        <div key={label} className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                          <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
                          <div className={cn("text-sm font-semibold", cls)}>{value}</div>
                        </div>
                      ))}
                      <div className="col-span-3 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Gross Margin</span>
                        <span className={cn("text-sm font-semibold", margin >= 60 ? "text-emerald-400" : margin >= 40 ? "text-amber-400" : "text-red-400")}>
                          {margin}%
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Signals */}
                {rec.signals.length > 0 && (
                  <div className="space-y-1">
                    {rec.signals.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {rec.warnings.length > 0 && (
                  <div className="space-y-1.5">
                    {rec.warnings.map((w) => (
                      <div key={w} className="flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
