import { convexClient, convexVue, type ConvexVueOptions } from "convue";
import { createAuthClient } from 'better-auth/vue'

export default defineNuxtPlugin((nuxtApp) => {
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

  const options: ConvexVueOptions = {
    url: convexUrl,
    server: false, // Disable SSR to avoid hydration mismatches
    authClient: authClient as unknown as never, // Add Better Auth client
  };

  // Install the convex-vue plugin
  nuxtApp.vueApp.use(convexVue, options);
});
