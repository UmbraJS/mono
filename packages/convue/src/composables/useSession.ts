import type { Ref } from 'vue'
import type { Session } from './useBetterAuthClient'

import { ref } from 'vue'
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

  /**
   * Manually refetch the session data
   */
  refetch: () => Promise<void>
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

  // Handle both return types from Better Auth:
  // 1. { data, isPending, error } - from Better Auth React/Next
  // 2. Direct Ref<Session> - from Better Auth Vue
  if (result && typeof result === 'object') {
    if ('data' in result && 'isPending' in result) {
      // Already in the correct format, but need to ensure refetch exists
      const typedResult = result as any
      return {
        data: typedResult.data,
        isPending: typedResult.isPending,
        error: typedResult.error || ref(null),
        refetch: typedResult.refetch || (async () => { }),
      } as UseSessionReturn
    }
    else {
      // It's a direct ref, wrap it in the expected structure
      return {
        data: result as Ref<Session | null>,
        isPending: ref(false),
        error: ref(null),
        refetch: async () => { },
      }
    }
  }

  throw new Error('Better Auth useSession() returned unexpected value')
}
