import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationEmailRequest {
  formType: "standard" | "founding";
  formData: Record<string, unknown>;
}

// Brand colors from the website
const colors = {
  primary: "#2db87b",        // Teal green - HSL 152 60% 45%
  primaryDark: "#25a06b",    // Darker teal for hover/accents
  dark: "#0a0c10",           // Dark background
  darkCard: "#12151c",       // Card background
  light: "#f3f2f0",          // Light text
  muted: "#6b7280",          // Muted text
  border: "#1f2937",         // Border color
};

// Email wrapper template
const emailWrapper = (content: string, preheader: string = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Creator Ops</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Logo component (text-based for email compatibility)
const logoHeader = `
<tr>
  <td style="background-color: ${colors.dark}; padding: 24px 32px; border-radius: 12px 12px 0 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%); border-radius: 8px; vertical-align: middle;"></span>
          <span style="color: ${colors.light}; font-size: 18px; font-weight: 600; margin-left: 12px; vertical-align: middle;">Creator Ops</span>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

// Footer component
const footer = `
<tr>
  <td style="padding: 32px; text-align: center;">
    <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">
      © ${new Date().getFullYear()} Stratus Technology Group. All rights reserved.
    </p>
    <p style="margin: 0; color: ${colors.muted}; font-size: 12px;">
      <a href="https://creatorops.io/privacy" style="color: ${colors.primary}; text-decoration: none;">Privacy Policy</a>
      &nbsp;&bull;&nbsp;
      <a href="https://creatorops.io/terms" style="color: ${colors.primary}; text-decoration: none;">Terms of Service</a>
    </p>
  </td>
</tr>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formType, formData }: ApplicationEmailRequest = await req.json();

    console.log(`Received ${formType} application from:`, formData.email);

    const recipientEmail = formType === "founding"
      ? "founder@creatorops.io"
      : "apply@creatorops.io";

    let emailSubject: string;
    let emailHtml: string;

    if (formType === "founding") {
      emailSubject = `New Founding Creator Application: ${formData.firstName} ${formData.lastName}`;

      const internalContent = `
        ${logoHeader}
        <tr>
          <td style="background-color: #ffffff; padding: 32px; border-radius: 0 0 12px 12px;">
            <!-- Badge -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
              <tr>
                <td>
                  <span style="display: inline-block; background-color: ${colors.primary}15; color: ${colors.primary}; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Founding Creator Application
                  </span>
                </td>
              </tr>
            </table>

            <!-- Applicant Info -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Applicant Information</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Name</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.firstName} ${formData.lastName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Email</span><br>
                        <a href="mailto:${formData.email}" style="color: ${colors.primary}; font-size: 15px; font-weight: 500; text-decoration: none;">${formData.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Discord</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.discordUsername}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Timezone</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.timezone}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Content Details -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Content Details</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">Channel URL</p>
                  <a href="${formData.channelUrl}" style="color: ${colors.primary}; font-size: 14px; text-decoration: none; word-break: break-all;">${formData.channelUrl}</a>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                    <tr>
                      <td width="50%" style="padding-right: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Audience Size</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.audienceSize}</span>
                      </td>
                      <td width="50%" style="padding-left: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Upload Frequency</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.uploadFrequency}</span>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 16px 0 8px 0; color: ${colors.muted}; font-size: 13px;">Content Description</p>
                  <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.contentDescription}</p>
                </td>
              </tr>
            </table>

            <!-- World & Needs -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">World & Infrastructure</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">World Description</p>
                  <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.worldDescription}</p>

                  <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">Current Pain Points</p>
                  <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.currentPainPoints}</p>

                  <p style="margin: 0 0 4px 0; color: ${colors.muted}; font-size: 13px;">Collaborators</p>
                  <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.collaborators}</span>
                </td>
              </tr>
            </table>

            <!-- Partnership Fit -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Partnership Fit</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">Why Founding Creator?</p>
                  <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.whyFounder}</p>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="50%" style="padding-right: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Feedback Style</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.feedbackStyle}</span>
                      </td>
                      <td width="50%" style="padding-left: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Call Availability</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.availabilityCall}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Agreements -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Agreements</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0;">
                  <span style="display: inline-block; width: 20px; height: 20px; background-color: ${formData.agreeCommitment ? colors.primary : '#e5e7eb'}; border-radius: 4px; text-align: center; line-height: 20px; color: white; font-size: 12px; vertical-align: middle;">${formData.agreeCommitment ? '✓' : ''}</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">3-Month Commitment</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="display: inline-block; width: 20px; height: 20px; background-color: ${formData.agreeFeedback ? colors.primary : '#e5e7eb'}; border-radius: 4px; text-align: center; line-height: 20px; color: white; font-size: 12px; vertical-align: middle;">${formData.agreeFeedback ? '✓' : ''}</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">Feedback Agreement</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="display: inline-block; width: 20px; height: 20px; background-color: ${formData.agreeTestimonial ? colors.primary : '#e5e7eb'}; border-radius: 4px; text-align: center; line-height: 20px; color: white; font-size: 12px; vertical-align: middle;">${formData.agreeTestimonial ? '✓' : ''}</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">Testimonial Agreement (Optional)</span>
                </td>
              </tr>
            </table>

            ${formData.referral ? `
            <p style="margin: 0 0 4px 0; color: ${colors.muted}; font-size: 13px;">Referral Source</p>
            <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px;">${formData.referral}</p>
            ` : ''}

            ${formData.additionalNotes ? `
            <p style="margin: 0 0 4px 0; color: ${colors.muted}; font-size: 13px;">Additional Notes</p>
            <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.additionalNotes}</p>
            ` : ''}

            <!-- Timestamp -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
              <tr>
                <td>
                  <p style="margin: 0; color: ${colors.muted}; font-size: 12px;">
                    Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${footer}
      `;

      emailHtml = emailWrapper(internalContent, `New founding creator application from ${formData.firstName} ${formData.lastName}`);

    } else {
      emailSubject = `New Creator Application: ${formData.firstName} ${formData.lastName}`;

      const internalContent = `
        ${logoHeader}
        <tr>
          <td style="background-color: #ffffff; padding: 32px; border-radius: 0 0 12px 12px;">
            <!-- Badge -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
              <tr>
                <td>
                  <span style="display: inline-block; background-color: #f3f4f6; color: ${colors.muted}; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Standard Application
                  </span>
                </td>
              </tr>
            </table>

            <!-- Applicant Info -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Applicant Information</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Name</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.firstName} ${formData.lastName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Email</span><br>
                        <a href="mailto:${formData.email}" style="color: ${colors.primary}; font-size: 15px; font-weight: 500; text-decoration: none;">${formData.email}</a>
                      </td>
                    </tr>
                    ${formData.discordUsername ? `
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Discord</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.discordUsername}</span>
                      </td>
                    </tr>
                    ` : ''}
                    ${formData.preferredContact ? `
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Preferred Contact</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.preferredContact}</span>
                      </td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Channel Details -->
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Channel Details</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  ${formData.channelUrl ? `
                  <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">Channel URL</p>
                  <a href="${formData.channelUrl}" style="color: ${colors.primary}; font-size: 14px; text-decoration: none; word-break: break-all;">${formData.channelUrl}</a>
                  ` : ''}

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                    <tr>
                      ${formData.subscriberCount ? `
                      <td width="50%" style="padding-right: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Subscriber Count</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.subscriberCount}</span>
                      </td>
                      ` : ''}
                      <td width="50%" style="padding-left: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Creator Type</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.creatorType}</span>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 16px 0 8px 0; color: ${colors.muted}; font-size: 13px;">Current Setup</p>
                  <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.currentSetup}</p>

                  <p style="margin: 0 0 8px 0; color: ${colors.muted}; font-size: 13px;">Use Case & Needs</p>
                  <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.6;">${formData.useCase}</p>
                </td>
              </tr>
            </table>

            <!-- Project Details -->
            ${formData.budgetRange || formData.timeline ? `
            <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 18px; font-weight: 600;">Project Details</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      ${formData.budgetRange ? `
                      <td width="50%" style="padding-right: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Budget Range</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.budgetRange}</span>
                      </td>
                      ` : ''}
                      ${formData.timeline ? `
                      <td width="50%" style="padding-left: 8px;">
                        <span style="color: ${colors.muted}; font-size: 13px;">Timeline</span><br>
                        <span style="color: ${colors.dark}; font-size: 15px; font-weight: 500;">${formData.timeline}</span>
                      </td>
                      ` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            ` : ''}

            ${formData.referral ? `
            <p style="margin: 0 0 4px 0; color: ${colors.muted}; font-size: 13px;">Referral Source</p>
            <p style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px;">${formData.referral}</p>
            ` : ''}

            <!-- Timestamp -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
              <tr>
                <td>
                  <p style="margin: 0; color: ${colors.muted}; font-size: 12px;">
                    Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${footer}
      `;

      emailHtml = emailWrapper(internalContent, `New creator application from ${formData.firstName} ${formData.lastName}`);
    }

    // Send the internal notification email
    const emailResponse = await resend.emails.send({
      from: "Creator Ops <noreply@creatorops.io>",
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Internal notification email sent:", emailResponse);

    // Build and send confirmation email to applicant
    const applicantEmail = formData.email as string;
    const applicantName = formData.firstName as string;

    let confirmationSubject: string;
    let confirmationHtml: string;

    if (formType === "founding") {
      confirmationSubject = "We received your Founding Creator application";

      const confirmationContent = `
        ${logoHeader}
        <tr>
          <td style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;">
            <!-- Welcome Message -->
            <h1 style="margin: 0 0 24px 0; color: ${colors.dark}; font-size: 24px; font-weight: 700; line-height: 1.3;">
              Thanks for applying, ${applicantName}!
            </h1>

            <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.7;">
              We're excited to review your application for the <strong>Founding Creator Program</strong>. You're taking the first step toward joining an exclusive group of creators shaping the future of Minecraft content infrastructure.
            </p>

            <!-- What's Next Card -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${colors.primary}08; border: 1px solid ${colors.primary}20; border-radius: 12px; margin-bottom: 32px;">
              <tr>
                <td style="padding: 24px;">
                  <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 16px; font-weight: 600;">What happens next?</h2>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding: 8px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px;">
                              <span style="display: inline-block; width: 24px; height: 24px; background-color: ${colors.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">1</span>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.5;">
                                <strong>Application Review</strong><br>
                                <span style="color: ${colors.muted};">Our team will personally review your application within 48 hours</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px;">
                              <span style="display: inline-block; width: 24px; height: 24px; background-color: ${colors.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">2</span>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.5;">
                                <strong>Discovery Call</strong><br>
                                <span style="color: ${colors.muted};">If selected, we'll reach out via Discord to schedule your onboarding call</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px;">
                              <span style="display: inline-block; width: 24px; height: 24px; background-color: ${colors.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">3</span>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.5;">
                                <strong>Welcome to the Community</strong><br>
                                <span style="color: ${colors.muted};">Get exclusive access to our Founding Creator community and benefits</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Benefits Reminder -->
            <h3 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Founding Creator Benefits</h3>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: ${colors.primary}; font-size: 16px; vertical-align: middle;">&#10003;</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">Locked-in pricing forever</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: ${colors.primary}; font-size: 16px; vertical-align: middle;">&#10003;</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">White-glove priority support</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: ${colors.primary}; font-size: 16px; vertical-align: middle;">&#10003;</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">Direct product influence</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <span style="color: ${colors.primary}; font-size: 16px; vertical-align: middle;">&#10003;</span>
                  <span style="color: ${colors.dark}; font-size: 14px; margin-left: 8px; vertical-align: middle;">Early access to new features</span>
                </td>
              </tr>
            </table>

            <!-- Sign Off -->
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 15px; line-height: 1.6;">
              We're excited to potentially have you on this journey with us.
            </p>
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
              <strong>The Creator Ops Team</strong>
            </p>
          </td>
        </tr>
        ${footer}
      `;

      confirmationHtml = emailWrapper(confirmationContent, "Thanks for applying to the Founding Creator Program. We'll review your application within 48 hours.");

    } else {
      confirmationSubject = "We received your Creator Ops application";

      const confirmationContent = `
        ${logoHeader}
        <tr>
          <td style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;">
            <!-- Welcome Message -->
            <h1 style="margin: 0 0 24px 0; color: ${colors.dark}; font-size: 24px; font-weight: 700; line-height: 1.3;">
              Thanks for applying, ${applicantName}!
            </h1>

            <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.7;">
              We've received your application and are excited to learn more about your Minecraft content creation journey.
            </p>

            <!-- What's Next Card -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 32px;">
              <tr>
                <td style="padding: 24px;">
                  <h2 style="margin: 0 0 16px 0; color: ${colors.dark}; font-size: 16px; font-weight: 600;">What happens next?</h2>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding: 8px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px;">
                              <span style="display: inline-block; width: 24px; height: 24px; background-color: ${colors.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">1</span>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.5;">
                                <strong>Application Review</strong><br>
                                <span style="color: ${colors.muted};">Our team will review your application within 48 hours</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px;">
                              <span style="display: inline-block; width: 24px; height: 24px; background-color: ${colors.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">2</span>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.5;">
                                <strong>Next Steps</strong><br>
                                <span style="color: ${colors.muted};">We'll reach out via your preferred contact method</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px;">
                              <span style="display: inline-block; width: 24px; height: 24px; background-color: ${colors.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">3</span>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0; color: ${colors.dark}; font-size: 14px; line-height: 1.5;">
                                <strong>Discussion</strong><br>
                                <span style="color: ${colors.muted};">If we're a good fit, we'll discuss how we can support your content</span>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Sign Off -->
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 15px; line-height: 1.6;">
              In the meantime, if you have any questions, feel free to reply to this email.
            </p>
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
              <strong>The Creator Ops Team</strong>
            </p>
          </td>
        </tr>
        ${footer}
      `;

      confirmationHtml = emailWrapper(confirmationContent, "Thanks for applying to Creator Ops. We'll review your application within 48 hours.");
    }

    // Send confirmation email to applicant
    const confirmationResponse = await resend.emails.send({
      from: "Creator Ops <noreply@creatorops.io>",
      to: [applicantEmail],
      subject: confirmationSubject,
      html: confirmationHtml,
    });

    console.log("Confirmation email sent to applicant:", confirmationResponse);

    return new Response(JSON.stringify({ success: true, emailResponse, confirmationResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-application-email function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
