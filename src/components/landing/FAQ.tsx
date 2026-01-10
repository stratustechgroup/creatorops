import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do backups work?",
    answer: "We run automated backups multiple times per day, stored off-server for maximum safety. You can request a restore at any time, and we'll roll your world back to a previous state within hours. Your content is treated like production data—because it is.",
  },
  {
    question: "Can I transfer my existing world?",
    answer: "Absolutely. During onboarding, we'll help you migrate your existing world files to our infrastructure. We handle the technical details—version compatibility, mod configuration, and validation—so your world arrives exactly as you left it.",
  },
  {
    question: "What if I want to leave?",
    answer: "You always own your world. Download your complete world files anytime through our dashboard. No lock-in, no hostage situations. If you decide to leave, you take everything with you.",
  },
  {
    question: "How do version upgrades work?",
    answer: "We pin your Minecraft version until you explicitly approve an upgrade. When you're ready, we test the upgrade in a staging environment first. If anything breaks, we roll back instantly. No surprise updates breaking your series mid-recording.",
  },
  {
    question: "What's the difference between Solo and Pro plans?",
    answer: "Solo is perfect for individual creators with one production world. Pro adds multiple worlds (production + staging/collab), priority restore times, and higher performance limits—ideal for creators running SMPs or collaborating frequently.",
  },
  {
    question: "Do you support mods and plugins?",
    answer: "Yes. We support both Forge/Fabric mods and Bukkit/Spigot/Paper plugins. During onboarding, we'll configure your mod stack and ensure everything runs smoothly together. We also help troubleshoot mod conflicts.",
  },
  {
    question: "What happens if my server crashes during a recording?",
    answer: "Our infrastructure is designed for stability, but if something does go wrong, we're on it immediately. Pro plan users get priority support with faster response times. Either way, your latest backup is always safe.",
  },
  {
    question: "Can collaborators access my world?",
    answer: "Yes—you control who has access. Add or remove collaborators anytime. Pro plan users can spin up separate staging worlds for experiments, keeping your production world pristine.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about our managed Minecraft infrastructure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card-gradient border border-border rounded-xl px-6 data-[state=open]:shadow-glow transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
