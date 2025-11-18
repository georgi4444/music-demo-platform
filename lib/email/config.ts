// Validate required environment variables
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

if (!process.env.SENDGRID_VERIFIED_SENDER) {
  throw new Error("SENDGRID_VERIFIED_SENDER environment variable is not set");
}

/**
 * Email Configuration
 */

export const EMAIL_CONFIG = {
  from: {
    email: process.env.SENDGRID_VERIFIED_SENDER as string,
    name: "Music Label Submissions",
  },
} as const;
