import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 2026</p>

          <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-8">
            <p className="text-sm text-muted-foreground">
              CreatorOps ("CreatorOps", "we", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our managed Minecraft infrastructure services.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Name and email address</li>
                <li>Channel/content platform URLs</li>
                <li>Minecraft content creation requirements</li>
                <li>Server configuration preferences</li>
                <li>Payment and billing information</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We also automatically collect usage data about how you interact with our services, including server performance metrics and access logs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process applications and manage your account</li>
                <li>Communicate about your servers and our services</li>
                <li>Ensure security and reliability of your Minecraft worlds</li>
                <li>Send operational updates and service notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Storage & Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your data is protected by industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>World data stored on secure, professionally-managed infrastructure</li>
                <li>Automated encrypted backups according to your service tier</li>
                <li>Access controls and monitoring to prevent unauthorized access</li>
                <li>Regular security audits and updates</li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Your IP address is never exposed. All connections route through our proxy infrastructure.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Account information retained while your account is active</li>
                <li>World data retained according to your service tier backup policy</li>
                <li>You may request data deletion at any time</li>
                <li>You always have the right to download your complete world files</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Upon account termination, we provide a final world export upon request before permanent deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies & Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Necessary:</strong> Core website functionality and security</li>
                <li><strong className="text-foreground">Analytics:</strong> Understanding how visitors use our site (with consent)</li>
                <li><strong className="text-foreground">Marketing:</strong> Delivering relevant information (with consent)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can manage your cookie preferences at any time through our cookie banner. Your preferences are stored for 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use trusted third-party services for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Payment processing</li>
                <li>Analytics and performance monitoring</li>
                <li>Infrastructure and hosting</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These services are bound by their own privacy policies. We select partners who maintain high standards of data protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Restrict processing of your personal data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:legal@creatorops.io" className="text-primary hover:underline">
                  legal@creatorops.io
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Material changes will be communicated via email with reasonable notice. Continued use of our services constitutes acceptance of updated policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this Privacy Policy, contact us at{" "}
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
              © {new Date().getFullYear()} Stratus Technology Group. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default PrivacyPolicy;
