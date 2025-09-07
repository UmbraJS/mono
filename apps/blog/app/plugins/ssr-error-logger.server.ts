export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (err: unknown) => {
    // Surface SSR errors during prerender
    console.error('[nuxt][app:error]', err)
  })

  // Vue component-level error hook
  nuxtApp.hook('vue:error', (err: unknown, _instance: unknown, info: string) => {
    console.error('[nuxt][vue:error]', info, err)
  })
})
