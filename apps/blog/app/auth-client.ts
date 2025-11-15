import { createAuthClient } from 'better-auth/vue'
import { convexClient } from 'convue'

// Better Auth API is hosted on Convex site URL, not Vercel app URL
// Use runtime config to get the convex site URL
const config = useRuntimeConfig()
const convexSiteUrl = config.public.convexSiteUrl || 'http://127.0.0.1:8187'
const baseURL = `${convexSiteUrl}/api/auth`

export const authClient = createAuthClient({
  baseURL,
  plugins: [convexClient()],
})
