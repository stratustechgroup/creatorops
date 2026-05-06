import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsTeam() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl bg-card border border-white/10 p-6">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Team</h2>
          <Badge variant="secondary" className="text-xs">
            Coming soon
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Invite collaborators to access your dashboard. Available on Plus, Pro, and Studio plans.
        </p>

        <div className="rounded-lg border border-dashed border-white/10 bg-background/40 px-6 py-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            No team members yet
          </p>
          <p className="text-xs text-muted-foreground mb-5 max-w-xs">
            Bring your editors, ops folks, and admins into one shared dashboard.
          </p>
          <Button disabled>Invite teammate</Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Available with Creator Plus and above.
        </p>
      </div>
    </div>
  );
}
