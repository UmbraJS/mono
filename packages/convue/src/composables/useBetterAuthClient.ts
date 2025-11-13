/**
 * Interface for the Better Auth client
 * This accepts any Better Auth client (React, Vue, or vanilla)
 */
export interface BetterAuthClient {
  useSession?: () => any
  getSession?: (...args: any[]) => Promise<any>
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
