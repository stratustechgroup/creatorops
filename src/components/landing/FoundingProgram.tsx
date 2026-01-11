import { motion } from "framer-motion";
import { Sparkles, MessageSquare, DollarSign, Heart, Users, Zap, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        </div>
      </div>
    </section>
  );
};
