import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_VERIFIED_SENDER = process.env.SENDGRID_VERIFIED_SENDER;

if (!SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

if (!SENDGRID_VERIFIED_SENDER) {
  throw new Error("SENDGRID_VERIFIED_SENDER environment variable is not set");
}

sgMail.setApiKey(SENDGRID_API_KEY);

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

export async function sendSubmissionConfirmationEmail(
  submission: SubmissionEmailData,
) {
  // Use verified sender email from environment variable
  // In production, you should verify your domain with SendGrid
  const fromEmail = SENDGRID_VERIFIED_SENDER as string;

  const msg = {
    to: submission.artist.email,
    from: {
      email: fromEmail,
      name: "Music Label Submissions",
    },
    subject: "🎵 Demo Submission Received",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .track-list {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .track-item {
              padding: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .track-item:last-child {
              border-bottom: none;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
            .submission-id {
              background: #e0e7ff;
              padding: 10px;
              border-radius: 6px;
              font-family: monospace;
              text-align: center;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎵 Thank You, ${submission.artist.name}!</h1>
          </div>
          <div class="content">
            <p>We've successfully received your demo submission. Our A&R team is excited to listen to your work!</p>
            
            <div class="submission-id">
              <strong>Submission ID:</strong> ${submission.id}
            </div>
            
            <div class="track-list">
              <h3>Your Submitted Tracks (${submission.tracks.length})</h3>
              ${submission.tracks.map((track) => `<div class="track-item">🎧 ${track.title}</div>`).join("")}
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your submission within 5-7 business days</li>
              <li>You'll receive an email update once we've completed our review</li>
              <li>If we'd like to move forward, we'll reach out to discuss next steps</li>
            </ul>
            
            <p>Keep creating amazing music! 🎶</p>
          </div>
          <div class="footer">
            <p>This is an automated confirmation email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Music Label. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Confirmation email sent to:", submission.artist.email);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // Don't throw - we don't want email failures to fail the submission
  }
}
