import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Sparkles, MessageSquare, DollarSign, Heart, Users, Zap, Clock, Star, ArrowRight, HelpCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";

// ============================================
// SPOTS CONFIGURATION - Update this value as spots fill up
// This can later be connected to a database/API
// ============================================
const TOTAL_SPOTS = 10;
const SPOTS_TAKEN = 3; // Update this number as creators join
const SPOTS_REMAINING = TOTAL_SPOTS - SPOTS_TAKEN;

const benefits = [
  { 
    icon: DollarSign, 
    title: "Locked-In Pricing",
    description: "Early adopters keep their founding rate forever—even as prices increase"
  },
  { 
    icon: Heart, 
    title: "White-Glove Support",
    description: "Priority access to our team with faster response times and dedicated assistance"
  },
  { 
    icon: MessageSquare, 
    title: "Shape the Product",
    description: "Direct input on features and roadmap—we build what creators actually need"
  },
  { 
    icon: Zap, 
    title: "Early Feature Access",
    description: "Be the first to try new capabilities before they roll out to everyone"
  },
  { 
    icon: Users, 
    title: "Founder Community",
    description: "Connect with other serious creators in an exclusive feedback group"
  },
  { 
    icon: Star, 
    title: "Founding Badge",
    description: "Permanent recognition as an original Creator Ops founding member"
  },
];

const asks = [
  {
    title: "Share Your Feedback",
    description: "Help us improve with honest thoughts on what works and what doesn't"
  },
  {
    title: "Actually Use It",
    description: "Run real recording sessions so we can learn from genuine workflows"
  },
  {
    title: "Tell Your Story",
    description: "Optional: share a testimonial or case study to help other creators"
  },
];

// Animated counter component
const AnimatedCounter = ({ value, duration = 1.5 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, motionValue, rounded]);

  return <span>{displayValue}</span>;
};

const foundingFaqs = [
  {
    question: "How much does the Founding Creator Program cost?",
    answer: "Founding creators receive significant discounts off our standard pricing—typically 30-50% off. The exact rate depends on your world size and requirements, but once locked in, your rate never increases, even as we raise prices for new customers."
  },
  {
    question: "What commitment is required?",
    answer: "We ask for a minimum 3-month commitment to give us enough time to learn from your real-world usage. After that, you can continue month-to-month at your locked-in rate. There are no long-term contracts required."
  },
  {
    question: "How long will the Founding Program be open?",
    answer: "We are limiting the program to just 10 creators to maintain quality and personalized support. Once all spots are filled, the program closes permanently. We review applications on a rolling basis and typically respond within 48 hours."
  },
  {
    question: "What if I need to pause or cancel?",
    answer: "Life happens. Founding creators can pause their service for up to 2 months per year without losing their locked-in rate. If you need to cancel, you can always return later—though at whatever the current pricing is at that time."
  },
  {
    question: "How much feedback is actually expected?",
    answer: "We are not looking for daily reports. A quick monthly check-in, honest responses when we ask for input, and flagging any issues you encounter is plenty. We respect your time—you are here to create content, not beta test software."
  },
  {
    question: "Can I join if I have an existing world?",
    answer: "Absolutely. We will help migrate your existing world to our infrastructure as part of onboarding. We have handled worlds of all sizes and complexity levels. Migration is included at no extra cost for founding creators."
  },
];

const FoundingCreators = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
            
            <div className="container relative z-10 px-4">
              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary font-medium">
                  <Sparkles className="w-4 h-4" />
                  Limited Availability
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Founding Creator Program
                </h1>
                <p className="text-xl text-muted-foreground mb-10">
                  Join a small group of serious creators helping shape the future of Minecraft infrastructure. 
                  Get exclusive benefits, locked-in pricing, and direct influence on what we build.
                </p>
              </motion.div>

              {/* Spots Remaining Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-md mx-auto"
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border border-primary/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary">Spots Filling Fast</span>
                    </div>
                    
                    <div className="flex items-baseline justify-center gap-2 mb-4">
                      <span className="text-6xl md:text-7xl font-bold text-primary">
                        <AnimatedCounter value={SPOTS_REMAINING} />
                      </span>
                      <span className="text-2xl text-muted-foreground">/ {TOTAL_SPOTS}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">spots remaining</p>
                    
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(SPOTS_TAKEN / TOTAL_SPOTS) * 100}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      />
                    </div>
                    
                    <div className="flex justify-center gap-1.5 mt-4">
                      {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                          className={`w-3 h-3 rounded-full ${
                            i < SPOTS_TAKEN 
                              ? "bg-primary" 
                              : "bg-muted border border-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
                    <div className="text-2xl font-bold text-foreground">Forever</div>
                    <div className="text-xs text-muted-foreground">Locked Pricing</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
                    <div className="text-2xl font-bold text-foreground">24hr</div>
                    <div className="text-xs text-muted-foreground">Response Time</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Benefits & Asks Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* What you get - 3 columns */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="lg:col-span-3 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        What You Get
                      </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                          className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                              <benefit.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground text-sm mb-1">{benefit.title}</h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* What we ask - 2 columns */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="lg:col-span-2 p-8 rounded-2xl bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        What We Ask
                      </h2>
                    </div>
                    <div className="space-y-4 mb-8">
                      {asks.map((ask, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                          className="p-4 rounded-xl bg-background/30 border border-border/50"
                        >
                          <h3 className="font-medium text-foreground text-sm mb-1">{ask.title}</h3>
                          <p className="text-xs text-muted-foreground">{ask.description}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4 italic">
                        "We want partners, not just customers. Your input directly shapes what we build."
                      </p>
                      <Button variant="hero" size="lg" className="w-full group" asChild>
                        <Link to="/apply">
                          Apply Now
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-24 border-t border-border">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    Frequently Asked Questions
                  </h2>
                </div>
                
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <Accordion type="single" collapsible className="w-full">
                    {foundingFaqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`founding-faq-${index}`}
                        className="border-border"
                      >
                        <AccordionTrigger className="text-left text-sm font-medium hover:text-primary transition-colors py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Final CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-12 text-center"
                >
                  <p className="text-muted-foreground mb-4">
                    Still have questions? We are happy to chat.
                  </p>
                  <Button variant="hero" size="xl" className="group" asChild>
                    <Link to="/apply">
                      Apply for Founding Access
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FoundingCreators;