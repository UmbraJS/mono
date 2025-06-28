export default defineNuxtPlugin({
  name: 'better-auth-fetch-plugin',
  enforce: 'pre',
  async setup(nuxtApp) {
    try {
      // Flag if request is cached
      const event = useRequestEvent()
      nuxtApp.payload.isCached = Boolean(event?.context.cache)

      // Only fetch session if we have a real request context (not during prerendering)
      if (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt && !nuxtApp.payload.isCached && event) {
        await useAuth().fetchSession()
      }
    } catch (e) {
      // During prerendering, useRequestEvent() might fail
      // Just skip auth fetching in this case
      console.warn('Auth plugin: Skipping session fetch during prerendering')
    }
  },
})
