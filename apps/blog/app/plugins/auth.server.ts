export default defineNuxtPlugin({
  name: 'better-auth-fetch-plugin',
  enforce: 'pre',
  async setup(nuxtApp) {
    if (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt) {
      try {
        await useAuth().fetchSession()
      } catch (error) {
        // Log the error but don't fail the app if auth is unavailable
        console.warn('Failed to fetch auth session during SSR:', error)
      }
    }
  },
})
