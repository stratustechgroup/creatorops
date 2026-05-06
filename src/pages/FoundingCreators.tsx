import { motion } from "framer-motion";
import { 
  Sparkles, 
  DollarSign, 
  Heart, 
  MessageSquare, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  Check,
  Shield,
  Clock,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PageTransition } from "@/components/PageTransition";

import { useSpotsConfig } from "@/hooks/useSpotsConfig";

const keyBenefits = [
  {
    icon: DollarSign,
    title: "Forever Pricing",
    description: "Lock in your rate permanently. Never pay more, even as prices increase.",
  },
  {
    icon: Heart,
    title: "Priority Support",
    description: "Direct line to our team. 24-hour response, always.",
  },
  {
    icon: MessageSquare,
    title: "Shape the Roadmap",
    description: "Your feedback drives what we build next.",
  },
];

const allBenefits = [
  { icon: DollarSign, text: "Locked-in founding rate forever" },
  { icon: Heart, text: "White-glove priority support" },
  { icon: MessageSquare, text: "Direct input on product roadmap" },
  { icon: Zap, text: "Early access to new features" },
  { icon: Users, text: "Exclusive founder community" },
  { icon: Star, text: "Permanent founding badge" },
  { icon: Shield, text: "Free migration assistance" },
  { icon: Clock, text: "Flexible pause options" },
];

const foundingFaqs = [
  {
    question: "What's the pricing for founding creators?",
    answer: "Founding creators lock in their rate forever. Once set, it never increases — even as we raise prices for new customers.",
  },
  {
    question: "What commitment is required?",
    answer: "A minimum 3-month commitment to give us time to learn from real usage. After that, continue month-to-month at your locked rate. No long-term contracts.",
  },
  {
    question: "How much feedback is expected?",
    answer: "Not much. A quick monthly check-in and honest input when we ask. You're here to create content, not beta test. We respect your time.",
  },
  {
    question: "Can I migrate an existing world?",
    answer: "Absolutely. We handle the full migration at no extra cost for founding creators, regardless of world size or complexity.",
  },
  {
    question: "What if I need to pause?",
    answer: "Founding creators can pause up to 2 months per year without losing their rate. Life happens—we get it.",
  },
];

const FoundingCreators = () => {
  const { totalSpots, spotsTaken, spotsRemaining } = useSpotsConfig();
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar hideNavLinks />

        <main className="pt-20">
          {/* Hero Section - Benefits Focused */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
            
            <div className="container relative z-10 px-4">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    Only {spotsRemaining} spots left
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    <span className="text-foreground">The first {totalSpots} creators get</span>
                    <br />
                    <span className="text-gradient">a permanent rate.</span>
                  </h1>

                  <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                    Founding creators lock in pricing forever, get white-glove migration, and have a direct line to me — the founder. We're picking {spotsRemaining} more, then the cohort closes.
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-4 mb-8">
                    {keyBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <benefit.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button variant="hero" size="xl" className="group" asChild>
                      <Link to="/founding-apply">
                        Apply for founding access
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="xl" asChild>
                      <a href="#plans">See locked-in rates</a>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Right - Visual Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card via-card to-secondary/50 border border-border shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      {/* Badge */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Founding</div>
                            <div className="font-semibold text-foreground">Creator</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-xs font-medium text-primary">#{spotsTaken + 1}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center p-4 rounded-xl bg-background/50">
                          <div className="text-2xl font-bold text-foreground">{spotsRemaining}</div>
                          <div className="text-xs text-muted-foreground">Spots Left</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-background/50">
                          <div className="text-2xl font-bold text-foreground">Forever</div>
                          <div className="text-xs text-muted-foreground">Locked Rate</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-background/50">
                          <div className="text-2xl font-bold text-foreground">24h</div>
                          <div className="text-xs text-muted-foreground">Response</div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Spots filled</span>
                          <span className="font-medium text-foreground">{spotsTaken}/{totalSpots}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(spotsTaken / totalSpots) * 100}%` }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Quick benefits */}
                      <div className="space-y-2">
                        {["Forever pricing lock", "Priority support", "Product influence"].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Locked-in Pricing Section */}
          <section id="plans" className="py-20 md:py-28 border-t border-border">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Locked-in founding rates
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Even when standard prices rise, your rate doesn't. Every plan stays at its founding price for as long as you're with us.
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { tier: "Solo Founding", founding: 79, standard: 99 },
                    { tier: "Plus Founding", founding: 103, standard: 129 },
                    { tier: "Pro Founding", founding: 159, standard: 199 },
                    { tier: "Studio Founding", founding: 319, standard: 399 },
                  ].map((plan, index) => {
                    const annualSavings = (plan.standard - plan.founding) * 12;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-baseline justify-between mb-3">
                          <h3 className="font-semibold text-foreground">{plan.tier}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Saves ${annualSavings}/yr
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-foreground">${plan.founding}</span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">${plan.standard}/mo</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Locked forever, even when standard pricing rises.</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* All Benefits Section */}
          <section id="benefits" className="py-20 md:py-28 border-t border-border">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Everything You Get
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Founding creators receive exclusive perks that no one else will ever have access to.
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  {allBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* From the Founder */}
          <section className="py-20 md:py-28 border-t border-border">
            <div className="container px-4">
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-xs uppercase tracking-wider text-primary font-medium mb-4">
                    From the founder
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                    I'm James. Here's why I'm building this.
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Every creator I've talked to has a story about a server crash that ate a recording session. That shouldn't be the price of running a Minecraft channel.
                    </p>
                    <p>
                      Founding creators get my phone number, basically. We figure out together what reliable infrastructure for creators actually looks like — and you lock in the rate that funds it, forever.
                    </p>
                    <p>
                      That's the trade. You're early, your feedback shapes the product, and your pricing never moves.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What We're Asking */}
          <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    What we're asking from you
                  </h2>
                  <p className="text-muted-foreground">
                    Honest framing — no surprises, no fine print.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "3-month minimum",
                      description: "So we can learn from real usage. After that, month-to-month at your locked rate.",
                    },
                    {
                      title: "Monthly 15-min check-in",
                      description: "Not a focus group — just direct feedback on what's working and what isn't.",
                    },
                    {
                      title: "Honest input when something breaks",
                      description: "Tell us when it's broken. We'd rather hear it from you than guess.",
                    },
                  ].map((ask, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="p-6 rounded-2xl bg-card border border-border"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-primary">{index + 1}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{ask.title}</h3>
                      <p className="text-sm text-muted-foreground">{ask.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 md:py-28">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Common Questions
                </h2>
              </motion.div>
              
              <div className="max-w-2xl mx-auto">
                <Accordion type="single" collapsible className="space-y-3">
                  {foundingFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`faq-${index}`}
                      className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-background to-primary/5">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                  <Sparkles className="w-4 h-4" />
                  {spotsRemaining} founding spots remaining
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Join?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Apply now to secure your spot. We review applications within 48 hours.
                </p>
                
                <Button variant="hero" size="xl" className="group" asChild>
                  <Link to="/founding-apply">
                    Apply for Founding Access
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <p className="text-sm text-muted-foreground mt-6">
                  Questions? <a href="mailto:hi@creatorops.io" className="text-primary hover:underline">Reach out directly</a>
                </p>
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
