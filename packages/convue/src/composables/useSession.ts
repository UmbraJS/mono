import type { Ref } from 'vue'
import type { Session } from './useBetterAuthClient'
import { useBetterAuthClient } from './useBetterAuthClient'

export interface UseSessionReturn {
  /**
   * The current session data, or null if not authenticated
   */
  data: Ref<Session | null>

  /**
   * Whether the session is currently being loaded
   */
  isPending: Ref<boolean>

  /**
   * Any error that occurred while loading the session
   */
  error: Ref<Error | null>
}

/**
 * Composable that provides access to the current Better Auth session
 *
 * This composable returns reactive session data, loading state, and any errors.
 * The session data includes both user information and session metadata.
 *
 * @example
 * ```ts
 * import { useSession } from 'convue'
 *
 * const { data: session, isPending, error } = useSession()
 *
 * // Access user data
 * console.log(session.value?.user.email)
 * ```
 */
export function useSession(): UseSessionReturn {
  const authClient = useBetterAuthClient()

  // Get session data from Better Auth client
  // The useSession method should be available on the client
  if (!authClient.useSession) {
    throw new Error('Better Auth client does not have useSession method')
  }

  const result = authClient.useSession()

  // Return the result as-is, it should match UseSessionReturn
  return result as UseSessionReturn
}
