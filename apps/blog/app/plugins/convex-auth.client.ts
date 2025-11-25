/**
 * Sets up authentication for the Convex client
 * Automatically configures Convex to use better-auth tokens
 */
export default defineNuxtPlugin({
  name: 'convex-auth',
  dependsOn: ['convue-client'],
  async setup() {
    const { useConvexClient } = await import('convue')
    const auth = useAuth()

    // Wait for client to be available
    const client = useConvexClient()

    // Set up auth token fetching for Convex
    client.setAuth(async () => {
      try {
        if (!auth.isAuthenticated.value) {
          return null
        }

        const result = await auth.client.token()

        // The response is nested: { data: { data: { token: "..." } }, error: null }
        const token = result?.data?.data?.token || result?.data?.token

        if (token) {
          console.log('[convex-auth] Successfully fetched token')
          return token
        }

        console.warn('[convex-auth] No token in response:', result)
        return null
      }
      catch (error) {
        console.error('[convex-auth] Failed to fetch token:', error)
        return null
      }
    })

    console.log('[convex-auth] Auth setup complete')
  },
})
