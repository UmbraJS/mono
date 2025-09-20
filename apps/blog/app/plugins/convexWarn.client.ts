export default defineNuxtPlugin(() => {
  // Prefer explicit convex.url from module config, else public runtime value
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    console.warn(
      "[convex] Missing CONVEX_URL. Set it in .env.local. Queries will fail with generic Server Error.",
    );
  }
});
