import { motion } from "framer-motion";

const creators = [
  { name: "Dream SMP", logo: "🌙" },
  { name: "Hermitcraft", logo: "⚒️" },
  { name: "SciCraft", logo: "🔬" },
  { name: "BuildersMC", logo: "🏗️" },
  { name: "CubeCraft", logo: "🧊" },
  { name: "PixelPerfect", logo: "🎨" },
  { name: "RedstoneLabs", logo: "⚡" },
  { name: "SurvivalPlus", logo: "🌲" },
];

export const CreatorLogos = () => {
  return (
    <section className="py-16 px-4 border-y border-border/30 bg-muted/30">
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider"
        >
          Trusted by Leading Minecraft Creators
        </motion.p>
        
        {/* Logo grid */}
        <div className="relative overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Scrolling logos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-12 animate-scroll"
          >
            {/* Double the logos for seamless loop */}
            {[...creators, ...creators].map((creator, index) => (
              <div
                key={`${creator.name}-${index}`}
                className="flex items-center gap-3 flex-shrink-0 group"
              >
                <div className="w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center text-2xl group-hover:border-primary/30 group-hover:shadow-glow transition-all duration-300">
                  {creator.logo}
                </div>
                <span className="text-muted-foreground font-medium whitespace-nowrap group-hover:text-foreground transition-colors">
                  {creator.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Static grid for larger screens - alternative display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="hidden lg:grid grid-cols-4 gap-6 mt-12"
        >
          {creators.map((creator, index) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all duration-300 group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl group-hover:bg-primary/20 transition-colors">
                {creator.logo}
              </div>
              <span className="text-foreground font-medium">{creator.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
