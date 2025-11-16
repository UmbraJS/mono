import { components } from "./_generated/api";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";
import { convex, createClient, type GenericCtx } from "convue";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import type { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.AUTH_BASE_URL || process.env.SITE_URL || process.env.CONVEX_SITE_URL;

console.log('[auth] Environment check:', {
  AUTH_BASE_URL: process.env.AUTH_BASE_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'set' : 'missing',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'set' : 'missing',
  siteUrl,
});

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
    "https://blog-myriadjs.vercel.app", // Production Vercel app
  ];

  // Add production site URL if available
  if (siteUrl) {
    trustedOrigins.push(siteUrl);
  }

  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

  console.log('[auth] GitHub credentials:', {
    clientId: githubClientId,
    clientSecretLength: githubClientSecret?.length,
    hasClientId: !!githubClientId,
    hasClientSecret: !!githubClientSecret,
  });

  // Build social providers object - only add GitHub if credentials are available
  const socialProviders: Record<string, any> = {};
  if (githubClientId && githubClientSecret) {
    socialProviders.github = {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    };
  }

  console.log('[auth] Social providers:', Object.keys(socialProviders));

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
    socialProviders,
    advanced: {
      cookiePrefix: "better-auth",
      // Use secure cookies only in production
      useSecureCookies: siteUrl?.startsWith("https://") || false,
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

