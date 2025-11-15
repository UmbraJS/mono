import { createAuthClient } from 'better-auth/vue'
import { convexClient } from 'convue'

// Better Auth API is hosted on Convex site URL
// This will be replaced at build time by Vite
const baseURL = `${import.meta.env.NUXT_PUBLIC_CONVEX_SITE_URL || 'http://127.0.0.1:8187'}/api/auth`

export const authClient = createAuthClient({
  baseURL,
  plugins: [convexClient()],
})
