/**
 * Email Client & Templates
 * SendGrid integration for sending templated emails
 */

import sgMail from "@sendgrid/mail";
import prisma from "@/lib/prisma";
import { EMAIL_CONFIG } from "./config";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Replaces template variables with actual values
 * Supports {{variable_name}} syntax
 */
function replaceTemplateVariables(
  template: string,
  variables: Record<string, string | number>,
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, String(value));
  }

  return result;
}

/**
 * Sends an email using a template from the database
 */
async function sendTemplatedEmail(
  templateName: string,
  recipientEmail: string,
  variables: Record<string, string | number>,
) {
  try {
    // Fetch template from database
    const template = await prisma.emailTemplate.findUnique({
      where: { name: templateName },
    });

    if (!template) {
      throw new Error(`Email template "${templateName}" not found in database`);
    }

    // Replace variables in subject and content
    const subject = replaceTemplateVariables(template.subject, variables);
    const htmlContent = replaceTemplateVariables(
      template.htmlContent,
      variables,
    );

    const msg = {
      to: recipientEmail,
      from: EMAIL_CONFIG.from,
      subject,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(
      `Email sent to ${recipientEmail} using template "${templateName}"`,
    );
  } catch (error) {
    console.error(
      `Failed to send email using template "${templateName}":`,
      error,
    );
    // Don't throw - we don't want email failures to fail the main operation
  }
}

// Type definitions for email data
interface SubmissionEmailData {
  id: string;
  artist: {
    name: string;
    email: string;
  };
  tracks: Array<{
    title: string;
  }>;
}

interface ReviewEmailData {
  artist: {
    name: string;
    email: string;
  };
  grade?: number;
  feedback: string;
}

/**
 * Send submission confirmation email to artist
 */
export async function sendSubmissionConfirmationEmail(
  submission: SubmissionEmailData,
) {
  await sendTemplatedEmail("submission_confirmation", submission.artist.email, {
    artist_name: submission.artist.name,
    submission_id: submission.id,
  });
}

/**
 * Send approval email to artist
 */
export async function sendSubmissionApprovedEmail(data: ReviewEmailData) {
  if (!data.grade) {
    throw new Error("Grade is required for approval emails");
  }

  await sendTemplatedEmail("submission_approved", data.artist.email, {
    artist_name: data.artist.name,
    grade: data.grade,
    feedback: data.feedback,
  });
}

/**
 * Send rejection email to artist
 */
export async function sendSubmissionRejectedEmail(data: ReviewEmailData) {
  await sendTemplatedEmail("submission_rejected", data.artist.email, {
    artist_name: data.artist.name,
    feedback: data.feedback,
  });
}
