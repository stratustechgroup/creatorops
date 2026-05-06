import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

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
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');</style>
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

function buildFoundingInternalEmail(formData: Record<string, unknown>): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
        <span style="display:inline-block;background-color:${colors.primary}15;color:${colors.primary};font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:24px;">Founding Creator Application</span>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Applicant Information</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Name</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.firstName} ${formData.lastName}</span>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Email</span><br>
                <a href="mailto:${formData.email}" style="color:${colors.primary};font-size:15px;font-weight:500;text-decoration:none;">${formData.email}</a>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Discord</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.discordUsername}</span>
              </td></tr>
              <tr><td style="padding:8px 0;">
                <span style="color:${colors.muted};font-size:13px;">Timezone</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.timezone}</span>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Content Details</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">Channel URL</p>
            <a href="${formData.channelUrl}" style="color:${colors.primary};font-size:14px;text-decoration:none;word-break:break-all;">${formData.channelUrl}</a>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;">
              <tr>
                <td width="50%" style="padding-right:8px;">
                  <span style="color:${colors.muted};font-size:13px;">Audience Size</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.audienceSize}</span>
                </td>
                <td width="50%" style="padding-left:8px;">
                  <span style="color:${colors.muted};font-size:13px;">Upload Frequency</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.uploadFrequency}</span>
                </td>
              </tr>
            </table>
            <p style="margin:16px 0 8px 0;color:${colors.muted};font-size:13px;">Content Description</p>
            <p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.contentDescription}</p>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">World &amp; Infrastructure</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">World Description</p>
            <p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.worldDescription}</p>
            <p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">Current Pain Points</p>
            <p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.currentPainPoints}</p>
            <p style="margin:0 0 4px 0;color:${colors.muted};font-size:13px;">Collaborators</p>
            <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.collaborators}</span>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Partnership Fit</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">Why Founding Creator?</p>
            <p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.whyFounder}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td width="50%" style="padding-right:8px;">
                  <span style="color:${colors.muted};font-size:13px;">Feedback Style</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.feedbackStyle}</span>
                </td>
                <td width="50%" style="padding-left:8px;">
                  <span style="color:${colors.muted};font-size:13px;">Call Availability</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.availabilityCall}</span>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Agreements</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
          <tr><td style="padding:8px 0;">
            <span style="display:inline-block;width:20px;height:20px;background-color:${formData.agreeCommitment ? colors.primary : '#e5e7eb'};border-radius:4px;text-align:center;line-height:20px;color:white;font-size:12px;vertical-align:middle;">${formData.agreeCommitment ? '✓' : ''}</span>
            <span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">3-Month Commitment</span>
          </td></tr>
          <tr><td style="padding:8px 0;">
            <span style="display:inline-block;width:20px;height:20px;background-color:${formData.agreeFeedback ? colors.primary : '#e5e7eb'};border-radius:4px;text-align:center;line-height:20px;color:white;font-size:12px;vertical-align:middle;">${formData.agreeFeedback ? '✓' : ''}</span>
            <span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Feedback Agreement</span>
          </td></tr>
          ${formData.agreeTestimonial !== undefined ? `
          <tr><td style="padding:8px 0;">
            <span style="display:inline-block;width:20px;height:20px;background-color:${formData.agreeTestimonial ? colors.primary : '#e5e7eb'};border-radius:4px;text-align:center;line-height:20px;color:white;font-size:12px;vertical-align:middle;">${formData.agreeTestimonial ? '✓' : ''}</span>
            <span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Testimonial Agreement (Optional)</span>
          </td></tr>` : ''}
        </table>

        ${formData.referral ? `<p style="margin:0 0 4px 0;color:${colors.muted};font-size:13px;">Referral Source</p><p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;">${formData.referral}</p>` : ''}
        ${formData.additionalNotes ? `<p style="margin:0 0 4px 0;color:${colors.muted};font-size:13px;">Additional Notes</p><p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.additionalNotes}</p>` : ''}

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px;">
          <tr><td><p style="margin:0;color:${colors.muted};font-size:12px;">Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p></td></tr>
        </table>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, `New founding creator application from ${formData.firstName} ${formData.lastName}`);
}

function buildStandardInternalEmail(formData: Record<string, unknown>): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
        <span style="display:inline-block;background-color:#f3f4f6;color:${colors.muted};font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:24px;">Standard Application</span>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Applicant Information</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Name</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.firstName} ${formData.lastName}</span>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Email</span><br>
                <a href="mailto:${formData.email}" style="color:${colors.primary};font-size:15px;font-weight:500;text-decoration:none;">${formData.email}</a>
              </td></tr>
              ${formData.discordUsername ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Discord</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.discordUsername}</span>
              </td></tr>` : ''}
              ${formData.preferredContact ? `<tr><td style="padding:8px 0;">
                <span style="color:${colors.muted};font-size:13px;">Preferred Contact</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.preferredContact}</span>
              </td></tr>` : ''}
            </table>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Channel Details</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            ${formData.channelUrl ? `<p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">Channel URL</p><a href="${formData.channelUrl}" style="color:${colors.primary};font-size:14px;text-decoration:none;word-break:break-all;">${formData.channelUrl}</a>` : ''}
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;">
              <tr>
                ${formData.subscriberCount ? `<td width="50%" style="padding-right:8px;"><span style="color:${colors.muted};font-size:13px;">Subscriber Count</span><br><span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.subscriberCount}</span></td>` : ''}
                <td width="50%" style="padding-left:8px;"><span style="color:${colors.muted};font-size:13px;">Creator Type</span><br><span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.creatorType}</span></td>
              </tr>
            </table>
            <p style="margin:16px 0 8px 0;color:${colors.muted};font-size:13px;">Current Setup</p>
            <p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.currentSetup}</p>
            <p style="margin:0 0 8px 0;color:${colors.muted};font-size:13px;">Use Case &amp; Needs</p>
            <p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.useCase}</p>
          </td></tr>
        </table>

        ${formData.budgetRange || formData.timeline ? `
        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Project Details</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
              ${formData.budgetRange ? `<td width="50%" style="padding-right:8px;"><span style="color:${colors.muted};font-size:13px;">Budget Range</span><br><span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.budgetRange}</span></td>` : ''}
              ${formData.timeline ? `<td width="50%" style="padding-left:8px;"><span style="color:${colors.muted};font-size:13px;">Timeline</span><br><span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.timeline}</span></td>` : ''}
            </tr></table>
          </td></tr>
        </table>` : ''}

        ${formData.referral ? `<p style="margin:0 0 4px 0;color:${colors.muted};font-size:13px;">Referral Source</p><p style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;">${formData.referral}</p>` : ''}

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px;">
          <tr><td><p style="margin:0;color:${colors.muted};font-size:12px;">Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p></td></tr>
        </table>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, `New creator application from ${formData.firstName} ${formData.lastName}`);
}

function buildFoundingConfirmationEmail(firstName: string): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
        <h1 style="margin:0 0 24px 0;color:${colors.dark};font-size:24px;font-weight:700;line-height:1.3;">Thanks for applying, ${firstName}!</h1>
        <p style="margin:0 0 24px 0;color:#374151;font-size:16px;line-height:1.7;">We're excited to review your application for the <strong>Founding Creator Program</strong>. You're taking the first step toward joining an exclusive group of creators shaping the future of Minecraft content infrastructure.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${colors.primary}08;border:1px solid ${colors.primary}20;border-radius:12px;margin-bottom:32px;">
          <tr><td style="padding:24px;">
            <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:16px;font-weight:600;">What happens next?</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">1</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Application Review</strong><br><span style="color:${colors.muted};">Our team will personally review your application within 48 hours</span></p></td>
              </tr></table></td></tr>
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">2</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Discovery Call</strong><br><span style="color:${colors.muted};">If selected, we'll reach out via Discord to schedule your onboarding call</span></p></td>
              </tr></table></td></tr>
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">3</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Welcome to the Community</strong><br><span style="color:${colors.muted};">Get exclusive access to our Founding Creator community and benefits</span></p></td>
              </tr></table></td></tr>
            </table>
          </td></tr>
        </table>

        <h3 style="margin:0 0 16px 0;color:${colors.dark};font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Founding Creator Benefits</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:32px;">
          <tr><td style="padding:8px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Locked-in pricing forever</span></td></tr>
          <tr><td style="padding:8px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">White-glove priority support</span></td></tr>
          <tr><td style="padding:8px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Direct product influence</span></td></tr>
          <tr><td style="padding:8px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Early access to new features</span></td></tr>
        </table>

        <p style="margin:0 0 8px 0;color:#374151;font-size:15px;line-height:1.6;">We're excited to potentially have you on this journey with us.</p>
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;"><strong>The Creator Ops Team</strong></p>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, "Thanks for applying to the Founding Creator Program. We'll review your application within 48 hours.");
}

function buildStandardConfirmationEmail(firstName: string): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
        <h1 style="margin:0 0 24px 0;color:${colors.dark};font-size:24px;font-weight:700;line-height:1.3;">Thanks for applying, ${firstName}!</h1>
        <p style="margin:0 0 24px 0;color:#374151;font-size:16px;line-height:1.7;">We've received your application and are excited to learn more about your Minecraft content creation journey.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:32px;">
          <tr><td style="padding:24px;">
            <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:16px;font-weight:600;">What happens next?</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">1</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Application Review</strong><br><span style="color:${colors.muted};">Our team will review your application within 48 hours</span></p></td>
              </tr></table></td></tr>
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">2</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Next Steps</strong><br><span style="color:${colors.muted};">We'll reach out via your preferred contact method</span></p></td>
              </tr></table></td></tr>
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">3</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Discussion</strong><br><span style="color:${colors.muted};">If we're a good fit, we'll discuss how we can support your content</span></p></td>
              </tr></table></td></tr>
            </table>
          </td></tr>
        </table>

        <p style="margin:0 0 8px 0;color:#374151;font-size:15px;line-height:1.6;">In the meantime, if you have any questions, feel free to reply to this email.</p>
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;"><strong>The Creator Ops Team</strong></p>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, "Thanks for applying to Creator Ops. We'll review your application within 48 hours.");
}

export async function sendEmail(opts: {
  from: string;
  to: string[];
  subject: string;
  html: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opts),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error ${response.status}: ${error}`);
  }
}

function buildStudioInternalEmail(formData: Record<string, unknown>): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
        <span style="display:inline-block;background-color:${colors.primary}15;color:${colors.primary};font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:24px;">Creator Studio Inquiry</span>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Contact Information</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Name</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.firstName} ${formData.lastName}</span>
              </td></tr>
              <tr><td style="padding:8px 0;">
                <span style="color:${colors.muted};font-size:13px;">Email</span><br>
                <a href="mailto:${formData.email}" style="color:${colors.primary};font-size:15px;font-weight:500;text-decoration:none;">${formData.email}</a>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Operation Details</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td width="50%" style="padding:8px 0;padding-right:8px;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Operation Type</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.operationType}</span>
              </td><td width="50%" style="padding:8px 0;padding-left:8px;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Peak Players</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.peakPlayers}</span>
              </td></tr>
              <tr><td colspan="2" style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Timeline</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.timeline}</span>
              </td></tr>
              <tr><td colspan="2" style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Current Pain Point</span><br>
                <p style="margin:4px 0 0 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.currentPainPoint}</p>
              </td></tr>
              ${formData.tellUsMore ? `<tr><td colspan="2" style="padding:8px 0;">
                <span style="color:${colors.muted};font-size:13px;">Additional Context</span><br>
                <p style="margin:4px 0 0 0;color:${colors.dark};font-size:14px;line-height:1.6;">${formData.tellUsMore}</p>
              </td></tr>` : ''}
            </table>
          </td></tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px;">
          <tr><td><p style="margin:0;color:${colors.muted};font-size:12px;">Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p></td></tr>
        </table>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, `Creator Studio inquiry from ${formData.firstName} ${formData.lastName}`);
}

function buildStudioConfirmationEmail(firstName: string): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
        <h1 style="margin:0 0 24px 0;color:${colors.dark};font-size:24px;font-weight:700;line-height:1.3;">Thanks for reaching out, ${firstName}.</h1>
        <p style="margin:0 0 24px 0;color:#374151;font-size:16px;line-height:1.7;">We've received your Creator Studio inquiry. Someone from our team will be in touch within 24 hours to discuss your infrastructure needs.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${colors.primary}08;border:1px solid ${colors.primary}20;border-radius:12px;margin-bottom:32px;">
          <tr><td style="padding:24px;">
            <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:16px;font-weight:600;">What to expect</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">1</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>We review your needs</strong><br><span style="color:${colors.muted};">Our team looks at your operation profile and pain points within 24 hours</span></p></td>
              </tr></table></td></tr>
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">2</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>Discovery call</strong><br><span style="color:${colors.muted};">We schedule a call to walk through your requirements and custom SLA</span></p></td>
              </tr></table></td></tr>
              <tr><td style="padding:8px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
                <td style="vertical-align:top;padding-right:12px;"><span style="display:inline-block;width:24px;height:24px;background-color:${colors.primary};border-radius:50%;text-align:center;line-height:24px;color:white;font-size:12px;font-weight:600;">3</span></td>
                <td style="vertical-align:top;"><p style="margin:0;color:${colors.dark};font-size:14px;line-height:1.5;"><strong>White-glove onboarding</strong><br><span style="color:${colors.muted};">We migrate your worlds and configure your dedicated infrastructure</span></p></td>
              </tr></table></td></tr>
            </table>
          </td></tr>
        </table>

        <p style="margin:0 0 8px 0;color:#374151;font-size:15px;line-height:1.6;">If you have any immediate questions, reply to this email and we'll get back to you.</p>
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;"><strong>The Creator Ops Team</strong></p>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, "We received your Creator Studio inquiry. Someone will be in touch within 24 hours.");
}

function buildEventsInternalEmail(formData: Record<string, unknown>): string {
  const quotePath = formData.quotePath as string | undefined;
  const pathLabels: Record<string, string> = {
    A: "Path A — Instant Estimate",
    B: "Path B — Review Estimate",
    C: "Path C — Planning Call",
    D: "Path D — Recurring Series",
  };

  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
        <span style="display:inline-block;background-color:${colors.primary}15;color:${colors.primary};font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:24px;">Events &amp; Collabs Quote Request</span>

        ${quotePath ? `<div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:24px;"><span style="color:#166534;font-size:13px;font-weight:600;">Quote Path: ${pathLabels[quotePath] ?? quotePath}</span></div>` : ''}

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Contact Information</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                <span style="color:${colors.muted};font-size:13px;">Name</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.firstName} ${formData.lastName}</span>
              </td></tr>
              <tr><td style="padding:8px 0;">
                <span style="color:${colors.muted};font-size:13px;">Email</span><br>
                <a href="mailto:${formData.email}" style="color:${colors.primary};font-size:15px;font-weight:500;text-decoration:none;">${formData.email}</a>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:18px;font-weight:600;">Event Details</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td width="50%" style="padding:8px 0;padding-right:8px;border-bottom:1px solid #e5e7eb;">
                  <span style="color:${colors.muted};font-size:13px;">Event Type</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.eventType}</span>
                </td>
                <td width="50%" style="padding:8px 0;padding-left:8px;border-bottom:1px solid #e5e7eb;">
                  <span style="color:${colors.muted};font-size:13px;">Concurrent Players</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.concurrentPlayers}</span>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:8px 0;padding-right:8px;border-bottom:1px solid #e5e7eb;">
                  <span style="color:${colors.muted};font-size:13px;">Duration</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.duration}</span>
                </td>
                <td width="50%" style="padding:8px 0;padding-left:8px;border-bottom:1px solid #e5e7eb;">
                  <span style="color:${colors.muted};font-size:13px;">World Setup</span><br>
                  <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.worldSetup}</span>
                </td>
              </tr>
              <tr><td colspan="2" style="padding:8px 0;">
                <span style="color:${colors.muted};font-size:13px;">Target Date</span><br>
                <span style="color:${colors.dark};font-size:15px;font-weight:500;">${formData.targetDate}</span>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px;">
          <tr><td><p style="margin:0;color:${colors.muted};font-size:12px;">Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</p></td></tr>
        </table>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, `Events quote request from ${formData.firstName} ${formData.lastName}`);
}

function buildEventsConfirmationEmail(firstName: string): string {
  const content = `
    ${logoHeader}
    <tr>
      <td style="background-color:#ffffff;padding:40px 32px;border-radius:0 0 12px 12px;">
        <h1 style="margin:0 0 24px 0;color:${colors.dark};font-size:24px;font-weight:700;line-height:1.3;">Thanks, ${firstName} — your quote request is in.</h1>
        <p style="margin:0 0 24px 0;color:#374151;font-size:16px;line-height:1.7;">We've received your Events &amp; Collabs quote request. We'll follow up within 24 hours with pricing and next steps specific to your event.</p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:32px;">
          <tr><td style="padding:24px;">
            <h2 style="margin:0 0 16px 0;color:${colors.dark};font-size:16px;font-weight:600;">What's included in every engagement</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:6px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Pre-event stress testing</span></td></tr>
              <tr><td style="padding:6px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Dedicated monitoring during your event</span></td></tr>
              <tr><td style="padding:6px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Instant rollback if anything goes wrong</span></td></tr>
              <tr><td style="padding:6px 0;"><span style="color:${colors.primary};font-size:16px;vertical-align:middle;">&#10003;</span><span style="color:${colors.dark};font-size:14px;margin-left:8px;vertical-align:middle;">Post-event performance report</span></td></tr>
            </table>
          </td></tr>
        </table>

        <p style="margin:0 0 8px 0;color:#374151;font-size:15px;line-height:1.6;">Questions in the meantime? Reply to this email and we'll get back to you.</p>
        <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;"><strong>The Creator Ops Team</strong></p>
      </td>
    </tr>
    ${footer}`;

  return emailWrapper(content, "We received your Events & Collabs quote request. We'll follow up within 24 hours.");
}

export const storeApplication = internalMutation({
  args: {
    formType: v.union(v.literal("standard"), v.literal("founding"), v.literal("studio"), v.literal("events")),
    formData: v.any(),
  },
  handler: async (ctx, { formType, formData }) => {
    const email = formData.email as string;
    const firstName = formData.firstName as string;
    const lastName = formData.lastName as string;
    const now = Date.now();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    const userId: Id<"users"> = existing
      ? existing._id
      : await ctx.db.insert("users", {
          firstName,
          lastName,
          email,
          firstSubmittedAt: now,
        });

    const base = {
      userId,
      email,
      submittedAt: now,
      status: "pending" as const,
    };

    if (formType === "founding") {
      return await ctx.db.insert("foundingApplications", {
        ...base,
        discordUsername: formData.discordUsername,
        timezone: formData.timezone,
        channelUrl: formData.channelUrl,
        audienceSize: formData.audienceSize,
        uploadFrequency: formData.uploadFrequency,
        contentDescription: formData.contentDescription,
        worldDescription: formData.worldDescription,
        currentPainPoints: formData.currentPainPoints,
        collaborators: formData.collaborators,
        whyFounder: formData.whyFounder,
        feedbackStyle: formData.feedbackStyle,
        availabilityCall: formData.availabilityCall,
        agreeCommitment: formData.agreeCommitment,
        agreeFeedback: formData.agreeFeedback,
        agreeTestimonial: formData.agreeTestimonial,
        referral: formData.referral,
        additionalNotes: formData.additionalNotes,
      });
    }

    if (formType === "standard") {
      return await ctx.db.insert("standardApplications", {
        ...base,
        discordUsername: formData.discordUsername,
        preferredContact: formData.preferredContact,
        channelUrl: formData.channelUrl,
        subscriberCount: formData.subscriberCount,
        creatorType: formData.creatorType,
        currentSetup: formData.currentSetup,
        useCase: formData.useCase,
        budgetRange: formData.budgetRange,
        timeline: formData.timeline,
        referral: formData.referral,
      });
    }

    if (formType === "studio") {
      return await ctx.db.insert("studioInquiries", {
        ...base,
        operationType: formData.operationType,
        peakPlayers: formData.peakPlayers,
        currentPainPoint: formData.currentPainPoint,
        timeline: formData.timeline,
        tellUsMore: formData.tellUsMore,
      });
    }

    if (formType === "events") {
      return await ctx.db.insert("eventsQuotes", {
        ...base,
        eventType: formData.eventType,
        concurrentPlayers: formData.concurrentPlayers,
        duration: formData.duration,
        worldSetup: formData.worldSetup,
        targetDate: formData.targetDate,
        quotePath: formData.quotePath,
      });
    }
  },
});

export const sendApplicationEmail = action({
  args: {
    formType: v.union(v.literal("standard"), v.literal("founding"), v.literal("studio"), v.literal("events")),
    formData: v.any(),
  },
  handler: async (ctx, { formType, formData }) => {
    const applicationId = await ctx.runMutation(internal.email.storeApplication, { formType, formData });

    // In-app notification: fan out to all staff with a known clerkUserId.
    // Fires alongside (not instead of) the admin email below.
    const adminTitleByType: Record<string, string> = {
      founding: `New founding application — ${formData.firstName} ${formData.lastName}`,
      standard: `New creator application — ${formData.firstName} ${formData.lastName}`,
      studio: `New Studio inquiry — ${formData.firstName} ${formData.lastName}`,
      events: `New events quote request — ${formData.firstName} ${formData.lastName}`,
    };
    const adminBodyByType: Record<string, string> = {
      founding: (formData.contentDescription as string) ?? "",
      standard: (formData.useCase as string) ?? "",
      studio: (formData.currentPainPoint as string) ?? "",
      events: `${formData.eventType ?? ""} · ${formData.concurrentPlayers ?? ""} players · ${formData.targetDate ?? ""}`,
    };

    await ctx.runMutation(internal.notifications.notifyStaff, {
      type: `application.new.${formType}`,
      severity: formType === "founding" ? "success" : "info",
      title: adminTitleByType[formType] ?? `New ${formType} submission`,
      body: adminBodyByType[formType]?.slice(0, 300),
      link: `/admin/applications?id=${applicationId}&type=${formType}`,
      metadata: {
        applicationId,
        formType,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
    });

    const recipientEmail = "hi@creatorops.io";

    const subjectMap: Record<string, string> = {
      founding: `New Founding Creator Application: ${formData.firstName} ${formData.lastName}`,
      standard: `New Creator Application: ${formData.firstName} ${formData.lastName}`,
      studio: `Creator Studio Inquiry: ${formData.firstName} ${formData.lastName}`,
      events: `Events Quote Request: ${formData.firstName} ${formData.lastName}`,
    };

    const internalHtmlMap: Record<string, string> = {
      founding: buildFoundingInternalEmail(formData),
      standard: buildStandardInternalEmail(formData),
      studio: buildStudioInternalEmail(formData),
      events: buildEventsInternalEmail(formData),
    };

    await sendEmail({
      from: "Creator Ops <noreply@creatorops.io>",
      to: [recipientEmail],
      subject: subjectMap[formType] ?? `New ${formType} submission`,
      html: internalHtmlMap[formType] ?? buildStandardInternalEmail(formData),
    });

    const confirmationSubjectMap: Record<string, string> = {
      founding: "We received your Founding Creator application",
      standard: "We received your Creator Ops application",
      studio: "We received your Creator Studio inquiry",
      events: "We received your Events & Collabs quote request",
    };

    const confirmationHtmlMap: Record<string, string> = {
      founding: buildFoundingConfirmationEmail(formData.firstName as string),
      standard: buildStandardConfirmationEmail(formData.firstName as string),
      studio: buildStudioConfirmationEmail(formData.firstName as string),
      events: buildEventsConfirmationEmail(formData.firstName as string),
    };

    await sendEmail({
      from: "Creator Ops <noreply@creatorops.io>",
      to: [formData.email as string],
      subject: confirmationSubjectMap[formType] ?? "We received your submission",
      html: confirmationHtmlMap[formType] ?? buildStandardConfirmationEmail(formData.firstName as string),
    });

    return { success: true };
  },
});
