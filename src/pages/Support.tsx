import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, CheckCircle, ArrowRight,
} from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const supportSchema = z.object({
  subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(200),
  category: z.enum(["billing", "technical", "backup-restore", "account", "other"], {
    required_error: "Please select a category",
  }),
  priority: z.enum(["low", "normal", "high"], {
    required_error: "Please select a priority",
  }),
  description: z.string().trim().min(20, "Please provide at least 20 characters of detail").max(5000),
});

type SupportFormData = z.infer<typeof supportSchema>;

const Support = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const submitTicket = useAction(api.support.submitSupportTicket);

  const clerkUserId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const firstName = user?.firstName ?? undefined;
  const lastName = user?.lastName ?? undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      subject: "",
      category: undefined as unknown as SupportFormData["category"],
      priority: "normal",
      description: "",
    },
  });

  const category = watch("category");
  const priority = watch("priority");

  const onSubmit = async (data: SupportFormData) => {
    if (!email) {
      toast({
        title: "Missing email",
        description: "We can't find your email address. Try signing out and back in.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitTicket({
        clerkUserId,
        email,
        firstName,
        lastName,
        category: data.category,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
      });
      setSubmittedTicketId(String(result.ticketId));
    } catch {
      toast({
        title: "Something went wrong",
        description:
          "We couldn't submit your ticket. Please try again or email hi@creatorops.io directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmittedTicketId(null);
    reset({
      subject: "",
      category: undefined as unknown as SupportFormData["category"],
      priority: "normal",
      description: "",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        {!submittedTicketId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Get help from our team. We respond within 24 hours.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 p-6 rounded-xl border border-white/10 bg-card"
            >
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Short summary of the issue"
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={category}
                    onValueChange={(val) =>
                      setValue("category", val as SupportFormData["category"], { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical issue</SelectItem>
                      <SelectItem value="backup-restore">Backup or restore</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select
                    value={priority}
                    onValueChange={(val) =>
                      setValue("priority", val as SupportFormData["priority"], { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low — no rush</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High — server impacting</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-sm text-destructive">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={8}
                  placeholder="Walk us through what's happening — when it started, what you've tried, anything specific to your server."
                  {...register("description")}
                  className="resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {email && (
                <p className="text-xs text-muted-foreground">
                  We'll respond to <span className="text-foreground">{email}</span>.
                </p>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit ticket
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Get help from our team. We respond within 24 hours.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    Ticket received
                  </h2>
                  <p className="text-sm text-muted-foreground mb-1">
                    Thanks — we've logged your request and will respond within 24 hours.
                  </p>
                  {email && (
                    <p className="text-sm text-muted-foreground mb-4">
                      A confirmation email is on its way to{" "}
                      <span className="text-foreground">{email}</span>.
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-md bg-background/40 border border-white/10 text-xs font-mono text-emerald-400">
                    <span className="text-muted-foreground">Ticket ID</span>
                    <span>{submittedTicketId}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleSubmitAnother} variant="hero">
                      Submit another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Support;
