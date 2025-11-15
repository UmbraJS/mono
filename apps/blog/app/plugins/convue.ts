import { createConvexClients } from "convue";
import { ConvexHttpClient } from "convex/browser";

export default defineNuxtPlugin({
  name: 'convue-client',
  enforce: 'pre',
  setup() {
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

    // Create Convex clients
    // - On client: create both WebSocket client and HTTP client
    // - On server: create only HTTP client (WebSocket doesn't work in SSR)
    // - During prerendering: create dummy context
    const convexContext = isPrerendering
      ? {
        clientRef: { value: undefined },
        httpClientRef: { value: undefined },
        initClient: () => { },
      }
      : import.meta.client
        ? createConvexClients(convexUrl!)
        : {
          // Server-side: only HTTP client for queries (synchronous initialization)
          clientRef: { value: undefined },
          httpClientRef: { value: new ConvexHttpClient(convexUrl!) },
          initClient: () => { },
        }

    // Provide Convex clients
    console.log('[convue plugin] Providing context:', {
      isPrerendering,
      isClient: import.meta.client,
      isServer: import.meta.server,
      hasHttpClient: !!convexContext.httpClientRef.value,
    })

    return {
      provide: {
        convex: {
          options: { url: convexUrl || '', server: true },
          ...convexContext,
        },
      },
    }
  },
});
