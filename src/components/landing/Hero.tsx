import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

const features = [
  "Automated backups every 6 hours",
  "One-click rollback to any point",
  "Zero downtime during recordings",
];

export const Hero = () => {
  const { trackEvent } = useAnalytics();

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "hero",
      button_text: "Apply for Access",
    });
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Subtle gradient background - no mesh, cleaner */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />

      {/* Single subtle glow - not multiple orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container-default relative">
        {/* Asymmetric two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column - Content */}
          <div className="order-2 lg:order-1">
            {/* Small label - not a badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-primary font-medium mb-6 tracking-wide"
            >
              MANAGED MINECRAFT INFRASTRUCTURE
            </motion.p>

            {/* Headline - editorial style, left-aligned */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
            >
              Your world runs like a{" "}
              <span className="text-primary">production system</span>
              —because it is one.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
            >
              We handle the infrastructure so you can focus on creating.
              Backups, monitoring, rollbacks, and support—all managed for you.
            </motion.p>

            {/* Feature list - simple, no fancy cards */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground/80">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/founding-apply"
                onClick={handleApplyClick}
                className="btn-primary"
              >
                Apply for Access
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Play className="w-4 h-4" />
                See how it works
              </a>
            </motion.div>

            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 text-sm text-muted-foreground"
            >
              <span className="text-accent font-medium">7 spots remaining</span> in the Founding Creator program
            </motion.p>
          </div>

          {/* Right column - Dashboard/Terminal preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-1 lg:order-2"
            style={{ perspective: '1500px' }}
          >
            {/* Dashboard mockup - Static 3D tilt with hover effect */}
            <motion.div
              initial={{ rotateY: -12, rotateX: 6 }}
              whileHover={{
                rotateY: -6,
                rotateX: 3,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shadow underneath for 3D depth */}
              <div
                className="absolute inset-0 bg-black/60 rounded-2xl blur-2xl -z-10 translate-y-8 translate-x-4"
              />

              {/* Glow behind the card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-40" />

              {/* Main dashboard card */}
              <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Window header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-3 text-xs text-muted-foreground font-mono">dashboard.creatorops.io</span>
                </div>

                {/* Dashboard content */}
                <div className="p-6">
                  {/* Status header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">WORLD STATUS</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-lg font-semibold text-foreground">Production Online</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">UPTIME</p>
                      <p className="text-lg font-mono text-emerald-400">99.97%</p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Last Backup", value: "4 min ago", color: "text-foreground" },
                      { label: "Restore Point", value: "30 days", color: "text-foreground" },
                      { label: "Players Ready", value: "Unlimited", color: "text-foreground" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/[0.03] rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                        <p className={`text-sm font-medium ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent activity */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">RECENT ACTIVITY</p>
                    <div className="space-y-2">
                      {[
                        { action: "Backup completed", time: "4 min ago", status: "success" },
                        { action: "Performance check passed", time: "12 min ago", status: "success" },
                        { action: "Memory optimized", time: "1 hour ago", status: "info" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              activity.status === "success" ? "bg-emerald-400" : "bg-blue-400"
                            }`} />
                            <span className="text-sm text-foreground/80">{activity.action}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
