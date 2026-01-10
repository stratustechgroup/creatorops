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
                <span className="font-semibold text-foreground">CreatorCloud</span>
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
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly, including your name, email address, channel URL, and details about your Minecraft content creation needs. We also collect usage data about how you interact with our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, process your applications, communicate with you about your account and our services, and ensure the security and reliability of your Minecraft worlds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your Minecraft world data is stored on secure, professionally-managed infrastructure with automated backups. We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your account information and world data for as long as your account is active. You may request deletion of your data at any time, and you always have the right to download your complete world files.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for payment processing, analytics, and infrastructure. These services are bound by their own privacy policies and we select partners who maintain high standards of data protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@stratustechgroup.com.
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
