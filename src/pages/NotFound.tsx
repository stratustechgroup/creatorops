import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { urlForPath } from "@/lib/hosts";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-lg">
            <p className="text-sm text-primary font-medium mb-4 tracking-wide">404</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              We can't find that page.
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              The link may be broken, or the page may have moved. Here are some places to start instead.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a href={urlForPath("/")} className="btn-primary">
                <Home className="w-4 h-4" />
                Home
              </a>
              <a href={urlForPath("/") + "#pricing"} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href={urlForPath("/") + "#faq"} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                FAQ
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Need help? <a href="mailto:hi@creatorops.io" className="text-primary hover:underline">hi@creatorops.io</a>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default NotFound;
