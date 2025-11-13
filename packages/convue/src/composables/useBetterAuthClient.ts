/**
 * Interface for the Better Auth client
 * This accepts any Better Auth client (React, Vue, or vanilla)
 */

/**
 * Better Auth session result that can be returned by useSession()
 */
export interface BetterAuthSessionResult {
  data: Session | null
  isPending: boolean
  error: Error | null
  refetch?: () => Promise<void>
}

export interface BetterAuthClient {
  useSession?: () => BetterAuthSessionResult | { value: BetterAuthSessionResult }
  getSession?: () => Promise<{ data: Session | null, error: Error | null }>
  signIn: {
    email: (credentials: { email: string, password: string }) => Promise<{ data?: Session, error?: Error }>
    social: (options: { provider: string, callbackURL?: string }) => Promise<{ data?: Session, error?: Error }>
  }
  signOut: () => Promise<{ data?: unknown, error?: Error }>
  convex?: {
    token: () => Promise<{ data: { token: string } | null, error: Error | null }>
  }
}

export interface Session {
  session: {
    id: string
    userId: string
    expiresAt: string
    token?: string
    [key: string]: unknown
  }
  user: {
    id: string
    email: string
    name: string
    emailVerified?: boolean
    [key: string]: unknown
  }
}

/**
 * Composable to access the Better Auth client instance
 * The client must be provided via Nuxt's plugin provide system
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
  try {
    // @ts-expect-error - useNuxtApp is auto-imported in Nuxt context
    const nuxtApp = globalThis.useNuxtApp?.()
    if (nuxtApp?.$betterAuthClient) {
      return nuxtApp.$betterAuthClient as BetterAuthClient
    }
  }
  catch {
    // Not in Nuxt context or useNuxtApp not available
  }

  throw new Error(
    'useBetterAuthClient() is called without a provider. '
    + 'Make sure to provide the authClient in your Nuxt plugin:\n'
    + 'return { provide: { betterAuthClient: authClient } }',
  )
}
