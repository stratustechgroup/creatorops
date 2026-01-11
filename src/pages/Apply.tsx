import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Shield, Clock, Users, RotateCcw, Save, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/landing/Logo";
import { PageTransition } from "@/components/PageTransition";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFormAutosave } from "@/hooks/useFormAutosave";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  discordUsername: z.string().trim().max(32, "Discord username must be less than 32 characters").optional().or(z.literal("")),
  preferredContact: z.string().optional(),
  channelUrl: z.string().trim().max(500, "URL must be less than 500 characters").optional().or(z.literal("")),
  subscriberCount: z.string().optional(),
  creatorType: z.string().min(1, "Please select your creator type"),
  currentSetup: z.string().trim().min(10, "Please provide more detail about your current setup").max(1000, "Must be less than 1000 characters"),
  useCase: z.string().trim().min(20, "Please provide more detail about your content and needs").max(2000, "Must be less than 2000 characters"),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  referral: z.string().trim().max(200, "Must be less than 200 characters").optional().or(z.literal("")),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const trustPoints = [
  { icon: Shield, text: "Your data is secure and never shared" },
  { icon: Clock, text: "Response within 48 hours" },
  { icon: Users, text: "Join our founding creator community" },
];

const STORAGE_KEY = "creatorops_application_draft";

const defaultFormValues: ApplicationFormData = {
  firstName: "",
  lastName: "",
  email: "",
  discordUsername: "",
  preferredContact: "",
  channelUrl: "",
  subscriberCount: "",
  creatorType: "",
  currentSetup: "",
  useCase: "",
  budgetRange: "",
  timeline: "",
  referral: "",
};

const Apply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();

  // Memoize default values to prevent infinite loop in useFormAutosave
  const memoizedDefaults = useMemo(() => defaultFormValues, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  // Enable autosave to localStorage
  const { clearSavedData, hasSavedData, lastSavedAt } = useFormAutosave({
    watch,
    reset,
    storageKey: STORAGE_KEY,
    defaultValues: memoizedDefaults,
  });

  const handleClearDraft = () => {
    clearSavedData();
    reset(defaultFormValues);
    trackEvent("form_clear_draft", { form_name: "application" });
  };

  const formatSavedTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const creatorType = watch("creatorType");
  const timeline = watch("timeline");
  const subscriberCount = watch("subscriberCount");
  const budgetRange = watch("budgetRange");
  const preferredContact = watch("preferredContact");

  // Helper to check if a field is valid (touched/dirty and no errors)
  const isFieldValid = (fieldName: keyof ApplicationFormData) => {
    const value = watch(fieldName);
    const hasValue = value && value.toString().trim().length > 0;
    const hasNoError = !errors[fieldName];
    const wasTouched = touchedFields[fieldName] || dirtyFields[fieldName];
    return hasValue && hasNoError && wasTouched;
  };

  // Helper to get input className based on validation state
  const getInputClassName = (fieldName: keyof ApplicationFormData, baseClass = "") => {
    if (errors[fieldName]) return `${baseClass} border-destructive pr-10`;
    if (isFieldValid(fieldName)) return `${baseClass} border-primary/50 pr-10`;
    return baseClass;
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    trackEvent("form_submit", {
      form_name: "application",
      creator_type: data.creatorType,
      subscriber_count: data.subscriberCount,
      has_channel: !!data.channelUrl,
      timeline: data.timeline,
    });

    try {
      const { data: response, error } = await supabase.functions.invoke("send-application-email", {
        body: {
          formType: "standard",
          formData: data,
        },
      });

      if (error) {
        throw error;
      }

      // Clear saved draft on successful submission
      clearSavedData();
      setIsSubmitted(true);

      trackEvent("form_success", {
        form_name: "application",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <Logo className="w-9 h-9" />
                <span className="font-semibold text-foreground">Creator Ops</span>
              </Link>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container px-4 py-12 md:py-20">
          {!isSubmitted ? (
            <div className="max-w-4xl mx-auto">
              {/* Page header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Limited Founding Creator Spots
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Apply for Creator Access
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tell us about your Minecraft content and infrastructure needs. 
                  We review every application personally to ensure we're the right fit.
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
                    {/* Autosave indicator */}
                    {lastSavedAt && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg w-fit"
                      >
                        <Save className="w-4 h-4 text-primary" />
                        <span>Draft saved {formatSavedTime(lastSavedAt)}</span>
                      </motion.div>
                    )}
                    {/* Section 1: About You */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">About You</h2>
                        <p className="text-sm text-muted-foreground mt-1">Basic information to get started</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <div className="relative">
                            <Input
                              id="firstName"
                              placeholder="John"
                              {...register("firstName")}
                              className={getInputClassName("firstName")}
                            />
                            {isFieldValid("firstName") && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            )}
                          </div>
                          {errors.firstName && (
                            <p className="text-sm text-destructive">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <div className="relative">
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              {...register("lastName")}
                              className={getInputClassName("lastName")}
                            />
                            {isFieldValid("lastName") && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            )}
                          </div>
                          {errors.lastName && (
                            <p className="text-sm text-destructive">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              {...register("email")}
                              className={getInputClassName("email")}
                            />
                            {isFieldValid("email") && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            )}
                          </div>
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="discordUsername">Discord Username</Label>
                          <div className="relative">
                            <Input
                              id="discordUsername"
                              placeholder="username"
                              {...register("discordUsername")}
                              className={getInputClassName("discordUsername")}
                            />
                            {isFieldValid("discordUsername") && (
                              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            )}
                          </div>
                          {errors.discordUsername && (
                            <p className="text-sm text-destructive">{errors.discordUsername.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Contact Method</Label>
                        <Select value={preferredContact} onValueChange={(value) => setValue("preferredContact", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred contact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="discord">Discord</SelectItem>
                            <SelectItem value="either">Either works</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">How would you like us to reach you?</p>
                      </div>
                    </div>

                    {/* Section 2: Your Channel */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Your Channel</h2>
                        <p className="text-sm text-muted-foreground mt-1">Help us understand your content</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="channelUrl">Channel or Platform URL</Label>
                        <div className="relative">
                          <Input
                            id="channelUrl"
                            placeholder="https://youtube.com/@yourchannel"
                            {...register("channelUrl")}
                            className={getInputClassName("channelUrl")}
                          />
                          {isFieldValid("channelUrl") && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          )}
                        </div>
                        {errors.channelUrl && (
                          <p className="text-sm text-destructive">{errors.channelUrl.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">YouTube, Twitch, TikTok, or other platform</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Subscriber / Follower Count</Label>
                          <Select value={subscriberCount} onValueChange={(value) => setValue("subscriberCount", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-1k">Under 1,000</SelectItem>
                              <SelectItem value="1k-10k">1,000 - 10,000</SelectItem>
                              <SelectItem value="10k-100k">10,000 - 100,000</SelectItem>
                              <SelectItem value="100k-500k">100,000 - 500,000</SelectItem>
                              <SelectItem value="500k-1m">500,000 - 1 Million</SelectItem>
                              <SelectItem value="1m-plus">1 Million+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Creator Type *</Label>
                          <div className="relative">
                            <Select value={creatorType} onValueChange={(value) => setValue("creatorType", value, { shouldDirty: true })}>
                              <SelectTrigger className={errors.creatorType ? "border-destructive" : isFieldValid("creatorType") ? "border-primary/50" : ""}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="youtube">YouTube Creator</SelectItem>
                                <SelectItem value="twitch">Twitch Streamer</SelectItem>
                                <SelectItem value="tiktok">TikTok Creator</SelectItem>
                                <SelectItem value="smp">SMP Organizer</SelectItem>
                                <SelectItem value="builder">Cinematic Builder</SelectItem>
                                <SelectItem value="educator">Minecraft Educator</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {isFieldValid("creatorType") && (
                              <Check className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            )}
                          </div>
                          {errors.creatorType && (
                            <p className="text-sm text-destructive">{errors.creatorType.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Your Needs */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Your Infrastructure Needs</h2>
                        <p className="text-sm text-muted-foreground mt-1">Tell us about your current setup and requirements</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentSetup">Current Hosting Setup *</Label>
                        <div className="relative">
                          <Textarea
                            id="currentSetup"
                            placeholder="Describe your current Minecraft setup - local worlds, existing hosting, self-hosted server, etc."
                            {...register("currentSetup")}
                            className={`min-h-[100px] resize-none ${errors.currentSetup ? "border-destructive" : isFieldValid("currentSetup") ? "border-primary/50" : ""}`}
                          />
                          {isFieldValid("currentSetup") && (
                            <Check className="absolute right-3 top-3 w-4 h-4 text-primary" />
                          )}
                        </div>
                        {errors.currentSetup && (
                          <p className="text-sm text-destructive">{errors.currentSetup.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="useCase">Content & Use Case *</Label>
                        <div className="relative">
                          <Textarea
                            id="useCase"
                            placeholder="What kind of Minecraft content do you create? What are your biggest pain points? What would reliable infrastructure enable you to do?"
                            {...register("useCase")}
                            className={`min-h-[140px] resize-none ${errors.useCase ? "border-destructive" : isFieldValid("useCase") ? "border-primary/50" : ""}`}
                          />
                          {isFieldValid("useCase") && (
                            <Check className="absolute right-3 top-3 w-4 h-4 text-primary" />
                          )}
                        </div>
                        {errors.useCase && (
                          <p className="text-sm text-destructive">{errors.useCase.message}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Budget Range</Label>
                          <Select value={budgetRange} onValueChange={(value) => setValue("budgetRange", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-50">Under $50/month</SelectItem>
                              <SelectItem value="50-100">$50 - $100/month</SelectItem>
                              <SelectItem value="100-200">$100 - $200/month</SelectItem>
                              <SelectItem value="200-plus">$200+/month</SelectItem>
                              <SelectItem value="not-sure">Not sure yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>When do you need this?</Label>
                          <Select value={timeline} onValueChange={(value) => setValue("timeline", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asap">As soon as possible</SelectItem>
                              <SelectItem value="1-2-weeks">Within 1-2 weeks</SelectItem>
                              <SelectItem value="1-month">Within a month</SelectItem>
                              <SelectItem value="exploring">Just exploring options</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referral">How did you hear about us?</Label>
                        <div className="relative">
                          <Input
                            id="referral"
                            placeholder="Friend, Twitter, YouTube, etc."
                            {...register("referral")}
                            className={getInputClassName("referral")}
                          />
                          {isFieldValid("referral") && (
                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          )}
                        </div>
                        {errors.referral && (
                          <p className="text-sm text-destructive">{errors.referral.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t border-border">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="submit"
                          variant="hero"
                          size="xl"
                          className="w-full sm:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting Application...
                            </>
                          ) : (
                            <>
                              Submit Application
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </Button>
                        {hasSavedData() && (
                          <Button
                            type="button"
                            variant="outline"
                            size="xl"
                            onClick={handleClearDraft}
                            disabled={isSubmitting}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Clear Draft
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        By submitting, you agree to our{" "}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        {" "}and{" "}
                        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                      </p>
                    </div>
                  </form>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Trust signals */}
                  <div className="p-6 rounded-2xl bg-card-gradient border border-border">
                    <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
                    <ol className="space-y-4 text-sm text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">1</span>
                        <span>We review your application within 48 hours</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">2</span>
                        <span>If approved, we schedule a quick onboarding call</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">3</span>
                        <span>We provision your managed world and help you migrate</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">4</span>
                        <span>You start creating with peace of mind</span>
                      </li>
                    </ol>
                  </div>

                  {/* Trust points */}
                  <div className="space-y-3">
                    {trustPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <point.icon className="w-4 h-4 text-primary shrink-0" />
                        {point.text}
                      </div>
                    ))}
                  </div>

                  {/* Questions */}
                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Have questions?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Not sure if Creator Ops is right for you? Check our FAQ or reach out directly.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/#faq">View FAQ</a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Application Submitted!
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for your interest in Creator Ops. We'll review your application and get back to you within 48 hours.
              </p>
              <div className="p-6 rounded-2xl bg-card-gradient border border-border mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-foreground mb-3">While you wait:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Check your email for a confirmation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Think about your world migration needs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Review our SLA and Fair Usage Policy
                  </li>
                </ul>
              </div>
              <Button variant="hero" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-auto">
          <div className="container px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Stratus Technology Group. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Apply;
