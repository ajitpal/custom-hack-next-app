import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want email verification
  },
  callbacks: {
    user: {
      onCreate: async (user) => {
        // Create user profile and set default preferences when user signs up
        try {
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              onboardingCompleted: false,
            },
          });

          await prisma.userPreference.create({
            data: {
              userId: user.id,
              categoryInterests: [],
              brandPreferences: [],
            },
          });

          // Log the user creation activity
          await prisma.activityLog.create({
            data: {
              userId: user.id,
              actionType: "user_created",
              metadata: {
                source: "signup",
                timestamp: new Date().toISOString(),
              },
            },
          });

          console.log(`Created profile and preferences for user: ${user.id}`);
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      },
    },
  },


    // Email verification (uncomment if needed)
    // requireEmailVerification: true,
    // sendVerificationEmail: async ({ user, url, token }, request) => {
    //   // Integrate with Resend for email verification
    //   console.log("Sending verification email to", user.email, "with url", url);
    // },

    // Password reset (uncomment if needed)
    // sendResetPassword: async (url, user) => {
    //   // Integrate with Resend for password reset
    //   console.log("Sending reset password email to", user.email, "with url", url);
    // },
  },
});
