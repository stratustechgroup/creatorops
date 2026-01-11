import { motion } from "framer-motion";
import { Check, X, Users, Sparkles, Video, Shield } from "lucide-react";

const forCreators = [
  {
    icon: Video,
    title: "YouTubers & Streamers",
    description: "Running long-form Minecraft series that can't afford interruptions"
  },
  {
    icon: Users,
    title: "SMP Organizers",
    description: "Collab groups needing reliable multi-creator access"
  },
  {
    icon: Sparkles,
    title: "Cinematic Builders",
    description: "Custom or cinematic worlds that took weeks to create"
  },
  {
    icon: Shield,
    title: "Serious Creators",
    description: "Anyone who can't afford to lose progress or recordings"
  },
];

const notFor = [
  "Budget-focused shared hosting shoppers",
  "Public servers open to viewers",
  "Casual hobby servers without content stakes",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export const Audience = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Perfect Fit
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Is This For You?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            If losing your world would hurt your channel, this is for you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* For - Takes 3 columns */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-3 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
          >
            <h3 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              Who This Is For
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {forCreators.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Not for - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 p-8 rounded-2xl bg-secondary/30 border border-border"
          >
            <h3 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </div>
              Not The Right Fit
            </h3>
            <ul className="space-y-4">
              {notFor.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                "This is professional infrastructure for serious creators who treat their content like a business."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
