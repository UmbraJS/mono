import { convexVue } from "convue";

export default defineNuxtPlugin((nuxtApp) => {
  const convexUrl = process.env.CONVEX_URL;

  if (!convexUrl || typeof convexUrl !== 'string') {
    console.warn("[convue] Missing or invalid CONVEX_URL. Set it in .env.local. Queries will fail.");
    return;
  }

  // Install the convex-vue plugin
  nuxtApp.vueApp.use(convexVue, {
    url: convexUrl,
    server: true, // Enable SSR for now to avoid hydration mismatches
  });
});
