import type { ConvexVueContext } from '#src/plugin.ts'

/**
 * Returns the Convex plugin context from Nuxt app
 */
export function useConvexContext(): ConvexVueContext {
  try {
    // @ts-expect-error - useNuxtApp is auto-imported in Nuxt context
    const nuxtApp = globalThis.useNuxtApp?.()
    if (nuxtApp?.$convex) {
      return nuxtApp.$convex as ConvexVueContext
    }
  }
  catch {
    // Not in Nuxt context
  }

  throw new Error(
    'useConvexContext() is called without a provider. '
    + 'Make sure to provide convex in your Nuxt plugin:\n'
    + 'return { provide: { convex: convexContext } }',
  )
}
