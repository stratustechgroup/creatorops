import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle, Check,
  Zap, Calendar, Clock, Shield, Users, RotateCcw, Star,
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

const eventsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Please enter a valid email"),
  eventType: z.string().min(1, "Please select an event type"),
  concurrentPlayers: z.string().min(1, "Please select a player count"),
  duration: z.string().min(1, "Please select a duration"),
  worldSetup: z.string().min(1, "Please select a world setup"),
  targetDate: z.string().min(1, "Please pick a window."),
});

type EventsFormData = z.infer<typeof eventsSchema>;
type QuotePath = "A" | "B" | "C" | "D";

const EVENTS_STORAGE_KEY = "events-quote-draft";

const eventsDefaultValues: EventsFormData = {
  firstName: "", lastName: "", email: "",
  eventType: "", concurrentPlayers: "", duration: "", worldSetup: "", targetDate: "",
};

function getQuotePath(data: EventsFormData): QuotePath {
  if (data.eventType === "recurring-series") return "D";
  if (data.concurrentPlayers === "50+" || data.duration === "week+") return "C";
  if (
    data.concurrentPlayers === "25-50" ||
    data.worldSetup === "custom-modpack" ||
    data.duration === "weekend"
  ) return "B";
  return "A";
}

function getSimpleEstimate(data: EventsFormData): { min: number; max: number } {
  let min = 75, max = 125;
  if (data.concurrentPlayers === "10-25") { min = 125; max = 200; }
  if (data.duration === "full-day") { min = Math.round(min * 1.5); max = Math.round(max * 1.5); }
  if (data.worldSetup === "migration") { min += 50; max += 75; }
  return { min: Math.round(min / 25) * 25, max: Math.round(max / 25) * 25 };
}

function getMediumEstimate(data: EventsFormData): { min: number; max: number } {
  let min = 300, max = 500;
  if (data.concurrentPlayers === "25-50") { min += 50; max += 100; }
  if (data.worldSetup === "custom-modpack") { min += 75; max += 100; }
  if (data.duration === "weekend") { min = Math.round(min * 1.3); max = Math.round(max * 1.3); }
  return { min: Math.round(min / 25) * 25, max: Math.round(max / 25) * 25 };
}

const eventIncludes = [
  "Pre-event provisioning and stability check",
  "Dedicated monitoring during your event window",
  "Instant rollback if anything goes wrong",
  "Post-event world backup and report",
];

const EventsQuote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ path: QuotePath; data: EventsFormData } | null>(null);
  const { toast } = useToast();
  const sendEmail = useAction(api.email.sendApplicationEmail);

  const memoizedDefaults = useMemo(() => eventsDefaultValues, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventsFormData>({
    resolver: zodResolver(eventsSchema),
    defaultValues: eventsDefaultValues,
  });

  // Enable autosave to localStorage
  const { clearSavedData } = useFormAutosave({
    watch,
    reset,
    storageKey: EVENTS_STORAGE_KEY,
    defaultValues: memoizedDefaults,
  });

  const eventType = watch("eventType");
  const concurrentPlayers = watch("concurrentPlayers");
  const duration = watch("duration");
  const worldSetup = watch("worldSetup");
  const targetDate = watch("targetDate");

  const onSubmit = async (data: EventsFormData) => {
    setIsSubmitting(true);
    const path = getQuotePath(data);
    try {
      await sendEmail({ formType: "events", formData: { ...data, quotePath: path } });
      clearSavedData();
      setResult({ path, data });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us at hi@creatorops.io",
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
          {!result ? (
            /* Step 1 — Event details */
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                  <Zap className="w-4 h-4" />
                  Events & Collabs
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Tell us about your event.
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Answer five quick questions and we'll give you a price estimate on the spot — or tell you exactly what we need to scope it properly.
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
                    {/* Contact */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Your Contact Info</h2>
                        <p className="text-sm text-muted-foreground mt-1">So we can send you the quote</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" placeholder="Alex" {...register("firstName")} />
                          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" placeholder="Creator" {...register("lastName")} />
                          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Event Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">These five answers determine your quote</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Event Type *</Label>
                        <Select value={eventType} onValueChange={(v) => setValue("eventType", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="What kind of event is this?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creator-collab">Creator collaboration</SelectItem>
                            <SelectItem value="tournament">Tournament or competition</SelectItem>
                            <SelectItem value="charity-stream">Charity stream</SelectItem>
                            <SelectItem value="smp-launch">SMP launch or opening day</SelectItem>
                            <SelectItem value="community-event">Community event</SelectItem>
                            <SelectItem value="recurring-series">Recurring series or regular events</SelectItem>
                            <SelectItem value="other">Other one-time event</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.eventType && <p className="text-sm text-destructive">{errors.eventType.message}</p>}
                        {eventType === "recurring-series" && (
                          <p className="text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">
                            Recurring events are usually a better fit for Creator Pro or Studio — we'll cover this after you submit.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Expected Concurrent Players *</Label>
                        <Select value={concurrentPlayers} onValueChange={(v) => setValue("concurrentPlayers", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="How many players at peak?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-10">Under 10 players</SelectItem>
                            <SelectItem value="10-25">10 – 25 players</SelectItem>
                            <SelectItem value="25-50">25 – 50 players</SelectItem>
                            <SelectItem value="50+">50+ players</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.concurrentPlayers && <p className="text-sm text-destructive">{errors.concurrentPlayers.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Event Duration *</Label>
                        <Select value={duration} onValueChange={(v) => setValue("duration", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="How long does the event run?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="session">Single session (under 8 hours)</SelectItem>
                            <SelectItem value="full-day">Full day (8 – 24 hours)</SelectItem>
                            <SelectItem value="weekend">Weekend (2 – 3 days)</SelectItem>
                            <SelectItem value="week+">A week or longer</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>World Setup *</Label>
                        <Select value={worldSetup} onValueChange={(v) => setValue("worldSetup", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="What does your world need?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fresh-vanilla">Fresh vanilla world</SelectItem>
                            <SelectItem value="fresh-modpack">Fresh world with an existing modpack</SelectItem>
                            <SelectItem value="migration">Migrate an existing world</SelectItem>
                            <SelectItem value="custom-modpack">Custom modpack we need to configure</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.worldSetup && <p className="text-sm text-destructive">{errors.worldSetup.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Target Date *</Label>
                        <Select value={targetDate} onValueChange={(v) => setValue("targetDate", v, { shouldValidate: true })}>
                          <SelectTrigger>
                            <SelectValue placeholder="When is your event?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="within-2-weeks">Within 2 weeks</SelectItem>
                            <SelectItem value="2-to-4-weeks">2 to 4 weeks out</SelectItem>
                            <SelectItem value="1-to-2-months">1 to 2 months out</SelectItem>
                            <SelectItem value="more-than-2-months">More than 2 months out</SelectItem>
                            <SelectItem value="flexible">Flexible / not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Approximate is fine — we just need to know how much runway we have.</p>
                        {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate.message}</p>}
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Calculating...</>
                      ) : (
                        <>Get My Quote <ArrowRight className="w-4 h-4 ml-2" /></>
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
                    <h3 className="font-semibold text-foreground">Every event includes</h3>
                    <ul className="space-y-3">
                      {eventIncludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      Simple events quoted instantly
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      Complex events reviewed within 24h
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <RotateCcw className="w-4 h-4 text-primary shrink-0" />
                      Instant rollback during your event window
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
                    <p className="text-sm text-muted-foreground">
                      Questions before filling this out?{" "}
                      <a href="mailto:hi@creatorops.io" className="text-primary hover:underline">
                        hi@creatorops.io
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Step 2 — Quote result */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto py-20"
            >
              {result.path === "A" && <PathA data={result.data} />}
              {result.path === "B" && <PathB data={result.data} />}
              {result.path === "C" && <PathC data={result.data} />}
              {result.path === "D" && <PathD />}
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

/* ── Path A: Instant estimate ── */
function PathA({ data }: { data: EventsFormData }) {
  const { min, max } = getSimpleEstimate(data);
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
        <Star className="w-10 h-10 text-primary" />
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
        <CheckCircle className="w-4 h-4" />
        Instant Estimate
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Your event estimate
      </h2>
      <div className="text-5xl font-bold text-primary mb-2">
        ${min} – ${max}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Starting estimate based on your inputs. Final pricing confirmed after a quick review.</p>
      <p className="text-muted-foreground mb-8 mt-4">
        Based on your event setup — includes provisioning, monitoring, rollback coverage, and a post-event backup.
      </p>
      <div className="p-6 rounded-2xl border border-white/10 bg-card/50 text-left mb-8">
        <h3 className="font-semibold text-foreground mb-3">What's included at this price</h3>
        <ul className="space-y-2">
          {eventIncludes.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <a
          href="https://calendly.com/creatorops/events"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Confirm with a Quick Call
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-sm text-muted-foreground">
          Or we'll send a formal quote to <span className="text-foreground">{data.email}</span> within a few hours.
        </p>
      </div>
    </div>
  );
}

/* ── Path B: Estimate range + review ── */
function PathB({ data }: { data: EventsFormData }) {
  const { min, max } = getMediumEstimate(data);
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="w-10 h-10 text-primary" />
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
        <Clock className="w-4 h-4" />
        Estimate Pending Confirmation
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Estimated range
      </h2>
      <div className="text-5xl font-bold text-primary mb-2">
        ${min} – ${max}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Starting estimate based on your inputs. Final pricing confirmed after a quick review.</p>
      <p className="text-muted-foreground mb-8 mt-4">
        Your event has a few specifics we want to confirm before locking in a number. We'll reach out within 24 hours — or grab a time to talk it through now.
      </p>
      <div className="space-y-3">
        <a
          href="https://calendly.com/creatorops/events"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Schedule a Planning Call
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-sm text-muted-foreground">
          Or we'll follow up at <span className="text-foreground">{data.email}</span> within 24 hours.
        </p>
      </div>
    </div>
  );
}

/* ── Path C: Complex — call required ── */
function PathC({ data }: { data: EventsFormData }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
        <Zap className="w-10 h-10 text-primary" />
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
        <Calendar className="w-4 h-4" />
        Planning Call Required
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        This event needs a proper plan.
      </h2>
      <p className="text-muted-foreground mb-8">
        At this scale there are too many variables to quote without a conversation. We want to get this right — let's spend 30 minutes scoping it together before we commit to anything.
      </p>
      <div className="space-y-3">
        <a
          href="https://calendly.com/creatorops/events"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Book an Event Planning Call
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-sm text-muted-foreground">
          Or we'll reach out to <span className="text-foreground">{data.email}</span> within 24 hours to schedule.
        </p>
      </div>
    </div>
  );
}

/* ── Path D: Recurring — redirect to plans ── */
function PathD() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
        <Users className="w-10 h-10 text-primary" />
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
        <RotateCcw className="w-4 h-4" />
        Better Fit Available
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        Sounds like you need always-on infrastructure.
      </h2>
      <p className="text-muted-foreground mb-8">
        Recurring events are better served by a Creator Pro or Studio plan — you get a persistent world, better pricing over time, and scheduled event support built in rather than per-event billing.
      </p>
      <div className="space-y-3">
        <Link
          to="/#plans"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View Creator Pro & Studio Plans
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/studio"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg text-sm font-medium bg-white/5 text-foreground hover:bg-white/10 border border-white/10 transition-colors"
        >
          Talk to Us About Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default EventsQuote;
