import { createAuthClient } from 'better-auth/vue'
import { convexClient } from 'convue'

// Better Auth requires a full URL with protocol
const baseURL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.host}/api/auth`
  : 'http://localhost:3001/api/auth'

export const authClient = createAuthClient({
  baseURL,
  plugins: [convexClient()],
})
