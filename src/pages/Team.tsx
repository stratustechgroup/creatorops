import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";
import jamesFarmerImg from "@/assets/james-farmer.jpg";

const team = [
  {
    name: "James Farmer",
    role: "Founder & CEO",
    bio: "Passionate about building infrastructure that lets creators focus on what they do best. Years of experience in Minecraft hosting and a deep understanding of what content creators actually need.",
    image: jamesFarmerImg,
  },
  // Add more team members here as needed
];

const Team = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Meet the{" "}
                  <span className="text-gradient">Team</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  The people behind Creator Ops who are dedicated to making your Minecraft infrastructure invisible so you can focus on creating amazing content.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Team Grid */}
          <section className="py-16">
            <div className="container px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border text-center"
                  >
                    {/* Avatar placeholder */}
                    <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-4">{member.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </motion.div>
                ))}

                {/* Join the team card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: team.length * 0.1 }}
                  className="p-6 rounded-2xl border border-dashed border-border bg-secondary/20 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-full bg-secondary/50 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">?</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">This Could Be You</h3>
                  <p className="text-sm text-primary mb-4">Join Our Team</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We're always looking for passionate people who care about creators and infrastructure.
                  </p>
                  <a
                    href="mailto:hello@creatorops.io"
                    className="text-sm text-primary hover:underline"
                  >
                    hello@creatorops.io
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16 bg-secondary/20">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions? Want to learn more about how we can help your content creation? We'd love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" size="lg" asChild>
                    <a href="https://creatorops.io/discord" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Join Discord
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="mailto:hello@creatorops.com">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Us
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Work With Us?</h2>
                <p className="text-muted-foreground mb-8">
                  Join the founding creators shaping the future of Minecraft infrastructure.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/founding-apply">Apply for Creator Access</Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Team;
