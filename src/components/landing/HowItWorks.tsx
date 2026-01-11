import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Apply",
    description: "We review your use case and world needs",
  },
  {
    number: "02",
    title: "Onboard",
    description: "We provision and configure your managed world",
  },
  {
    number: "03",
    title: "Create",
    description: "You join, build, and record like normal",
  },
  {
    number: "04",
    title: "Relax",
    description: "Backups, updates, and recovery are handled automatically",
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-24 md:py-32 border-y border-border">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Minecraft hosting without the hosting headaches.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="text-4xl font-bold text-primary/30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
