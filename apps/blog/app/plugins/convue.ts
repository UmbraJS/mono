import { defineNuxtPlugin } from "#app";
import { convexVue } from "convue";

export default defineNuxtPlugin({
  name: "convue",
  parallel: false,
  setup(nuxtApp) {
    const runtime = useRuntimeConfig();

    // Get the Convex URL from runtime config or environment
    const convexUrl = runtime.public?.convexUrl || process.env.CONVEX_URL;

    if (!convexUrl) {
      console.warn(
        "[convue] Missing CONVEX_URL. Set it in .env.local. Queries will fail."
      );
      return;
    }

    // Install the convex-vue plugin before components are rendered
    nuxtApp.vueApp.use(convexVue, {
      url: convexUrl,
      server: import.meta.server ? false : undefined, // Disable server-side queries in Nuxt SSR
    });
  }
});
