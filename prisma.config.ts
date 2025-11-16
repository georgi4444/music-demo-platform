import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Only load .env.local in development (Vercel uses its own env vars)
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
} else {
  config();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: `tsx prisma/seed.ts`,
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
