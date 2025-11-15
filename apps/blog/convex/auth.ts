import { components } from "./_generated/api";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";
import { convex, createClient, type GenericCtx } from "convue";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import type { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.SITE_URL || process.env.CONVEX_SITE_URL;

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: true,
  },
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  // Build trusted origins list
  const trustedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
  ];

  // Add production site URL if available
  if (siteUrl) {
    trustedOrigins.push(siteUrl);
  }

  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins,
    logger: {
      disabled: optionsOnly,
      level: "debug",
    },
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Simplified for now
    },
    plugins: [
      convex(),
    ],
  } satisfies BetterAuthOptions);
};

// Get the current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

