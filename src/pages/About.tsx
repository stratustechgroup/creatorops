import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Target, Heart, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Creator-First",
    description: "Every decision we make starts with one question: does this help creators focus on content?",
  },
  {
    icon: Heart,
    title: "Reliability Over Features",
    description: "We'd rather do fewer things exceptionally well than many things poorly. Your uptime matters more than our feature list.",
  },
  {
    icon: Zap,
    title: "Proactive, Not Reactive",
    description: "We catch problems before you notice them. Our job is to make infrastructure invisible so you can create.",
  },
  {
    icon: Shield,
    title: "Your Data, Your World",
    description: "You always own your content. No lock-in, no hostage situations. Download your world anytime.",
  },
];

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Built by Creators,{" "}
                  <span className="text-gradient">for Creators</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  We started Creator Ops because we were tired of watching amazing content get ruined by preventable technical problems. Server crashes during streams, lost worlds from bad updates, hours wasted on infrastructure instead of creating.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-secondary/20">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Story</h2>
                <div className="prose prose-lg dark:prose-invert mx-auto">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Creator Ops was born from a simple observation: content creators shouldn't need to be system administrators. Yet every day, talented creators lose valuable time—and sometimes entire projects—to infrastructure problems that should never have happened.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We've spent years in the Minecraft hosting space, watching the same patterns repeat. Creators start with passion projects, grow their audiences, and then hit a wall when their technical needs outpace their technical skills. The existing options? Either expensive enterprise solutions designed for corporations, or budget hosting that treats your content like just another game server.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Creator Ops fills that gap. We provide enterprise-grade infrastructure with creator-focused service. We speak your language—content schedules, recording sessions, collaboration workflows—not server specs and JVM flags. When you work with us, you get a technical partner who understands that your world isn't just data. It's your livelihood.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">What We Believe</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our values guide every decision we make, from how we build our infrastructure to how we support our creators.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary/5">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Focus on Creating?</h2>
                <p className="text-muted-foreground mb-8">
                  Join the creators who've made the switch to fully managed infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/founding-apply">Apply Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/team">Meet the Team</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
