import { convexClient, createConvexClients, type BetterAuthClient } from "convue";
import { createAuthClient } from 'better-auth/vue'

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig();
  const convexUrl = runtime.public?.convexUrl;
  const convexSiteUrl = runtime.public?.convexSiteUrl;

  if (!convexUrl || typeof convexUrl !== 'string') {
    console.warn("[convue] Missing or invalid CONVEX_URL. Set it in .env.local. Queries will fail.");
    return;
  }

  if (!convexSiteUrl || typeof convexSiteUrl !== 'string') {
    console.warn("[convue] Missing or invalid VITE_CONVEX_SITE_URL. Set it in .env.local. Auth will fail.");
    return;
  }

  // Create auth client with runtime config
  const authClient = createAuthClient({
    baseURL: convexSiteUrl,
    plugins: [convexClient()],
  })

  // Create Convex clients
  const { clientRef, httpClientRef, initClient } = createConvexClients(convexUrl)

  // Provide everything using Nuxt's pattern
  return {
    provide: {
      betterAuthClient: authClient as BetterAuthClient,
      convex: {
        options: { url: convexUrl, server: false },
        clientRef,
        httpClientRef,
        initClient,
      },
    },
  }
});
