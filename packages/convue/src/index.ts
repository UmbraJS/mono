// Better Auth integration
export { createUseAuth } from './composables/useAuth'
export type { BetterAuthClient, BetterAuthSessionResult, Session } from './composables/useBetterAuthClient'

// Convex composables
export { useConvexClient } from './composables/useConvexClient'
export { useConvexHttpClient } from './composables/useConvexHttpClient'
export { useConvexHttpQuery } from './composables/useConvexHttpQuery'
export { useConvexMutation } from './composables/useConvexMutation'
export { useConvexQuery } from './composables/useConvexQuery'
export { debugLog, setConvueDebug, isConvueDebugEnabled } from './utils/debug'

export * from './plugin'
export { createConvexClients } from './plugin'

// Better Auth plugins - client
export { convexClient } from './plugins/convexClient'

// Better Auth plugins - server
export { convex } from './server/convexPlugin'
export { createApi } from './server/createApi'
export type { CreateAuth } from './server/createApi'
export { createClient, getStaticAuth } from './server/createClient'
export type { ClientConfig, ComponentReference, GenericCtx } from './server/createClient'

export * from './types'
