export default defineNuxtPlugin({
  name: 'better-auth-fetch-plugin',
  enforce: 'pre',
  async setup(nuxtApp) {
    if (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt) {
      await useAuth().fetchSession()
    }
  },
})
