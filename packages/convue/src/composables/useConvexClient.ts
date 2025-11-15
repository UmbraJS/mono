import type { ConvexClient } from 'convex/browser'
import { useConvexContext } from './useConvexContext'

/**
 * Returns the Convex client instance.
 * Note: This only works on the client-side. Use useConvexHttpClient for server-side queries.
 */
export function useConvexClient(): ConvexClient {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    throw new Error(
      'useConvexClient() cannot be called during server-side rendering. '
      + 'The WebSocket client is only available on the client. '
      + 'Use useConvexHttpClient() for server-side queries instead.'
    )
  }

  const convexVueContext = useConvexContext()

  if (!convexVueContext.clientRef.value) {
    throw new Error('Convex client not initialized')
  }

  return convexVueContext.clientRef.value
}
