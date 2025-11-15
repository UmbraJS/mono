import { createAuthClient } from 'better-auth/vue'
import { convexClient } from 'convue'

// Better Auth API is hosted on Convex site URL, not Vercel app URL
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL || 'http://127.0.0.1:8187'
const baseURL = `${convexSiteUrl}/api/auth`

export const authClient = createAuthClient({
  baseURL,
  plugins: [convexClient()],
})
