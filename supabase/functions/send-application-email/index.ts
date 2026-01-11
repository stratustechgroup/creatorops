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

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Creator Ops <noreply@creatorops.io>",
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
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
