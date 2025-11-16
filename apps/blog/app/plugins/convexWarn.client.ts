export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const convexUrl = config.public.convexUrl

  if (!convexUrl) {
    console.warn(
      "[convex] Missing CONVEX_URL. Set it in .env.local. Queries will fail with generic Server Error.",
    )
  }
})
