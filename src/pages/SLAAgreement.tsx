import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Uptime Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Creator Ops commits to 99.5% uptime for all production worlds, measured monthly. Scheduled maintenance windows are excluded from uptime calculations and will be communicated at least 48 hours in advance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Backup Guarantee</h2>
              <p className="text-muted-foreground leading-relaxed">
                Automated backups are performed every 4 hours for all production worlds. Backups are retained for a minimum of 30 days. Off-server backup storage ensures data survival even in case of primary infrastructure failure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Restore Response Times</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">We commit to the following restore response times:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Creator Solo:</strong> Within 24 hours</li>
                  <li><strong className="text-foreground">Creator Pro:</strong> Within 4 hours</li>
                  <li><strong className="text-foreground">Events & Collabs:</strong> Within 2 hours</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Support Response Times</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">Support ticket response times by plan:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Creator Solo:</strong> Within 48 hours</li>
                  <li><strong className="text-foreground">Creator Pro:</strong> Within 12 hours</li>
                  <li><strong className="text-foreground">Events & Collabs:</strong> Within 4 hours (dedicated support)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Version Stability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We guarantee that your Minecraft version will not be changed without your explicit approval. All version upgrades are tested in staging environments before production deployment and are fully reversible within 72 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Service Credits</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">If we fail to meet uptime commitments, you are entitled to service credits:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">99.0% - 99.5%:</strong> 10% credit</li>
                  <li><strong className="text-foreground">95.0% - 99.0%:</strong> 25% credit</li>
                  <li><strong className="text-foreground">Below 95.0%:</strong> 50% credit</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Exclusions</h2>
              <p className="text-muted-foreground leading-relaxed">
                This SLA does not apply to: scheduled maintenance, issues caused by customer actions or third-party mods, force majeure events, or beta/preview features explicitly marked as such.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Claiming Credits</h2>
              <p className="text-muted-foreground leading-relaxed">
                To claim service credits, submit a request to sla@stratustechgroup.com within 30 days of the incident. Include dates, times, and a description of the service failure.
              </p>
            </section>
          </div>
        </main>

        <footer className="border-t border-border py-8">
          <div className="container px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Stratus Technology Group. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default SLAAgreement;
