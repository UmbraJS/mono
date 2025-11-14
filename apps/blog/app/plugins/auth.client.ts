export default defineNuxtPlugin(async (nuxtApp) => {
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
