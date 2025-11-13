import { createAuthClient } from 'better-auth/vue'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

const config = useRuntimeConfig()

export const authClient = createAuthClient({
  baseURL: config.public.convexSiteUrl || 'http://localhost:3000',
  plugins: [convexClient()],
})
