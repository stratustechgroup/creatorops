import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationModal = ({ isOpen, onClose }: ApplicationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    channel: "",
    creatorType: "",
    useCase: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset form after animation completes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ email: "", name: "", channel: "", creatorType: "", useCase: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {!isSubmitted ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Apply for Creator Access
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Tell us about your Minecraft content and we'll get you set up.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-secondary/50 border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-secondary/50 border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="channel">Channel / Platform URL</Label>
                        <Input
                          id="channel"
                          placeholder="youtube.com/c/yourchannel"
                          value={formData.channel}
                          onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                          className="bg-secondary/50 border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>What type of creator are you?</Label>
                        <Select
                          value={formData.creatorType}
                          onValueChange={(value) => setFormData({ ...formData, creatorType: value })}
                        >
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue placeholder="Select creator type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="youtube">YouTube Creator</SelectItem>
                            <SelectItem value="twitch">Twitch Streamer</SelectItem>
                            <SelectItem value="smp">SMP Organizer</SelectItem>
                            <SelectItem value="builder">Cinematic Builder</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="useCase">Tell us about your world & content</Label>
                        <Textarea
                          id="useCase"
                          placeholder="What kind of Minecraft content do you create? What are your current pain points?"
                          value={formData.useCase}
                          onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                          className="bg-secondary/50 border-border min-h-[100px] resize-none"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Application Received!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      We'll review your application and get back to you within 48 hours.
                    </p>
                    <Button variant="outline" onClick={handleClose}>
                      Close
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
