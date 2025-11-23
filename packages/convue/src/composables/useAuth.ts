import type { Ref } from 'vue'
import { createAuthClient } from 'better-auth/client'
import { computed, ref } from 'vue'
import { convexClient } from '../plugins/convexClient'
import { debugLog } from '../utils/debug.ts'

type BetterAuthSession = import('./useBetterAuthClient').Session

/**
 * Creates an SSR-compatible auth composable for Nuxt
 *
 * This factory function allows the consuming app to provide Nuxt-specific composables
 * that aren't available in the package context.
 *
 * @example
 * In your Nuxt app's composables/useAuth.ts:
 * ```ts
 * import { createUseAuth } from 'convue'
 *
 * export const useAuth = createUseAuth({
 *   useRequestURL,
 *   useRequestHeaders,
 *   useState,
 * })
 * ```
 */
export function createUseAuth<TSession extends BetterAuthSession = BetterAuthSession>(nuxtComposables: {
  useRequestURL: () => URL
  useRequestHeaders: () => Record<string, string>
  useState: <T>(key: string, init: () => T) => Ref<T>
  isServer: boolean
  isClient: boolean
}) {
  return function useAuth() {
    type SessionUser = TSession['user']

    const url = nuxtComposables.useRequestURL()
    const headers = nuxtComposables.isServer ? nuxtComposables.useRequestHeaders() : undefined

    const client = createAuthClient({
      baseURL: url.origin,
      fetchOptions: {
        headers,
      },
      plugins: [convexClient()],
    })

    // Use useState for SSR-safe reactive state
    const session = nuxtComposables.useState<TSession | null>('auth:session', (): TSession | null => null)
    const sessionFetching = nuxtComposables.isServer
      ? ref(false)
      : nuxtComposables.useState<boolean>('auth:sessionFetching', () => false)

    const user = computed<SessionUser | null>(() => session.value?.user ?? null)
    const isAuthenticated = computed(() => !!session.value)
    const isLoading = computed(() => sessionFetching.value)

    const fetchSession = async (): Promise<TSession | null> => {
      if (sessionFetching.value) {
        return session.value
      }
      sessionFetching.value = true
      try {
        const { data } = await client.getSession({
          fetchOptions: {
            headers,
          },
        })
        const typedData = (data ?? null) as TSession | null
        session.value = typedData
        return typedData
      }
      catch (error) {
        debugLog('[convue] Failed to fetch auth session', error)
        session.value = null
        return null
      }
      finally {
        sessionFetching.value = false
      }
    }

    // Listen for session changes on client
    if (nuxtComposables.isClient) {
      client.$store.listen('$sessionSignal', async (signal) => {
        if (!signal)
          return
        await fetchSession()
      })
    }

    return {
      session,
      user,
      isAuthenticated,
      isLoading,
      client,
      fetchSession,
    }
  }
}
