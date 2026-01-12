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
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Shield, Clock, Users, RotateCcw, Save, Check, Sparkles, Star, MessageSquare, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/landing/Logo";
import { PageTransition } from "@/components/PageTransition";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFormAutosave } from "@/hooks/useFormAutosave";

const foundingApplicationSchema = z.object({
  // About You
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  discordUsername: z.string().trim().min(1, "Discord username is required for founder communication").max(32, "Discord username must be less than 32 characters"),
  timezone: z.string().min(1, "Please select your timezone"),
  
  // Your Content
  channelUrl: z.string().trim().url("Please enter a valid URL").max(500, "URL must be less than 500 characters"),
  contentDescription: z.string().trim().min(50, "Please provide more detail about your content (at least 50 characters)").max(2000, "Must be less than 2000 characters"),
  audienceSize: z.string().min(1, "Please select your audience size"),
  uploadFrequency: z.string().min(1, "Please select your upload frequency"),
  
  // Your World & Needs
  worldDescription: z.string().trim().min(30, "Please describe your world in more detail").max(1500, "Must be less than 1500 characters"),
  currentPainPoints: z.string().trim().min(30, "Please describe your current challenges").max(1500, "Must be less than 1500 characters"),
  collaborators: z.string().min(1, "Please select how many collaborators"),
  
  // Partnership Fit
  whyFounder: z.string().trim().min(50, "Please tell us more about why you want to be a founding creator").max(2000, "Must be less than 2000 characters"),
  feedbackStyle: z.string().min(1, "Please select your preferred feedback style"),
  availabilityCall: z.string().min(1, "Please select your availability"),
  
  // Agreements
  agreeCommitment: z.boolean().refine(val => val === true, "You must agree to the 3-month minimum commitment"),
  agreeFeedback: z.boolean().refine(val => val === true, "You must agree to provide feedback"),
  agreeTestimonial: z.boolean(),
  
  // Optional
  referral: z.string().trim().max(200, "Must be less than 200 characters").optional().or(z.literal("")),
  additionalNotes: z.string().trim().max(1000, "Must be less than 1000 characters").optional().or(z.literal("")),
});

type FoundingApplicationFormData = z.infer<typeof foundingApplicationSchema>;

const founderBenefits = [
  { icon: Star, text: "Locked-in pricing forever" },
  { icon: Heart, text: "White-glove priority support" },
  { icon: MessageSquare, text: "Direct product influence" },
];

const STORAGE_KEY = "creatorops_founding_application_draft";

const defaultFormValues: FoundingApplicationFormData = {
  firstName: "",
  lastName: "",
  email: "",
  discordUsername: "",
  timezone: "",
  channelUrl: "",
  contentDescription: "",
  audienceSize: "",
  uploadFrequency: "",
  worldDescription: "",
  currentPainPoints: "",
  collaborators: "",
  whyFounder: "",
  feedbackStyle: "",
  availabilityCall: "",
  agreeCommitment: false,
  agreeFeedback: false,
  agreeTestimonial: false,
  referral: "",
  additionalNotes: "",
};

const worldQuestions = [
  "How large is your world (file size/chunks)?",
  "What mods or plugins do you use?",
  "How many people typically access it?",
  "Is it a long-running series or project-based?",
  "Do you have multiple worlds or just one main world?",
];

const painPointQuestions = [
  "Have you ever lost world data or progress?",
  "Do you experience lag or performance issues?",
  "How do you currently handle backups?",
  "Have recording sessions been interrupted by server issues?",
  "Is coordinating with collaborators difficult?",
];

const FoundingApply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeHelper, setActiveHelper] = useState<"world" | "painPoints" | null>(null);
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();

  const memoizedDefaults = useMemo(() => defaultFormValues, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<FoundingApplicationFormData>({
    resolver: zodResolver(foundingApplicationSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const { clearSavedData, hasSavedData, lastSavedAt } = useFormAutosave({
    watch,
    reset,
    storageKey: STORAGE_KEY,
    defaultValues: memoizedDefaults,
  });

  const handleClearDraft = () => {
    clearSavedData();
    reset(defaultFormValues);
    trackEvent("form_clear_draft", { form_name: "founding_application" });
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

  // Watch values for controlled components
  const timezone = watch("timezone");
  const audienceSize = watch("audienceSize");
  const uploadFrequency = watch("uploadFrequency");
  const collaborators = watch("collaborators");
  const feedbackStyle = watch("feedbackStyle");
  const availabilityCall = watch("availabilityCall");
  const agreeCommitment = watch("agreeCommitment");
  const agreeFeedback = watch("agreeFeedback");
  const agreeTestimonial = watch("agreeTestimonial");

  const isFieldValid = (fieldName: keyof FoundingApplicationFormData) => {
    const value = watch(fieldName);
    const hasValue = value && value.toString().trim().length > 0;
    const hasNoError = !errors[fieldName];
    const wasTouched = touchedFields[fieldName] || dirtyFields[fieldName];
    return hasValue && hasNoError && wasTouched;
  };

  const getInputClassName = (fieldName: keyof FoundingApplicationFormData, baseClass = "") => {
    if (errors[fieldName]) return `${baseClass} border-destructive pr-10`;
    if (isFieldValid(fieldName)) return `${baseClass} border-primary/50 pr-10`;
    return baseClass;
  };

  const onSubmit = async (data: FoundingApplicationFormData) => {
    setIsSubmitting(true);

    trackEvent("form_submit", {
      form_name: "founding_application",
      audience_size: data.audienceSize,
      has_channel: !!data.channelUrl,
      feedback_style: data.feedbackStyle,
    });

    try {
      const { data: response, error } = await supabase.functions.invoke("send-application-email", {
        body: {
          formType: "founding",
          formData: data,
        },
      });

      if (error) {
        throw error;
      }

      clearSavedData();
      setIsSubmitted(true);

      trackEvent("form_success", {
        form_name: "founding_application",
      });
    } catch (error) {
      console.error("Error submitting founding application:", error);
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
                <Link to="/founding-creators">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Program
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
                  <Sparkles className="w-4 h-4" />
                  Only 7 Spots Remaining
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Apply for Founding Creator Access
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  This application is for our exclusive Founding Creator Program. 
                  We review each application carefully to find the right partners.
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
                        <p className="text-sm text-muted-foreground mt-1">Let us know who you are</p>
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
                          <Label htmlFor="discordUsername">Discord Username *</Label>
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
                          <p className="text-xs text-muted-foreground">Required for founder community access</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Your Timezone *</Label>
                        <Select value={timezone} onValueChange={(value) => setValue("timezone", value, { shouldDirty: true })}>
                          <SelectTrigger className={errors.timezone ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select your timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                            <SelectItem value="mst">Mountain Time (MST/MDT)</SelectItem>
                            <SelectItem value="cst">Central Time (CST/CDT)</SelectItem>
                            <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                            <SelectItem value="gmt">GMT / UTC</SelectItem>
                            <SelectItem value="cet">Central European Time (CET)</SelectItem>
                            <SelectItem value="aest">Australian Eastern Time (AEST)</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.timezone && (
                          <p className="text-sm text-destructive">{errors.timezone.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Helps us schedule calls at convenient times</p>
                      </div>
                    </div>

                    {/* Section 2: Your Content */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Your Content</h2>
                        <p className="text-sm text-muted-foreground mt-1">Tell us about what you create</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="channelUrl">Primary Channel URL *</Label>
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contentDescription">Describe Your Content *</Label>
                        <div className="relative">
                          <Textarea
                            id="contentDescription"
                            placeholder="What kind of Minecraft content do you create? What makes your content unique? What series or projects are you known for?"
                            {...register("contentDescription")}
                            className={`min-h-[120px] resize-none ${errors.contentDescription ? "border-destructive" : isFieldValid("contentDescription") ? "border-primary/50" : ""}`}
                          />
                          {isFieldValid("contentDescription") && (
                            <Check className="absolute right-3 top-3 w-4 h-4 text-primary" />
                          )}
                        </div>
                        {errors.contentDescription && (
                          <p className="text-sm text-destructive">{errors.contentDescription.message}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Audience Size *</Label>
                          <Select value={audienceSize} onValueChange={(value) => setValue("audienceSize", value, { shouldDirty: true })}>
                            <SelectTrigger className={errors.audienceSize ? "border-destructive" : ""}>
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-10k">Under 10,000</SelectItem>
                              <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
                              <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                              <SelectItem value="100k-500k">100,000 - 500,000</SelectItem>
                              <SelectItem value="500k-1m">500,000 - 1 Million</SelectItem>
                              <SelectItem value="1m-plus">1 Million+</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.audienceSize && (
                            <p className="text-sm text-destructive">{errors.audienceSize.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Upload Frequency *</Label>
                          <Select value={uploadFrequency} onValueChange={(value) => setValue("uploadFrequency", value, { shouldDirty: true })}>
                            <SelectTrigger className={errors.uploadFrequency ? "border-destructive" : ""}>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="several-week">Several times per week</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="irregular">Irregular / Project-based</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.uploadFrequency && (
                            <p className="text-sm text-destructive">{errors.uploadFrequency.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Your World & Needs */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Your World & Needs</h2>
                        <p className="text-sm text-muted-foreground mt-1">Help us understand your infrastructure requirements</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="worldDescription">Describe Your World *</Label>
                        <div className="relative">
                          <Textarea
                            id="worldDescription"
                            placeholder="Tell us about your Minecraft world..."
                            {...register("worldDescription")}
                            onFocus={() => setActiveHelper("world")}
                            onBlur={() => setActiveHelper(null)}
                            className={`min-h-[120px] resize-none ${errors.worldDescription ? "border-destructive" : isFieldValid("worldDescription") ? "border-primary/50" : ""}`}
                          />
                          {isFieldValid("worldDescription") && (
                            <Check className="absolute right-3 top-3 w-4 h-4 text-primary" />
                          )}
                          {activeHelper === "world" && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="hidden lg:block absolute left-full ml-4 top-0 w-64 p-4 rounded-xl bg-muted/50 border border-border"
                            >
                              <h4 className="text-sm font-medium text-foreground mb-2">Questions to consider:</h4>
                              <ul className="space-y-2 text-xs text-muted-foreground">
                                {worldQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                        {errors.worldDescription && (
                          <p className="text-sm text-destructive">{errors.worldDescription.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentPainPoints">Current Pain Points *</Label>
                        <div className="relative">
                          <Textarea
                            id="currentPainPoints"
                            placeholder="What problems have you experienced with your current setup?"
                            {...register("currentPainPoints")}
                            onFocus={() => setActiveHelper("painPoints")}
                            onBlur={() => setActiveHelper(null)}
                            className={`min-h-[120px] resize-none ${errors.currentPainPoints ? "border-destructive" : isFieldValid("currentPainPoints") ? "border-primary/50" : ""}`}
                          />
                          {isFieldValid("currentPainPoints") && (
                            <Check className="absolute right-3 top-3 w-4 h-4 text-primary" />
                          )}
                          {activeHelper === "painPoints" && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="hidden lg:block absolute left-full ml-4 top-0 w-64 p-4 rounded-xl bg-muted/50 border border-border"
                            >
                              <h4 className="text-sm font-medium text-foreground mb-2">Questions to consider:</h4>
                              <ul className="space-y-2 text-xs text-muted-foreground">
                                {painPointQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                        {errors.currentPainPoints && (
                          <p className="text-sm text-destructive">{errors.currentPainPoints.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Collaborators *</Label>
                        <Select value={collaborators} onValueChange={(value) => setValue("collaborators", value, { shouldDirty: true })}>
                          <SelectTrigger className={errors.collaborators ? "border-destructive" : ""}>
                            <SelectValue placeholder="How many people access your world?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solo">Just me</SelectItem>
                            <SelectItem value="2-5">2-5 people</SelectItem>
                            <SelectItem value="6-10">6-10 people</SelectItem>
                            <SelectItem value="11-20">11-20 people</SelectItem>
                            <SelectItem value="20-plus">20+ people</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.collaborators && (
                          <p className="text-sm text-destructive">{errors.collaborators.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Section 4: Partnership Fit */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Partnership Fit</h2>
                        <p className="text-sm text-muted-foreground mt-1">Help us understand if we are a good match</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whyFounder">Why do you want to be a Founding Creator? *</Label>
                        <div className="relative">
                          <Textarea
                            id="whyFounder"
                            placeholder="What excites you about being a founding member? What would you hope to gain from the program? How would you like to contribute to shaping the product?"
                            {...register("whyFounder")}
                            className={`min-h-[140px] resize-none ${errors.whyFounder ? "border-destructive" : isFieldValid("whyFounder") ? "border-primary/50" : ""}`}
                          />
                          {isFieldValid("whyFounder") && (
                            <Check className="absolute right-3 top-3 w-4 h-4 text-primary" />
                          )}
                        </div>
                        {errors.whyFounder && (
                          <p className="text-sm text-destructive">{errors.whyFounder.message}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preferred Feedback Style *</Label>
                          <Select value={feedbackStyle} onValueChange={(value) => setValue("feedbackStyle", value, { shouldDirty: true })}>
                            <SelectTrigger className={errors.feedbackStyle ? "border-destructive" : ""}>
                              <SelectValue placeholder="How do you prefer to give feedback?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="async">Async (Discord, email)</SelectItem>
                              <SelectItem value="calls">Video calls</SelectItem>
                              <SelectItem value="both">Both work for me</SelectItem>
                              <SelectItem value="written">Written surveys/forms</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.feedbackStyle && (
                            <p className="text-sm text-destructive">{errors.feedbackStyle.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Onboarding Preference *</Label>
                          <Select value={availabilityCall} onValueChange={(value) => setValue("availabilityCall", value, { shouldDirty: true })}>
                            <SelectTrigger className={errors.availabilityCall ? "border-destructive" : ""}>
                              <SelectValue placeholder="How would you like to onboard?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="call-this-week">Voice/video call - this week</SelectItem>
                              <SelectItem value="call-next-week">Voice/video call - next week</SelectItem>
                              <SelectItem value="call-2-weeks">Voice/video call - within 2 weeks</SelectItem>
                              <SelectItem value="chat-only">Chat only (Discord/email)</SelectItem>
                              <SelectItem value="flexible">Either works - I'm flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.availabilityCall && (
                            <p className="text-sm text-destructive">{errors.availabilityCall.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Agreements */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Program Agreements</h2>
                        <p className="text-sm text-muted-foreground mt-1">Please confirm you understand the program expectations</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="agreeCommitment" 
                            checked={agreeCommitment}
                            onCheckedChange={(checked) => setValue("agreeCommitment", checked as boolean, { shouldDirty: true })}
                            className={errors.agreeCommitment ? "border-destructive" : ""}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="agreeCommitment" className="font-normal cursor-pointer">
                              I understand and agree to the 3-month minimum commitment *
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              After 3 months, you can continue month-to-month at your locked-in rate
                            </p>
                          </div>
                        </div>
                        {errors.agreeCommitment && (
                          <p className="text-sm text-destructive ml-6">{errors.agreeCommitment.message}</p>
                        )}

                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="agreeFeedback" 
                            checked={agreeFeedback}
                            onCheckedChange={(checked) => setValue("agreeFeedback", checked as boolean, { shouldDirty: true })}
                            className={errors.agreeFeedback ? "border-destructive" : ""}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="agreeFeedback" className="font-normal cursor-pointer">
                              I agree to provide honest feedback and participate in monthly check-ins *
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Quick monthly conversations to help us improve the product
                            </p>
                          </div>
                        </div>
                        {errors.agreeFeedback && (
                          <p className="text-sm text-destructive ml-6">{errors.agreeFeedback.message}</p>
                        )}

                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="agreeTestimonial" 
                            checked={agreeTestimonial}
                            onCheckedChange={(checked) => setValue("agreeTestimonial", checked as boolean, { shouldDirty: true })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="agreeTestimonial" className="font-normal cursor-pointer">
                              I am open to providing a testimonial or case study (optional)
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Help other creators learn about the program - completely optional
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Optional */}
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>
                        <p className="text-sm text-muted-foreground mt-1">Anything else you would like us to know</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referral">How did you hear about the Founding Program?</Label>
                        <Input
                          id="referral"
                          placeholder="Friend, Twitter, YouTube, etc."
                          {...register("referral")}
                          className={getInputClassName("referral")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Anything else?</Label>
                        <Textarea
                          id="additionalNotes"
                          placeholder="Any other information you'd like to share, questions you have, or special circumstances we should know about."
                          {...register("additionalNotes")}
                          className="min-h-[100px] resize-none"
                        />
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
                              Submit Founding Application
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
                  {/* Founder benefits */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Founding Creator Benefits
                    </h3>
                    <div className="space-y-3">
                      {founderBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <benefit.icon className="w-4 h-4 text-primary shrink-0" />
                          {benefit.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="p-6 rounded-2xl bg-card-gradient border border-border">
                    <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
                    <ol className="space-y-4 text-sm text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">1</span>
                        <span>We review your application within 48 hours</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">2</span>
                        <span>Schedule a 30-minute discovery call</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">3</span>
                        <span>Discuss your needs and confirm the fit</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">4</span>
                        <span>Welcome to the founding community!</span>
                      </li>
                    </ol>
                  </div>

                  {/* Trust points */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      Your data is secure and never shared
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      Response within 48 hours
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      Join an exclusive community
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Have questions?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn more about the program benefits and expectations.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/founding-creators">View Program Details</Link>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                <Sparkles className="w-4 h-4" />
                Founding Creator Application
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Application Submitted!
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for applying to the Founding Creator Program. We are excited to review your application and will be in touch within 48 hours.
              </p>
              <div className="p-6 rounded-2xl bg-card-gradient border border-border mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-foreground mb-3">What to expect:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Confirmation email within a few minutes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Personal review by our team
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Discovery call invitation if accepted
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
              Copyright {new Date().getFullYear()} © Stratus Technology Group
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default FoundingApply;