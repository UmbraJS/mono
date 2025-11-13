import type { Ref } from 'vue'
import type { BetterAuthClient, BetterAuthSessionResult, Session } from './useBetterAuthClient'
import { computed, isRef, ref, watch } from 'vue'
import { useBetterAuthClient } from './useBetterAuthClient'
import { useConvexClient } from './useConvexClient'

export interface UseAuthReturn {
  /**
   * The current session data, or null if not authenticated
   */
  session: Ref<Session | null>

  /**
   * Whether authentication is currently loading
   */
  isLoading: Ref<boolean>

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: Ref<boolean>

  /**
   * Any error that occurred while loading the session
   */
  error: Ref<Error | null>

  /**
   * The Better Auth client instance for auth operations
   */
  client: BetterAuthClient

  /**
   * Manually refetch the session data
   */
  refetch: () => Promise<void>

  /**
   * Function to fetch a Convex auth token for the current session
   * This is used internally by the Convex client
   */
  fetchAccessToken: () => Promise<string | null>
}

/**
 * Unified composable for all authentication concerns
 *
 * This is the main auth composable that provides:
 * - Session data and authentication state
 * - Loading and error states
 * - Better Auth client for sign in/out operations
 * - Session refetch capability
 * - Automatic Convex client authentication
 *
 * @example
 * ```ts
 * import { useAuth } from 'convue'
 *
 * const {
 *   session,           // Current user session
 *   isAuthenticated,   // Boolean auth state
 *   isLoading,         // Loading state
 *   client,            // Better Auth client
 *   refetch            // Refetch session
 * } = useAuth()
 *
 * // Sign in
 * await client.signIn.email({ email, password })
 *
 * // Sign out
 * await client.signOut()
 *
 * // Access user data
 * console.log(session.value?.user.email)
 * ```
 */
export function useAuth(): UseAuthReturn {
  const authClient = useBetterAuthClient()
  const convexClient = useConvexClient()

  // Ensure required methods exist
  if (!authClient.useSession) {
    throw new Error('Better Auth client is missing useSession method')
  }

  if (!authClient.convex?.token) {
    throw new Error('Better Auth client is missing convex.token method')
  }

  // Get session data from Better Auth
  // The return type varies based on the Better Auth implementation
  const sessionResult = authClient.useSession()

  // Better Auth Vue may return:
  // 1. A ref containing { data, isPending, error } object
  // 2. { data, isPending, error } object directly
  // 3. A direct ref to session data
  let session: Ref<Session | null>
  let isPending: Ref<boolean>
  let error: Ref<Error | null>
  let refetch: () => Promise<void>

  // Unwrap ref if needed
  const unwrapped = isRef(sessionResult) ? sessionResult.value : sessionResult

  if (unwrapped && typeof unwrapped === 'object') {
    // Check if it's the { data, isPending, error } structure
    if ('data' in unwrapped && 'isPending' in unwrapped) {
      // It's a query-like structure from Better Auth Vue
      // The sessionResult itself is a reactive ref, so we need to access properties reactively
      if (isRef(sessionResult)) {
        // Access properties from the ref reactively using computed
        session = computed(() => (sessionResult.value as BetterAuthSessionResult).data)
        isPending = computed(() => (sessionResult.value as BetterAuthSessionResult).isPending)
        error = computed(() => (sessionResult.value as BetterAuthSessionResult).error)
        refetch = (sessionResult.value as BetterAuthSessionResult).refetch || (async () => { })
      }
      else {
        // It's a plain object, wrap individual properties
        const result = unwrapped as BetterAuthSessionResult
        session = ref(result.data)
        isPending = ref(result.isPending)
        error = ref(result.error)
        refetch = result.refetch || (async () => { })
      }
    }
    else {
      // It's direct session data
      session = ref(unwrapped as Session | null)
      isPending = ref(false)
      error = ref(null)
      refetch = async () => { }
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
      // Return null on error - Convex will treat this as unauthenticated
      // This can happen if the session expired or the token endpoint is unavailable
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
        // Convex setAuth expects an async function that returns the token
        convexClient.setAuth(async () => {
          const token = await fetchAccessToken()
          return token
        })
      }
      else {
        // User is not authenticated, clear auth
        convexClient.setAuth(async () => null)
      }
    },
    { immediate: false },
  )

  return {
    session,
    isLoading,
    isAuthenticated,
    error: error || ref(null),
    client: authClient,
    refetch,
    fetchAccessToken,
  }
}
