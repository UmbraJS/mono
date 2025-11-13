import type { App } from 'vue'
import { inject } from 'vue'

/**
 * Symbol key for providing/injecting the Better Auth client
 */
export const BETTER_AUTH_CLIENT_KEY = Symbol('better-auth-client')

/**
 * Interface for the Better Auth client
 * This accepts any Better Auth client (React, Vue, or vanilla)
 */
export interface BetterAuthClient {
  useSession?: () => any
  getSession?: (opts?: {
    fetchOptions?: RequestInit
  }) => Promise<{ data: Session | null, error: Error | null }>
  convex?: {
    token: () => Promise<{ data: { token: string } | null, error: Error | null }>
  }
  [key: string]: any
}

export interface Session {
  session: {
    id: string
    userId: string
    expiresAt: string
    [key: string]: any
  }
  user: {
    id: string
    email: string
    name: string
    [key: string]: any
  }
}

/**
 * Composable to access the Better Auth client instance
 * The client must be provided via Vue's provide/inject system
 *
 * @example
 * ```ts
 * import { useBetterAuthClient } from 'convue'
 *
 * const authClient = useBetterAuthClient()
 * await authClient.signIn.email({ email, password })
 * ```
 */
export function useBetterAuthClient(): BetterAuthClient {
  const client = inject<BetterAuthClient>(BETTER_AUTH_CLIENT_KEY)

  if (!client) {
    throw new Error(
      'useBetterAuthClient() is called without a provider. '
      + 'Make sure to provide the authClient when installing the convexVue plugin:\n'
      + 'app.use(convexVue, { url: "...", authClient })',
    )
  }

  return client
}

/**
 * Helper to provide the Better Auth client to the app
 * This is typically called internally by the convexVue plugin
 *
 * @internal
 */
export function provideBetterAuthClient(app: App, client: BetterAuthClient): void {
  app.provide(BETTER_AUTH_CLIENT_KEY, client)
}
