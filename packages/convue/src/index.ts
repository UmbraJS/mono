// Better Auth integration
export { useAuth } from './composables/useAuth'
export { useBetterAuthClient } from './composables/useBetterAuthClient'
export type { BetterAuthClient } from './composables/useBetterAuthClient'

// Convex composables
export { useConvexClient } from './composables/useConvexClient'
export { useConvexHttpClient } from './composables/useConvexHttpClient'
export { useConvexHttpQuery } from './composables/useConvexHttpQuery'
export { useConvexMutation } from './composables/useConvexMutation'
export { useConvexQuery } from './composables/useConvexQuery'
export { useSession } from './composables/useSession'

export * from './plugin'
export { createConvexClients } from './plugin'

// Better Auth plugins - client
export { convexClient } from './plugins/convexClient'

// Better Auth plugins - server
export { convex } from './server/convexPlugin'
export { createApi } from './server/createApi'
export type { CreateAuth } from './server/createApi'
export { createClient } from './server/createClient'
export type { ClientConfig, ComponentReference, GenericCtx } from './server/createClient'

export * from './types'
