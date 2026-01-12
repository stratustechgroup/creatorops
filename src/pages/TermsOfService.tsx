import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 2026</p>

          <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-8">
            <p className="text-sm text-muted-foreground">
              CreatorOps ("CreatorOps", "we", "us") provides managed Minecraft world infrastructure and operational services to creators ("Customer", "you"). By accessing or using CreatorOps, you agree to these Terms of Service.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Service Scope</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CreatorOps provides managed infrastructure services, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Server provisioning and operation</li>
                <li>Automated backups and restore capability</li>
                <li>Version pinning and managed upgrades</li>
                <li>Operational support based on selected service tier</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                CreatorOps does <strong className="text-foreground">not</strong> provide gameplay services, content creation, or guarantees related to third-party mods, plugins, or software.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. World Ownership</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>You retain <strong className="text-foreground">full ownership</strong> of your world data at all times.</li>
                <li>You may request a full world export at any time.</li>
                <li>Upon cancellation or termination, CreatorOps will provide a final world export upon request.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Backups & Restores</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                <li>Backups are performed according to your service tier.</li>
                <li>Restore availability and response times depend on your tier.</li>
                <li>Restore requests beyond included limits may incur additional charges.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-2">
                CreatorOps does not guarantee recovery from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Corrupt, malicious, or incompatible mods/plugins</li>
                <li>Experimental or unsupported configurations</li>
                <li>Actions taken outside CreatorOps-managed environments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Pricing & Billing</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                <li>Pricing is tier-based and <strong className="text-foreground">starting at</strong> advertised rates.</li>
                <li>Final pricing reflects world size, performance requirements, and operational complexity.</li>
                <li>Billing is monthly unless otherwise agreed.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                All fees are <strong className="text-foreground">non-refundable</strong> once infrastructure has been provisioned.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Support & Fair Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Support is intended for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                <li>Infrastructure incidents</li>
                <li>Restores</li>
                <li>Managed upgrades</li>
                <li>Configuration assistance</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Excessive or abusive support usage may result in:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Tier review</li>
                <li>Pricing adjustment</li>
                <li>Service termination</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                CreatorOps may suspend or terminate service for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                <li>Non-payment</li>
                <li>Abuse of support expectations</li>
                <li>Malicious or illegal activity</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Termination includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Reasonable notice where possible</li>
                <li>World export upon request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                CreatorOps is not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-4">
                <li>Lost revenue</li>
                <li>Lost content opportunities</li>
                <li>Indirect or consequential damages</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Total liability is limited to fees paid in the preceding <strong className="text-foreground">30 days</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                CreatorOps may update these Terms at any time. Continued use of the service constitutes acceptance of updated terms. Material changes will be communicated via email with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, contact us at{" "}
                <a href="mailto:legal@creatorops.io" className="text-primary hover:underline">
                  legal@creatorops.io
                </a>
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

export default TermsOfService;
