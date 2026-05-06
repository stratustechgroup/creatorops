import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  channel?: string;
  channelUrl?: string;
  avatarUrl?: string;
};

// Replace this array with real creator testimonials. When empty, the section
// hides itself entirely so visitors never see a "no testimonials yet" state.
const testimonials: Testimonial[] = [
  {
    quote:
      "My world, my players, zero downtime. Creator Ops is the silent partner every Minecraft creator needs.",
    name: "Wren",
    role: "Minecraft YouTuber",
    // Add channel + channelUrl + avatarUrl when available:
    // channel: "@wren",
    // channelUrl: "https://youtube.com/@wren",
    // avatarUrl: "/testimonials/wren.jpg",
  },
];

export const Testimonials = () => {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="container-default">
        <div className="max-w-3xl mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-primary font-medium mb-4 tracking-wide"
          >
            CREATORS WHO TRUST US
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            What creators are saying.
          </motion.h2>
        </div>

        <div className={`grid gap-6 ${testimonials.length === 1 ? "max-w-2xl" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {testimonials.map((t, index) => (
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index }}
              className="p-6 rounded-2xl border border-white/10 bg-card/50"
            >
              <Quote className="w-6 h-6 text-primary mb-4" aria-hidden="true" />
              <blockquote className="text-foreground/90 leading-relaxed mb-6">
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-white/5">
                {t.avatarUrl && (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}
                    {t.channel && (
                      <>
                        {" · "}
                        {t.channelUrl ? (
                          <a
                            href={t.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {t.channel}
                          </a>
                        ) : (
                          t.channel
                        )}
                      </>
                    )}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
