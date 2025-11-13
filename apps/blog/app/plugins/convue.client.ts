import { convexClient, createConvexClients, type BetterAuthClient } from "convue";
import { createAuthClient } from 'better-auth/vue'

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig();
  const convexUrl = runtime.public?.convexUrl;
  const convexSiteUrl = runtime.public?.convexSiteUrl;

  if (!convexUrl || typeof convexUrl !== 'string') {
    throw new Error("[convue] Missing or invalid CONVEX_URL. Set it in .env.local");
  }

  if (!convexSiteUrl || typeof convexSiteUrl !== 'string') {
    throw new Error("[convue] Missing or invalid VITE_CONVEX_SITE_URL. Set it in .env.local");
  }

  // Create auth client with local proxy to avoid cross-domain cookie issues
  // Better Auth requires a full URL with protocol, so we construct it from window.location
  const baseURL = `${window.location.protocol}//${window.location.host}/api/auth`

  const authClient = createAuthClient({
    baseURL,
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
