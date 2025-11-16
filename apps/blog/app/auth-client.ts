import { createAuthClient } from 'better-auth/vue'
import { convexClient } from 'convue'

// Use local proxy for Better Auth API to ensure cookies work correctly
// The Nuxt server will forward requests to Convex
const baseURL = '/api/auth'

export const authClient = createAuthClient({
  baseURL,
  plugins: [convexClient()],
})
