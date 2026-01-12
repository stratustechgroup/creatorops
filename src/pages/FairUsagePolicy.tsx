import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";

const FairUsagePolicy = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Fair Usage Policy</h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 2026</p>

          <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-8">
            <p className="text-sm text-muted-foreground">
              This Fair Usage Policy ensures all CreatorOps customers receive consistent, high-quality service. Our infrastructure is optimized for content creator workflows, not unlimited general-purpose computing.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Intended Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CreatorOps is designed for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Content creation and recording sessions</li>
                <li>Live streaming with your community</li>
                <li>Private creator worlds and SMPs</li>
                <li>Collaboration between invited team members</li>
                <li>Building, testing, and pre-production work</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Concurrent Players</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Recommended concurrent player limits by tier:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Creator Solo:</strong> Up to 5 concurrent players</li>
                <li><strong className="text-foreground">Creator Pro:</strong> Up to 15 concurrent players</li>
                <li><strong className="text-foreground">Events & Collabs:</strong> Custom limits based on agreement</li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> These are guidelines, not hard limits. Occasional spikes are expected during recordings or events.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Storage Usage</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fair usage storage allocations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Creator Solo:</strong> Up to 50GB world data</li>
                <li><strong className="text-foreground">Creator Pro:</strong> Up to 200GB total across all worlds</li>
                <li><strong className="text-foreground">Events & Collabs:</strong> Custom allocation</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you're approaching limits, we'll reach out to discuss options—not cut you off.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The following uses are not permitted:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Public servers open to random viewers/players</li>
                <li>Pay-to-play or monetized server access</li>
                <li>Cryptocurrency mining or non-Minecraft workloads</li>
                <li>Hosting content that violates laws or Minecraft EULA</li>
                <li>Reselling or sublicensing infrastructure access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Resource-Intensive Activities</h2>
              <p className="text-muted-foreground leading-relaxed">
                Certain activities like world pre-generation, large TNT explosions, or heavy redstone contraptions may temporarily impact performance. Please schedule resource-intensive activities during off-peak hours when possible, or contact us to coordinate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Policy Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take a collaborative approach to enforcement. If we notice usage patterns outside fair use guidelines, we'll reach out to discuss your needs. Our goal is always to find a solution that works, whether that's adjusting your plan or optimizing your setup.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you're unsure whether your intended use falls within this policy, contact us at{" "}
                <a href="mailto:legal@creatorops.io" className="text-primary hover:underline">
                  legal@creatorops.io
                </a>{" "}
                before signing up. We're happy to clarify.
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

export default FairUsagePolicy;
