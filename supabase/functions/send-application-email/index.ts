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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formType, formData }: ApplicationEmailRequest = await req.json();
    
    console.log(`Received ${formType} application from:`, formData.email);

    // Determine recipient based on form type
    const recipientEmail = formType === "founding" 
      ? "founder@creatorops.io" 
      : "apply@creatorops.io";

    // Build email content based on form type
    let emailSubject: string;
    let emailHtml: string;

    if (formType === "founding") {
      emailSubject = `🌟 New Founding Creator Application: ${formData.firstName} ${formData.lastName}`;
      emailHtml = `
        <h1>New Founding Creator Application</h1>
        <h2>About the Applicant</h2>
        <ul>
          <li><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Discord:</strong> ${formData.discordUsername}</li>
          <li><strong>Timezone:</strong> ${formData.timezone}</li>
        </ul>
        
        <h2>Content Details</h2>
        <ul>
          <li><strong>Channel URL:</strong> ${formData.channelUrl}</li>
          <li><strong>Audience Size:</strong> ${formData.audienceSize}</li>
          <li><strong>Upload Frequency:</strong> ${formData.uploadFrequency}</li>
        </ul>
        
        <h3>Content Description</h3>
        <p>${formData.contentDescription}</p>
        
        <h2>World & Needs</h2>
        <h3>World Description</h3>
        <p>${formData.worldDescription}</p>
        
        <h3>Current Pain Points</h3>
        <p>${formData.currentPainPoints}</p>
        
        <p><strong>Collaborators:</strong> ${formData.collaborators}</p>
        
        <h2>Partnership Fit</h2>
        <h3>Why Founding Creator?</h3>
        <p>${formData.whyFounder}</p>
        
        <ul>
          <li><strong>Feedback Style:</strong> ${formData.feedbackStyle}</li>
          <li><strong>Call Availability:</strong> ${formData.availabilityCall}</li>
        </ul>
        
        <h2>Agreements</h2>
        <ul>
          <li><strong>3-Month Commitment:</strong> ${formData.agreeCommitment ? "✅ Yes" : "❌ No"}</li>
          <li><strong>Feedback Agreement:</strong> ${formData.agreeFeedback ? "✅ Yes" : "❌ No"}</li>
          <li><strong>Testimonial Agreement:</strong> ${formData.agreeTestimonial ? "✅ Yes" : "❌ No"}</li>
        </ul>
        
        ${formData.referral ? `<p><strong>Referral:</strong> ${formData.referral}</p>` : ""}
        ${formData.additionalNotes ? `<h3>Additional Notes</h3><p>${formData.additionalNotes}</p>` : ""}
        
        <hr>
        <p><em>Submitted at: ${new Date().toISOString()}</em></p>
      `;
    } else {
      emailSubject = `New Creator Application: ${formData.firstName} ${formData.lastName}`;
      emailHtml = `
        <h1>New Creator Application</h1>
        <h2>About the Applicant</h2>
        <ul>
          <li><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          ${formData.discordUsername ? `<li><strong>Discord:</strong> ${formData.discordUsername}</li>` : ""}
          ${formData.preferredContact ? `<li><strong>Preferred Contact:</strong> ${formData.preferredContact}</li>` : ""}
        </ul>
        
        <h2>Channel Details</h2>
        <ul>
          ${formData.channelUrl ? `<li><strong>Channel URL:</strong> ${formData.channelUrl}</li>` : ""}
          ${formData.subscriberCount ? `<li><strong>Subscriber Count:</strong> ${formData.subscriberCount}</li>` : ""}
          <li><strong>Creator Type:</strong> ${formData.creatorType}</li>
        </ul>
        
        <h3>Current Setup</h3>
        <p>${formData.currentSetup}</p>
        
        <h3>Use Case & Needs</h3>
        <p>${formData.useCase}</p>
        
        <h2>Project Details</h2>
        <ul>
          ${formData.budgetRange ? `<li><strong>Budget Range:</strong> ${formData.budgetRange}</li>` : ""}
          ${formData.timeline ? `<li><strong>Timeline:</strong> ${formData.timeline}</li>` : ""}
        </ul>
        
        ${formData.referral ? `<p><strong>Referral:</strong> ${formData.referral}</p>` : ""}
        
        <hr>
        <p><em>Submitted at: ${new Date().toISOString()}</em></p>
      `;
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
      confirmationSubject = "🌟 We received your Founding Creator application!";
      confirmationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to the Journey, ${applicantName}! 🎮</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for applying to become a <strong>Founding Creator</strong> with Creator Ops! We're thrilled that you want to be part of this exclusive group shaping the future of Minecraft content infrastructure.
            </p>
            
            <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h3 style="margin-top: 0; color: #667eea;">What happens next?</h3>
              <ol style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Our team will personally review your application within <strong>48 hours</strong></li>
                <li style="margin-bottom: 10px;">If selected, we'll reach out via Discord to schedule your onboarding call</li>
                <li style="margin-bottom: 10px;">You'll get exclusive access to our Founding Creator community</li>
              </ol>
            </div>
            
            <p style="font-size: 16px;">
              As a reminder, Founding Creators receive:
            </p>
            <ul style="margin: 15px 0;">
              <li>🔒 Locked-in pricing forever</li>
              <li>💜 White-glove priority support</li>
              <li>🗣️ Direct product influence</li>
              <li>⭐ Early access to new features</li>
            </ul>
            
            <p style="font-size: 16px; margin-top: 25px;">
              We're excited to potentially have you on this journey with us!
            </p>
            
            <p style="font-size: 16px; margin-top: 25px;">
              Best regards,<br>
              <strong>The Creator Ops Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Creator Ops. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
    } else {
      confirmationSubject = "Thanks for applying to Creator Ops! 🎮";
      confirmationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Application Received! 🎉</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hi ${applicantName},
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for applying to Creator Ops! We've received your application and are excited to learn more about your Minecraft content creation journey.
            </p>
            
            <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h3 style="margin-top: 0; color: #059669;">What happens next?</h3>
              <ol style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Our team will review your application within <strong>48 hours</strong></li>
                <li style="margin-bottom: 10px;">We'll reach out via your preferred contact method with next steps</li>
                <li style="margin-bottom: 10px;">If we're a good fit, we'll discuss how we can support your content</li>
              </ol>
            </div>
            
            <p style="font-size: 16px; margin-top: 25px;">
              In the meantime, if you have any questions, feel free to reply to this email.
            </p>
            
            <p style="font-size: 16px; margin-top: 25px;">
              Best regards,<br>
              <strong>The Creator Ops Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Creator Ops. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
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
