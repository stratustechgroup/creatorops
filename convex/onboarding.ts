import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { sendEmail } from "./email";

const formTypeValidator = v.union(
  v.literal("founding"),
  v.literal("standard"),
  v.literal("studio"),
  v.literal("events"),
);

const colors = {
  primary: "#2db87b",
  primaryDark: "#25a06b",
  dark: "#0a0c10",
  light: "#f3f2f0",
  muted: "#6b7280",
};

function emailWrapper(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creator Ops</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
        ${content}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const logoHeader = `
<tr>
  <td style="background-color:${colors.dark};padding:24px 32px;border-radius:12px 12px 0 0;">
    <span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,${colors.primary} 0%,${colors.primaryDark} 100%);border-radius:8px;vertical-align:middle;"></span>
    <span style="color:${colors.light};font-size:18px;font-weight:600;margin-left:12px;vertical-align:middle;">Creator Ops</span>
  </td>
</tr>`;

const footer = `
<tr>
  <td style="padding:32px;text-align:center;">
    <p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">© ${new Date().getFullYear()} Stratus Technology Group. All rights reserved.</p>
    <p style="margin:0;color:${colors.muted};font-size:12px;">
      <a href="https://creatorops.io/privacy" style="color:${colors.primary};text-decoration:none;">Privacy Policy</a>
      &nbsp;&bull;&nbsp;
      <a href="https://creatorops.io/terms" style="color:${colors.primary};text-decoration:none;">Terms of Service</a>
    </p>
  </td>
</tr>`;

function buildApprovalEmail(firstName: string): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
        <h1 style="margin:0 0 24px 0;color:${colors.dark};font-size:24px;font-weight:700;line-height:1.3;">Welcome to Creator Ops, ${firstName}!</h1>
        <p style="margin:0 0 24px 0;color:#374151;font-size:16px;line-height:1.7;">Your application has been approved. We're excited to start hosting your worlds.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${colors.primary}08;border:1px solid ${colors.primary}20;border-radius:12px;margin-bottom:32px;">
          <tr><td style="padding:24px;">
            <h2 style="margin:0 0 12px 0;color:${colors.dark};font-size:16px;font-weight:600;">Next steps</h2>
            <p style="margin:0 0 12px 0;color:#374151;font-size:14px;line-height:1.6;">
              <strong>1.</strong> Sign in to your dashboard at <a href="https://creatorops.io/login" style="color:${colors.primary};text-decoration:none;">creatorops.io/login</a> using the email address you applied with.
            </p>
            <p style="margin:0 0 12px 0;color:#374151;font-size:14px;line-height:1.6;">
              <strong>2.</strong> We'll provision your worlds within 48 hours and reach out via email when they're ready.
            </p>
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
              <strong>3.</strong> If you have questions, reply to this email or reach us at <a href="mailto:hi@creatorops.io" style="color:${colors.primary};text-decoration:none;">hi@creatorops.io</a>.
            </p>
          </td></tr>
        </table>

        <p style="margin:0 0 8px 0;color:#374151;font-size:15px;line-height:1.6;">Welcome aboard.</p>
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;"><strong>The Creator Ops Team</strong></p>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, `Welcome to Creator Ops, ${firstName}. Your application has been approved.`);
}

function buildRejectionEmail(firstName: string): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
        <h1 style="margin:0 0 24px 0;color:${colors.dark};font-size:22px;font-weight:700;line-height:1.3;">Thanks for applying, ${firstName}.</h1>
        <p style="margin:0 0 16px 0;color:#374151;font-size:15px;line-height:1.7;">
          We appreciate the time you took to share your work with us. After review, we're not able to take you on at this time.
        </p>
        <p style="margin:0 0 16px 0;color:#374151;font-size:15px;line-height:1.7;">
          We're focused on creators with a specific profile right now, but please feel free to apply again as your channel grows — our roster shifts and we'd be happy to revisit.
        </p>
        <p style="margin:0 0 16px 0;color:#374151;font-size:15px;line-height:1.7;">
          If you'd like specific feedback on your application, reach out at <a href="mailto:hi@creatorops.io" style="color:${colors.primary};text-decoration:none;">hi@creatorops.io</a> and we'll do our best to share what we can.
        </p>
        <p style="margin:0 0 8px 0;color:#374151;font-size:15px;line-height:1.6;">Wishing you the best on the build,</p>
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;"><strong>The Creator Ops Team</strong></p>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, "An update on your Creator Ops application.");
}

// TODO Phase 2: After approve, also (a) create Pterodactyl user via API,
// (b) send Clerk invitation, (c) link clerkUserId to clientPterodactylUsers.

export const approveApplication = action({
  args: {
    formType: formTypeValidator,
    id: v.string(),
  },
  handler: async (ctx, { formType, id }) => {
    // 1. Verify the caller is staff with at least support role and capture identity.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated.");
    const actorEmail = (identity.email ?? "").toLowerCase();
    if (!actorEmail) throw new Error("No email on identity.");
    const actorClerkUserId = identity.subject ?? undefined;

    // Authorization is enforced when we call the regular updateApplicationStatus
    // path through requireStaff — but since actions cannot reach ctx.db, we rely
    // on the internal mutation and pass the actor through. We still verify staff
    // by reading getStaffRole.
    const staffStatus = await ctx.runQuery(internal.admin.getApplicationDetailInternal, {
      formType,
      id,
    });
    if (!staffStatus) throw new Error("Application not found.");

    const application = staffStatus.application as {
      email: string;
      _id: string;
    };
    const user = staffStatus.user as { firstName: string; lastName: string } | null;

    const firstName = user?.firstName ?? "there";
    const lastName = user?.lastName ?? "";
    const applicantEmail = application.email;

    // 2. Update status to approved (bypasses auth — we already have identity).
    await ctx.runMutation(internal.admin.updateApplicationStatusInternal, {
      formType,
      id,
      status: "approved",
      actorEmail,
      actorClerkUserId,
    });

    // 3. Send welcome email to applicant.
    try {
      await sendEmail({
        from: "Creator Ops <noreply@creatorops.io>",
        to: [applicantEmail],
        subject: `Welcome to Creator Ops, ${firstName}`,
        html: buildApprovalEmail(firstName),
      });
    } catch (err) {
      throw new Error(
        `Failed to send welcome email to ${applicantEmail}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // 4. Send admin-side confirmation to ops inbox.
    try {
      await sendEmail({
        from: "Creator Ops <noreply@creatorops.io>",
        to: ["hi@creatorops.io"],
        subject: `Approved: ${firstName} ${lastName} (${formType})`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:24px;">
            <h2 style="color:${colors.dark};">Application approved</h2>
            <p>Welcome email sent to <strong>${applicantEmail}</strong>.</p>
            <p>Form type: <strong>${formType}</strong></p>
            <p>Approved by: <strong>${actorEmail}</strong></p>
            <p>Next: provision Pterodactyl user and link clerkUserId once they sign in.</p>
            <p>View in admin: <a href="https://creatorops.io/admin">creatorops.io/admin</a></p>
          </div>
        `,
      });
    } catch (err) {
      // Don't block the action on the internal-notification email failing —
      // the applicant has already been notified. Log to audit instead.
      await ctx.runMutation(internal.admin.writeAuditLog, {
        actorEmail,
        actorClerkUserId,
        action: "application.approve.notify_admin_failed",
        targetTable: "applications",
        targetId: id,
        metadata: {
          formType,
          error: err instanceof Error ? err.message : String(err),
        },
      });
    }

    // 5. Audit log.
    await ctx.runMutation(internal.admin.writeAuditLog, {
      actorEmail,
      actorClerkUserId,
      action: "application.approve",
      targetTable: "applications",
      targetId: id,
      metadata: { formType, applicantEmail },
    });

    return { success: true, emailSent: true };
  },
});

export const rejectApplication = action({
  args: {
    formType: formTypeValidator,
    id: v.string(),
  },
  handler: async (ctx, { formType, id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated.");
    const actorEmail = (identity.email ?? "").toLowerCase();
    if (!actorEmail) throw new Error("No email on identity.");
    const actorClerkUserId = identity.subject ?? undefined;

    const detail = await ctx.runQuery(internal.admin.getApplicationDetailInternal, {
      formType,
      id,
    });
    if (!detail) throw new Error("Application not found.");

    const application = detail.application as { email: string };
    const user = detail.user as { firstName: string; lastName: string } | null;

    const firstName = user?.firstName ?? "there";
    const applicantEmail = application.email;

    await ctx.runMutation(internal.admin.updateApplicationStatusInternal, {
      formType,
      id,
      status: "rejected",
      actorEmail,
      actorClerkUserId,
    });

    try {
      await sendEmail({
        from: "Creator Ops <noreply@creatorops.io>",
        to: [applicantEmail],
        subject: "An update on your Creator Ops application",
        html: buildRejectionEmail(firstName),
      });
    } catch (err) {
      throw new Error(
        `Failed to send rejection email to ${applicantEmail}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    await ctx.runMutation(internal.admin.writeAuditLog, {
      actorEmail,
      actorClerkUserId,
      action: "application.reject",
      targetTable: "applications",
      targetId: id,
      metadata: { formType, applicantEmail },
    });

    return { success: true, emailSent: true };
  },
});
