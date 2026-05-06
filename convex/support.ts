import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { sendEmail } from "./email";

const colors = {
  primary: "#2db87b",
  dark: "#0a0c10",
  light: "#f3f2f0",
  muted: "#6b7280",
};

export const storeSupportTicket = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("supportTickets", {
      ...args,
      status: "open",
      submittedAt: Date.now(),
    });
  },
});

export const submitSupportTicket = action({
  args: {
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
  },
  handler: async (ctx, args) => {
    const ticketId = await ctx.runMutation(internal.support.storeSupportTicket, args);

    const fullName = [args.firstName, args.lastName].filter(Boolean).join(" ") || args.email;

    const internalHtml = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:24px;">
        <h2 style="color:${colors.dark};">New support ticket</h2>
        <p><strong>From:</strong> ${fullName} (${args.email})</p>
        <p><strong>Category:</strong> ${args.category}</p>
        <p><strong>Priority:</strong> ${args.priority}</p>
        <p><strong>Subject:</strong> ${args.subject}</p>
        <hr />
        <p style="white-space:pre-wrap;">${args.description}</p>
        <hr />
        <p style="color:${colors.muted};font-size:12px;">Ticket ID: ${ticketId}</p>
      </div>
    `;

    await sendEmail({
      from: "Creator Ops Support <noreply@creatorops.io>",
      to: ["hi@creatorops.io"],
      subject: `[Support — ${args.priority}] ${args.subject}`,
      html: internalHtml,
    });

    const confirmationHtml = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:24px;">
        <h2 style="color:${colors.dark};">We received your support request</h2>
        <p>Hi ${args.firstName || "there"},</p>
        <p>Thanks for reaching out. We've logged your ticket and will respond within 24 hours.</p>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0;"><strong>Subject:</strong> ${args.subject}</p>
          <p style="margin:8px 0 0;"><strong>Priority:</strong> ${args.priority}</p>
        </div>
        <p>If you have anything to add, just reply to this email.</p>
        <p>— The Creator Ops Team</p>
      </div>
    `;

    await sendEmail({
      from: "Creator Ops Support <noreply@creatorops.io>",
      to: [args.email],
      subject: `We received your support request: ${args.subject}`,
      html: confirmationHtml,
    });

    return { success: true, ticketId };
  },
});
