import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useBetterAuthClient } from './useBetterAuthClient'
import { useConvexClient } from './useConvexClient'

export interface UseAuthReturn {
  /**
   * Whether authentication is currently loading
   */
  isLoading: Ref<boolean>

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: Ref<boolean>

  /**
   * Function to fetch a Convex auth token for the current session
   * This is used internally by the Convex client
   */
  fetchAccessToken: () => Promise<string | null>
}

/**
 * Composable that provides authentication state and token management
 * for integrating Better Auth with Convex.
 *
 * This composable:
 * - Tracks authentication state (isLoading, isAuthenticated)
 * - Provides a token fetcher for Convex client authentication
 * - Automatically sets/clears auth on the Convex client
 *
 * @example
 * ```ts
 * import { useAuth } from 'convue'
 *
 * const { isAuthenticated, isLoading } = useAuth()
 * ```
 */
export function useAuth(): UseAuthReturn {
  const authClient = useBetterAuthClient()
  const convexClient = useConvexClient()

  // Ensure required methods exist
  if (!authClient.useSession || !authClient.convex?.token) {
    throw new Error('Better Auth client is missing required methods (useSession or convex.token)')
  }

  // TODO - This type is any? How come?
  // Get session data from Better Auth
  const sessionResult = authClient.useSession()

  // Better Auth Vue returns a readonly ref object, not { data, isPending }
  // Handle both possible return structures
  let session: any
  let isPending: any

  if (sessionResult && typeof sessionResult === 'object') {
    // Check if it's the { data, isPending, error } structure
    if ('data' in sessionResult && 'isPending' in sessionResult) {
      session = sessionResult.data
      isPending = sessionResult.isPending
    }
    else {
      // It might be a direct readonly ref structure
      session = ref(sessionResult)
      isPending = ref(false)
    }
  }
  else {
    throw new Error('Better Auth useSession() returned unexpected value')
  }

  // Compute authentication state
  const isLoading = computed(() => isPending?.value ?? false)
  const isAuthenticated = computed(() => session?.value !== null && session?.value !== undefined)

  // Session ID for tracking changes
  const sessionId = computed(() => session?.value?.session?.id ?? null)

  /**
   * Fetch a Convex auth token from Better Auth
   */
  const fetchAccessToken = async (): Promise<string | null> => {
    try {
      const { data } = await authClient.convex!.token()
      return data?.token || null
    }
    catch {
      return null
    }
  }

  // Watch for session changes and update Convex client auth
  watch(
    sessionId,
    (newSessionId) => {
      // Don't do anything while still loading
      if (isLoading.value)
        return

      if (newSessionId) {
        // User is authenticated, set auth on Convex client
        // Convex expects an object with fetchToken property
        convexClient.setAuth({ fetchToken: fetchAccessToken } as any)
      }
      else {
        // User is not authenticated, clear auth by passing null
        convexClient.setAuth(null as any)
      }
    },
    { immediate: false },
  )

  return {
    isLoading,
    isAuthenticated,
    fetchAccessToken,
  }
}
