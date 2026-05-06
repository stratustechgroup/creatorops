import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAnalytics } from "@/hooks/useAnalytics";

const faqs = [
  {
    question: "What is managed Minecraft server hosting?",
    answer:
      "Managed Minecraft server hosting means a provider handles all technical operations on your behalf — backups, monitoring, incident response, version upgrades, and mod configuration. Unlike traditional shared hosting where you manage the server yourself through a control panel (Pterodactyl, Multicraft, etc.), a managed service lets content creators focus entirely on recording and streaming while infrastructure runs in the background. Creator Ops is built specifically for this model — we don't sell you a panel and walk away.",
  },
  {
    question: "How is Creator Ops different from Apex, BisectHosting, or Shockbyte?",
    answer:
      "Apex, BisectHosting, Shockbyte, and similar hosts sell you server access — you manage the panel, install mods, configure backups, and handle crashes via tickets. Creator Ops is the opposite model: we run your server like production infrastructure for your content business. That includes a 4-hour restore SLA on Pro, dedicated staging environments, version pinning, IP-hidden proxy protection, and direct human support. We're a managed service, not a hosting commodity.",
  },
  {
    question: "How do backups work?",
    answer:
      "We run automated backups every 6 hours, stored off-server for maximum safety, with 30-day retention. You can request a restore at any time. Pro tier guarantees restoration within 4 hours, even at 2am before a big upload. Your content is treated like production data — because it is.",
  },
  {
    question: "Can I transfer my existing world?",
    answer:
      "Absolutely. During onboarding, we'll help you migrate your existing world files to our infrastructure. We handle the technical details—version compatibility, mod configuration, and validation—so your world arrives exactly as you left it.",
  },
  {
    question: "What if I want to leave?",
    answer:
      "You always own your world. Download your complete world files anytime through our dashboard. No lock-in, no hostage situations. If you decide to leave, you take everything with you.",
  },
  {
    question: "How do version upgrades work?",
    answer:
      "We pin your Minecraft version until you explicitly approve an upgrade. When you're ready, we test the upgrade in a staging environment first. If anything breaks, we roll back instantly. No surprise updates breaking your series mid-recording.",
  },
  {
    question: "What's the difference between the plans?",
    answer:
      "Creator Solo ($99/mo or $79/mo annual) is for individual creators with one production world. Creator Plus ($129/mo or $103/mo annual) adds a dedicated staging environment so you can test changes before they go live. Creator Pro ($199/mo or $159/mo annual) supports unlimited worlds with a guaranteed 4-hour restore SLA and priority support. Creator Studio ($399/mo or $319/mo annual) is built for established creators and networks — dedicated managed server, custom SLA, and a dedicated account manager.",
  },
  {
    question: "Do you support mods and plugins?",
    answer:
      "Yes. We support both Forge/Fabric mods and Bukkit/Spigot/Paper plugins. During onboarding, we'll configure your mod stack and ensure everything runs smoothly together. We also help troubleshoot mod conflicts.",
  },
  {
    question: "What happens if my server crashes during a recording?",
    answer:
      "Our infrastructure is designed for stability, but if something does go wrong, we're on it immediately. Pro plan users get priority support with faster response times. Either way, your latest backup is always safe.",
  },
  {
    question: "Can collaborators access my world?",
    answer:
      "Yes—you control who has access. Add or remove collaborators anytime. Plus and Pro users can spin up separate staging worlds for experiments, keeping your production world pristine.",
  },
];

export const FAQ = () => {
  const { trackEvent } = useAnalytics();

  const handleFAQOpen = (question: string) => {
    trackEvent("faq_expand", {
      question: question,
    });
  };

  return (
    <section id="faq" className="py-24 lg:py-32 bg-card/30">
      <div className="container-default">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-sm text-primary font-medium mb-4 tracking-wide">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
            Common questions.
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our managed infrastructure.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full"
        >
          <div className="border border-white/5 rounded-xl overflow-hidden">
            <Accordion
              type="single"
              collapsible
              className="divide-y divide-white/5"
              onValueChange={(value) => {
                if (value) {
                  const index = parseInt(value.replace("item-", ""));
                  handleFAQOpen(faqs[index]?.question || "");
                }
              }}
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-0"
                >
                  <AccordionTrigger className="px-6 py-5 text-left text-foreground hover:text-primary hover:no-underline text-base font-medium data-[state=open]:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
