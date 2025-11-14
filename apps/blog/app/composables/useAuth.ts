import { createUseAuth } from 'convue'

/**
 * SSR-compatible auth composable for this Nuxt app
 *
 * Uses the factory from convue with Nuxt's composables.
 * This allows the package to work with SSR while staying framework-agnostic.
 */
export const useAuth = createUseAuth({
  useRequestURL,
  useRequestHeaders,
  useState,
  isServer: import.meta.server,
  isClient: import.meta.client,
})
