import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig();
  // Prefer explicit convex.url from module config, else public runtime value
  const convexUrl = runtime.public?.convexUrl || process.env.CONVEX_URL;
  if (!convexUrl) {
    // eslint-disable-next-line no-console
    console.warn(
      "[convex] Missing CONVEX_URL. Set it in .env.local. Queries will fail with generic Server Error.",
    );
  }
});
