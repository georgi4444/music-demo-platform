import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/prisma";

async function main() {
  console.log("Starting database seed...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Admin email and password must be set in environment variables.",
    );
  }

  // Create admin user
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: await hashPassword(adminPassword),
      name: "Admin User",
    },
  });

  // Create email templates
  const templates = [
    {
      name: "submission_confirmation",
      subject: "Demo Submission Received - {{artist_name}}",
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎵 Submission Received</h1>
              </div>
              <div class="content">
                <p>Hi <strong>{{artist_name}}</strong>,</p>
                <p>Thank you for submitting your demo to our label! We've successfully received your submission.</p>
                <p><strong>Submission ID:</strong> {{submission_id}}</p>
                <p>Our A&R team will carefully review your tracks and get back to you within <strong>2-3 weeks</strong>.</p>
                <p>We appreciate your patience and look forward to listening to your music!</p>
                <p>Best regards,<br><strong>The Music Label Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      variables: ["artist_name", "submission_id"],
    },
    {
      name: "submission_approved",
      subject: "🎉 Great News - Your Demo Has Been Approved!",
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
              .grade { font-size: 48px; font-weight: bold; color: #11998e; text-align: center; margin: 20px 0; }
              .feedback-box { background: #f5f5f5; padding: 20px; border-left: 4px solid #11998e; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Congratulations!</h1>
              </div>
              <div class="content">
                <p>Hi <strong>{{artist_name}}</strong>,</p>
                <p>We're excited to let you know that your demo submission has been <strong>APPROVED</strong>!</p>
                <div class="grade">{{grade}}/10</div>
                <div class="feedback-box">
                  <h3>Feedback from our A&R team:</h3>
                  <p>{{feedback}}</p>
                </div>
                <p>Our team will be in touch with you shortly to discuss the next steps and potential collaboration opportunities.</p>
                <p>Keep up the amazing work!</p>
                <p>Best regards,<br><strong>The Music Label Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      variables: ["artist_name", "grade", "feedback"],
    },
    {
      name: "submission_rejected",
      subject: "Update on Your Demo Submission",
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
              .feedback-box { background: #f5f5f5; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎵 Submission Update</h1>
              </div>
              <div class="content">
                <p>Hi <strong>{{artist_name}}</strong>,</p>
                <p>Thank you for taking the time to submit your demo to our label. Our A&R team has carefully reviewed your submission.</p>
                <p>After thorough consideration, we've decided not to move forward with your demo at this time. This decision doesn't reflect on your talent, but rather the specific direction we're currently pursuing for our roster.</p>
                <div class="feedback-box">
                  <h3>Feedback from our A&R team:</h3>
                  <p>{{feedback}}</p>
                </div>
                <p>We encourage you to keep creating and developing your sound. The music industry is full of opportunities, and we wish you all the best in your musical journey!</p>
                <p>Thank you again for considering us.</p>
                <p>Best regards,<br><strong>The Music Label Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      variables: ["artist_name", "feedback"],
    },
  ];

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }
  console.log("Email templates created");

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
