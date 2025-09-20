import { convexVue, type ConvexVueOptions } from "convue";

export default defineNuxtPlugin((nuxtApp) => {
  const runtime = useRuntimeConfig();
  const convexUrl = runtime.public?.convexUrl;

  if (!convexUrl || typeof convexUrl !== 'string') {
    console.warn("[convue] Missing or invalid CONVEX_URL. Set it in .env.local. Queries will fail.");
    return;
  }

  const options: ConvexVueOptions = {
    url: convexUrl,
    server: false, // Disable SSR to avoid hydration mismatches
  };

  // Install the convex-vue plugin
  nuxtApp.vueApp.use(convexVue, options);
});
