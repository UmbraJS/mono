import type { Ref } from 'vue'
import { createAuthClient } from 'better-auth/client'
import { computed, ref } from 'vue'
import { convexClient } from '../plugins/convexClient'

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
export function createUseAuth(nuxtComposables: {
  useRequestURL: () => URL
  useRequestHeaders: () => Record<string, string>
  useState: <T>(key: string, init: () => T) => Ref<T>
  isServer: boolean
  isClient: boolean
}) {
  return function useAuth() {
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
    type SessionResponse = Awaited<ReturnType<typeof client.getSession>>['data']
    const session = nuxtComposables.useState<SessionResponse>('auth:session', () => null)
    const sessionFetching = nuxtComposables.isServer ? ref(false) : nuxtComposables.useState('auth:sessionFetching', () => false)

    const user = computed(() => session.value?.user || null)
    const isAuthenticated = computed(() => !!session.value)
    const isLoading = computed(() => sessionFetching.value)

    const fetchSession = async () => {
      if (sessionFetching.value) {
        return
      }
      sessionFetching.value = true
      const { data } = await client.getSession({
        fetchOptions: {
          headers,
        },
      })
      session.value = data || null
      sessionFetching.value = false
      return data
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
