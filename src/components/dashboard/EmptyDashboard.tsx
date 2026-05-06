import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS: string[] = [
  "We review your application within 48 hours.",
  "We'll reach out via email to coordinate world migration.",
  "Your worlds and metrics appear here once they're live.",
];

export function EmptyDashboard() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 mx-auto">
        <Sparkles className="w-6 h-6" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-semibold text-center mb-3 text-foreground">
        Welcome to Creator Ops
      </h1>
      <p className="text-base text-muted-foreground text-center mb-10">
        We're getting your worlds ready. They'll appear here once provisioning
        is complete.
      </p>

      <div className="rounded-xl bg-card border border-white/10 p-6">
        <h2 className="text-sm font-medium text-foreground mb-4">
          What's next
        </h2>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0"
              >
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground leading-6">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-3 mt-8 justify-center">
        <Button asChild>
          <Link to="/support">Open a support ticket</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/sla">Read SLA</Link>
        </Button>
      </div>
    </div>
  );
}

export default EmptyDashboard;
