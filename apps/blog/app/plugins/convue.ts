import { createConvexClients } from "convue";

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig();
  const convexUrl = runtime.public?.convexUrl;
  const convexSiteUrl = runtime.public?.convexSiteUrl;

  // During prerendering/build, Convex isn't needed - provide dummy context
  const isPrerendering = import.meta.server && (!convexUrl || !convexSiteUrl);

  if (!isPrerendering) {
    // Only validate when NOT prerendering
    if (!convexUrl || typeof convexUrl !== 'string') {
      throw new Error("[convue] Missing or invalid CONVEX_URL. Set it in .env.local");
    }

    if (!convexSiteUrl || typeof convexSiteUrl !== 'string') {
      throw new Error("[convue] Missing or invalid VITE_CONVEX_SITE_URL. Set it in .env.local");
    }
  }

  // Create Convex clients (only on client side to avoid WebSocket issues)
  const convexContext = import.meta.client && !isPrerendering
    ? createConvexClients(convexUrl!)
    : {
      clientRef: { value: undefined },
      httpClientRef: { value: undefined },
      initClient: () => { },
    }

  // Provide Convex clients
  return {
    provide: {
      convex: {
        options: { url: convexUrl || '', server: false },
        ...convexContext,
      },
    },
  }
});
