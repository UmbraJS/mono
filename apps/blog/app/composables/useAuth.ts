import { createUseAuth, type Session } from 'convue'
import type { Doc } from '~/convex/_generated/dataModel'

export type AuthUser = Session['user'] & Doc<'user'>

export type AuthSession = Session & { user: AuthUser }

/**
 * SSR-compatible auth composable for this Nuxt app
 *
 * Uses the factory from convue with Nuxt's composables.
 * This allows the package to work with SSR while staying framework-agnostic.
 */
export const useAuth = createUseAuth<AuthSession>({
  useRequestURL,
  useRequestHeaders,
  useState,
  isServer: import.meta.server,
  isClient: import.meta.client,
})
