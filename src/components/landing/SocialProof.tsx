import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Finally, I can focus on building without worrying about losing everything to a bad update.",
    author: "Alex M.",
    role: "100K+ YouTube Creator",
    avatar: "A",
  },
  {
    quote: "The rollback feature saved my 6-month series. Worth every penny.",
    author: "Jordan K.",
    role: "SMP Organizer",
    avatar: "J",
  },
  {
    quote: "Zero-ops means zero stress. I just log in and create.",
    author: "Sam T.",
    role: "Cinematic Builder",
    avatar: "S",
  },
];

export const SocialProof = () => {
  return (
    <section className="relative py-16 border-t border-border">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-muted-foreground mb-2">
            Trusted by early creators running long-form series, SMPs, and custom worlds.
          </p>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6 rounded-xl bg-card-gradient border border-border shadow-card"
            >
              <p className="text-foreground text-sm mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
