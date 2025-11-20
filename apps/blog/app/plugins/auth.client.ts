export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  if (config.public.authFetchDisabled) {
    if (import.meta.dev) {
      console.warn('[auth] Skipping client-side session fetch (disabled via config)')
    }
    return
  }
  if (!nuxtApp.payload.serverRendered) {
    // Client-side navigation, fetch session
    await useAuth().fetchSession()
  }
  else if (nuxtApp.payload.prerenderedAt) {
    // Prerendered page, wait for mount to avoid hydration mismatch
    nuxtApp.hook('app:mounted', async () => {
      await useAuth().fetchSession()
    })
  }
})
