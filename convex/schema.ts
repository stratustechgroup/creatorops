import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const submissionStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("needs_info"),
);

export default defineSchema({
  clientPterodactylUsers: defineTable({
    clerkUserId: v.string(),
    pterodactylUserId: v.number(),
  }).index("by_clerk_user", ["clerkUserId"]),

  // Legacy table — preserved for historical submissions. Do not write to it.
  // New submissions go to users + the form-specific tables below.
  applications: defineTable({
    formType: v.union(
      v.literal("standard"),
      v.literal("founding"),
      v.literal("studio"),
      v.literal("events"),
    ),
    formData: v.any(),
    submittedAt: v.number(),
    status: submissionStatus,
  })
    .index("by_status", ["status"])
    .index("by_form_type", ["formType"])
    .index("by_submitted_at", ["submittedAt"]),

  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    firstSubmittedAt: v.number(),
  }).index("by_email", ["email"]),

  foundingApplications: defineTable({
    userId: v.id("users"),
    email: v.string(),
    discordUsername: v.string(),
    timezone: v.string(),
    channelUrl: v.string(),
    audienceSize: v.string(),
    uploadFrequency: v.string(),
    contentDescription: v.string(),
    worldDescription: v.string(),
    currentPainPoints: v.string(),
    collaborators: v.string(),
    whyFounder: v.string(),
    feedbackStyle: v.string(),
    availabilityCall: v.string(),
    agreeCommitment: v.boolean(),
    agreeFeedback: v.boolean(),
    agreeTestimonial: v.optional(v.boolean()),
    referral: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),
    submittedAt: v.number(),
    status: submissionStatus,
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]),

  standardApplications: defineTable({
    userId: v.id("users"),
    email: v.string(),
    discordUsername: v.optional(v.string()),
    preferredContact: v.optional(v.string()),
    channelUrl: v.optional(v.string()),
    subscriberCount: v.optional(v.string()),
    creatorType: v.string(),
    currentSetup: v.string(),
    useCase: v.string(),
    budgetRange: v.optional(v.string()),
    timeline: v.optional(v.string()),
    referral: v.optional(v.string()),
    submittedAt: v.number(),
    status: submissionStatus,
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]),

  studioInquiries: defineTable({
    userId: v.id("users"),
    email: v.string(),
    operationType: v.string(),
    peakPlayers: v.string(),
    currentPainPoint: v.string(),
    timeline: v.string(),
    tellUsMore: v.optional(v.string()),
    submittedAt: v.number(),
    status: submissionStatus,
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]),

  eventsQuotes: defineTable({
    userId: v.id("users"),
    email: v.string(),
    eventType: v.string(),
    concurrentPlayers: v.string(),
    duration: v.string(),
    worldSetup: v.string(),
    targetDate: v.string(),
    quotePath: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D"),
    ),
    submittedAt: v.number(),
    status: submissionStatus,
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_quote_path", ["quotePath"])
    .index("by_submitted_at", ["submittedAt"]),

  supportTickets: defineTable({
    clerkUserId: v.optional(v.string()),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    category: v.union(
      v.literal("billing"),
      v.literal("technical"),
      v.literal("backup-restore"),
      v.literal("account"),
      v.literal("other"),
    ),
    subject: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high")),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed"),
    ),
    submittedAt: v.number(),
  })
    .index("by_clerk_user", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]),

  staffMembers: defineTable({
    email: v.string(),
    clerkUserId: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("support"),
      v.literal("viewer"),
    ),
    addedByEmail: v.string(),
    addedAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_clerk_user", ["clerkUserId"])
    .index("by_role", ["role"]),

  appConfig: defineTable({
    key: v.string(),
    value: v.any(),
    updatedByEmail: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  adminAuditLog: defineTable({
    actorEmail: v.string(),
    actorClerkUserId: v.optional(v.string()),
    action: v.string(),
    targetTable: v.optional(v.string()),
    targetId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_actor", ["actorEmail"])
    .index("by_action", ["action"])
    .index("by_created_at", ["createdAt"]),

  // In-app notifications. One row per (recipient, event). Admin events are
  // fanned out at insert time so each admin gets their own row + read state.
  notifications: defineTable({
    recipientClerkUserId: v.string(),
    type: v.string(),
    severity: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("urgent"),
    ),
    title: v.string(),
    body: v.optional(v.string()),
    link: v.optional(v.string()),
    metadata: v.optional(v.any()),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_recipient", ["recipientClerkUserId", "createdAt"])
    .index("by_recipient_unread", ["recipientClerkUserId", "readAt"]),
});
