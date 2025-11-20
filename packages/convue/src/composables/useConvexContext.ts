import type { ConvexVueContext } from '#src/plugin.ts'

/**
 * Returns the Convex plugin context from Nuxt app
 */
export function useConvexContext(): ConvexVueContext {
  // In Nuxt 3, useNuxtApp should be directly imported and called
  // @ts-expect-error - useNuxtApp is auto-imported in Nuxt context
  const nuxtApp = useNuxtApp()

  if (nuxtApp?.$convex) {
    return nuxtApp.$convex as ConvexVueContext
  }

  throw new Error(
    'useConvexContext() is called without a provider. '
    + 'Make sure to provide convex in your Nuxt plugin:\n'
    + 'return { provide: { convex: convexContext } }',
  )
}
