import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle, Check,
  Building2, Users, Zap, Shield, Clock, Calendar,
} from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/landing/Logo";
import { PageTransition } from "@/components/PageTransition";
import { useFormAutosave } from "@/hooks/useFormAutosave";

const studioSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Please enter a valid email"),
  operationType: z.string().min(1, "Please select your operation type"),
  peakPlayers: z.string().min(1, "Please select a player range"),
  currentPainPoint: z.string().min(1, "Please select your biggest challenge"),
  timeline: z.string().min(1, "Please select a timeline"),
  tellUsMore: z.string().trim().max(1000, "Must be less than 1000 characters").optional().or(z.literal("")),
});

type StudioFormData = z.infer<typeof studioSchema>;

const STUDIO_STORAGE_KEY = "studio-contact-draft";

const studioDefaultValues: StudioFormData = {
  firstName: "", lastName: "", email: "",
  operationType: "", peakPlayers: "", currentPainPoint: "", timeline: "", tellUsMore: "",
};

const studioFeatures = [
  "Dedicated managed server built for your workflow",
  "Custom SLA — you define the uptime requirements",
  "Dedicated account manager who knows your setup",
  "White-glove onboarding and world migration",
  "Event Assurance + pre-event stress testing",
];

const StudioContact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<StudioFormData | null>(null);
  const { toast } = useToast();
  const sendEmail = useAction(api.email.sendApplicationEmail);

  const memoizedDefaults = useMemo(() => studioDefaultValues, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StudioFormData>({
    resolver: zodResolver(studioSchema),
    defaultValues: studioDefaultValues,
  });

  // Enable autosave to localStorage
  const { clearSavedData } = useFormAutosave({
    watch,
    reset,
    storageKey: STUDIO_STORAGE_KEY,
    defaultValues: memoizedDefaults,
  });

  const operationType = watch("operationType");
  const peakPlayers = watch("peakPlayers");
  const currentPainPoint = watch("currentPainPoint");
  const timeline = watch("timeline");

  const isCustomScale = submittedData?.peakPlayers === "100+";

  const onSubmit = async (data: StudioFormData) => {
    setIsSubmitting(true);
    try {
      await sendEmail({ formType: "studio", formData: data });
      clearSavedData();
      setSubmittedData(data);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly at hi@creatorops.io",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <Logo className="w-9 h-9" />
                <span className="font-semibold text-foreground">Creator Ops</span>
              </Link>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/#plans">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Plans
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container px-4 py-12 md:py-20">
          {!submittedData ? (
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                  <Building2 className="w-4 h-4" />
                  Creator Studio
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Tell us about your operation.
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Creator Studio is built for established creators and networks. Share a bit about your setup and we'll reach out to schedule a call.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-12">
                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="lg:col-span-2"
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* About You */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">About You</h2>
                        <p className="text-sm text-muted-foreground mt-1">How we'll get in touch</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" placeholder="Alex" {...register("firstName")} />
                          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" placeholder="Studio" {...register("lastName")} />
                          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Your Operation */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Your Operation</h2>
                        <p className="text-sm text-muted-foreground mt-1">Help us understand your scale and needs</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Operation Type *</Label>
                        <Select value={operationType} onValueChange={(v) => setValue("operationType", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="What best describes your operation?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multi-creator-org">Multi-creator organization or network</SelectItem>
                            <SelectItem value="large-smp">Large SMP with dedicated community</SelectItem>
                            <SelectItem value="media-company">Media company or production studio</SelectItem>
                            <SelectItem value="competitive-org">Competitive/esports organization</SelectItem>
                            <SelectItem value="content-studio">Content studio with multiple projects</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.operationType && <p className="text-sm text-destructive">{errors.operationType.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Peak Concurrent Players *</Label>
                        <Select value={peakPlayers} onValueChange={(v) => setValue("peakPlayers", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="How many players at peak?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-20">Under 20 players</SelectItem>
                            <SelectItem value="20-50">20 – 50 players</SelectItem>
                            <SelectItem value="50-100">50 – 100 players</SelectItem>
                            <SelectItem value="100+">100+ players</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.peakPlayers && <p className="text-sm text-destructive">{errors.peakPlayers.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Biggest Current Challenge *</Label>
                        <Select value={currentPainPoint} onValueChange={(v) => setValue("currentPainPoint", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="What's causing the most pain right now?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uptime">Uptime and reliability</SelectItem>
                            <SelectItem value="backups">Backup and restore reliability</SelectItem>
                            <SelectItem value="scaling">Scaling for events or growth</SelectItem>
                            <SelectItem value="mod-management">Mod and plugin management</SelectItem>
                            <SelectItem value="support-response">Support response time</SelectItem>
                            <SelectItem value="coordination">Coordinating across a team</SelectItem>
                            <SelectItem value="other">Something else</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.currentPainPoint && <p className="text-sm text-destructive">{errors.currentPainPoint.message}</p>}
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Timing</h2>
                        <p className="text-sm text-muted-foreground mt-1">So we can prioritize accordingly</p>
                      </div>
                      <div className="space-y-2">
                        <Label>When do you need to be live? *</Label>
                        <Select value={timeline} onValueChange={(v) => setValue("timeline", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="1-3-months">1 – 3 months</SelectItem>
                            <SelectItem value="exploring">Just exploring for now</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.timeline && <p className="text-sm text-destructive">{errors.timeline.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tellUsMore">Anything else we should know? <span className="text-muted-foreground">(optional)</span></Label>
                        <Textarea
                          id="tellUsMore"
                          placeholder="Tell us about your current setup, specific requirements, or anything that would help us prepare for the conversation."
                          rows={4}
                          {...register("tellUsMore")}
                          className="resize-none"
                        />
                        {errors.tellUsMore && <p className="text-sm text-destructive">{errors.tellUsMore.message}</p>}
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                      ) : (
                        <>Let's Talk <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </form>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-6 lg:pt-0 pt-4"
                >
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <h3 className="font-semibold text-foreground">Creator Studio includes</h3>
                    <ul className="space-y-3">
                      {studioFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      We'll reach out within 24 hours
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      30-minute discovery call to start
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      No commitment required
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      Dedicated account manager from day one
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
                    <p className="text-sm text-muted-foreground">
                      Prefer to reach out directly?{" "}
                      <a href="mailto:hi@creatorops.io" className="text-primary hover:underline">
                        hi@creatorops.io
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Success / Result Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto py-20"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                {isCustomScale ? (
                  <>
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                      <Zap className="w-4 h-4" />
                      Custom Infrastructure Needed
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      This calls for a proper planning session.
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Operations at your scale have variables we need to understand before we can scope it properly. We've received your details and will reach out within 24 hours — or grab a time below to skip the wait.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                      <Building2 className="w-4 h-4" />
                      Creator Studio
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Creator Studio is built for this.
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Based on what you shared, Creator Studio covers your operation well. We've received your details and will reach out within 24 hours — or book a call now and we'll come prepared.
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <a
                  href="https://calendly.com/creatorops/studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Discovery Call
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-center text-sm text-muted-foreground">
                  Or we'll email you at <span className="text-foreground">{submittedData.email}</span> within 24 hours.
                </p>
              </div>

              <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-card/50">
                <h3 className="font-semibold text-foreground mb-4">What happens next</h3>
                <ol className="space-y-3">
                  {[
                    "We review your submission and prepare for the call",
                    "30-minute discovery call to understand your exact setup",
                    "We put together a custom onboarding plan",
                    "White-glove migration and go-live",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default StudioContact;
