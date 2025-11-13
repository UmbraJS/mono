import type { ConvexClientOptions } from 'convex/browser'
import type { Ref } from 'vue'
import { ConvexClient, ConvexHttpClient } from 'convex/browser'
import { shallowRef } from 'vue'

export interface ConvexAuthOptions {
  forceRefreshToken: boolean
}

export interface ConvexVueOptions {
  url: string
  clientOptions?: ConvexClientOptions
  auth?: ConvexAuthOptions
  /**
   * Set to `false` to disable queries during server-side rendering.
   * This global option can be overridden for individual queries by setting their `server` option to `true`
   */
  server?: boolean
}

export interface ConvexVueContext {
  options: ConvexVueOptions
  clientRef: Ref<ConvexClient | undefined>
  httpClientRef: Ref<ConvexHttpClient | undefined>

  /**
   * (Re-)init the global convex client with specified options.
   */
  initClient: (options?: ConvexVueOptions) => void
}

/**
 * Creates Convex clients to be provided in a Nuxt plugin
 */
export function createConvexClients(url: string, clientOptions?: ConvexClientOptions) {
  const clientRef = shallowRef<ConvexClient>()
  const httpClientRef = shallowRef<ConvexHttpClient>()

  const initClient = (options?: ConvexVueOptions): void => {
    const opts = options ?? { url, clientOptions }
    clientRef.value = new ConvexClient(opts.url, opts.clientOptions)
    httpClientRef.value = new ConvexHttpClient(opts.url, {
      logger: opts?.clientOptions?.logger,
      skipConvexDeploymentUrlCheck: opts.clientOptions?.skipConvexDeploymentUrlCheck,
    })
  }

  initClient()

  return {
    clientRef,
    httpClientRef,
    initClient,
  }
}
