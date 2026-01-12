import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";

const SLAAgreement = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Simple header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <span className="font-semibold text-foreground">Creator Ops</span>
              </Link>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-2">Service Level Agreement</h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 2026</p>

          <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-8">
            <p className="text-sm text-muted-foreground">
              This SLA defines CreatorOps' operational commitments to our customers. Service levels vary by tier and are subject to the exclusions outlined below.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Availability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CreatorOps targets high availability for all managed infrastructure. Availability calculations exclude:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Scheduled maintenance (communicated 48 hours in advance)</li>
                <li>Force majeure events</li>
                <li>Failures caused by third-party mods, plugins, or customer actions</li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> No uptime percentage is guaranteed during early access or beta periods.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Restore Commitments</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Restore response times and included restores vary by service tier:
              </p>

              {/* Tier comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Tier</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Restore Initiation</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Included/Month</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Creator Solo</td>
                      <td className="py-3 px-4">Best effort</td>
                      <td className="py-3 px-4">1 restore</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Creator Pro</td>
                      <td className="py-3 px-4">Within 4 hours</td>
                      <td className="py-3 px-4">3 restores</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Events & Collabs</td>
                      <td className="py-3 px-4">Within 2 hours</td>
                      <td className="py-3 px-4">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Additional restores beyond included limits may be billable or require a tier review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Support Response</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Support response times by tier:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Tier</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Response Time</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Creator Solo</td>
                      <td className="py-3 px-4">Best effort</td>
                      <td className="py-3 px-4">Business hours</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Creator Pro</td>
                      <td className="py-3 px-4">Priority queue</td>
                      <td className="py-3 px-4">Extended hours</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Events & Collabs</td>
                      <td className="py-3 px-4">Dedicated support</td>
                      <td className="py-3 px-4">Event window</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> 24/7 on-call support is not provided unless explicitly contracted.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Upgrade Safety</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>All upgrades are <strong className="text-foreground">opt-in</strong> and require your approval</li>
                <li>Production worlds are never upgraded without a rollback path</li>
                <li>Upgrades are tested in staging environments when available</li>
                <li>Rollback window of 72 hours for version changes</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                CreatorOps is not responsible for third-party mod or plugin incompatibilities following upgrades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Event Assurance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For scheduled live events (streams, recordings, collaborations):
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Pre-event stability verification available</li>
                <li>Priority monitoring during event windows</li>
                <li>Rapid response for event-critical issues</li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  If your server crashes during a scheduled live event due to CreatorOps infrastructure failure, you may be eligible for service credits. Contact support within 7 days of the incident.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. SLA Exclusions</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This SLA does not apply to issues arising from:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  Unsupported or experimental modpacks
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  Custom forks outside supported platforms
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  Abuse, griefing, or malicious activity
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  Customer-initiated configuration changes
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  Third-party service outages (Mojang, plugin APIs, etc.)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Service Credits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If CreatorOps fails to meet committed service levels due to our infrastructure:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Credits are applied to future billing cycles</li>
                <li>Credit requests must be submitted within 30 days of the incident</li>
                <li>Maximum credit per month: 50% of monthly fees</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To claim credits, contact{" "}
                <a href="mailto:legal@creatorops.io" className="text-primary hover:underline">
                  legal@creatorops.io
                </a>{" "}
                with incident details including dates, times, and impact description.
              </p>
            </section>
          </div>
        </main>

        <footer className="border-t border-border py-8">
          <div className="container px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Copyright {new Date().getFullYear()} © Stratus Technology Group
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default SLAAgreement;
