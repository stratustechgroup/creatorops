import { motion } from "framer-motion";
import { Sparkles, MessageSquare, DollarSign, Heart, Users, Zap, Clock, Star, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const stats = [
  { value: "10", label: "Founding Spots" },
  { value: "Forever", label: "Locked Pricing" },
  { value: "24hr", label: "Response Time" },
];

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

export const FoundingProgram = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary font-medium">
            <Sparkles className="w-4 h-4" />
            Limited to 10 Creators
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Founding Creator Program
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join a small group of serious creators helping shape the future of Minecraft infrastructure. 
            Get exclusive benefits, locked-in pricing, and direct influence on what we build.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 mb-16">
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
                <h3 className="text-xl font-semibold text-foreground">
                  What You Get
                </h3>
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
                        <h4 className="font-medium text-foreground text-sm mb-1">{benefit.title}</h4>
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
                <h3 className="text-xl font-semibold text-foreground">
                  What We Ask
                </h3>
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
                    <h4 className="font-medium text-foreground text-sm mb-1">{ask.title}</h4>
                    <p className="text-xs text-muted-foreground">{ask.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "We want partners, not just customers. Your input directly shapes what we build."
                </p>
                <Button variant="outline" size="sm" className="w-full group" asChild>
                  <Link to="/apply">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Founding Program FAQ */}
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
              <h3 className="text-2xl font-semibold text-foreground">
                Founding Program FAQ
              </h3>
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
              className="mt-8 text-center"
            >
              <p className="text-muted-foreground mb-4">
                Still have questions? We are happy to chat.
              </p>
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/apply">
                  Apply for Founding Access
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
