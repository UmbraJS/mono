import type { ConvexClientOptions } from 'convex/browser'
import type { ObjectPlugin, Ref } from 'vue'
import type { BetterAuthClient } from './composables/useBetterAuthClient'
import { ConvexClient, ConvexHttpClient } from 'convex/browser'
import { shallowRef } from 'vue'
import { provideBetterAuthClient } from './composables/useBetterAuthClient'

export interface ConvexAuthOptions {
  forceRefreshToken: boolean
}

export interface ConvexVueOptions {
  url: string
  clientOptions?: ConvexClientOptions
  auth?: ConvexAuthOptions

  /**
   * Better Auth client instance for authentication
   * When provided, the plugin will set up authentication integration automatically
   */
  authClient?: BetterAuthClient

  /**
   * If true, the global default client wont be initialized automatically,
   * you will need to init the client yourself before using the composables.
   */
  manualInit?: boolean
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

export const convexVue: ObjectPlugin<ConvexVueOptions> = {
  install(app, initialOptions) {
    const clientRef = shallowRef<ConvexClient>()
    const httpClientRef = shallowRef<ConvexHttpClient>()

    const initClient = (options?: ConvexVueOptions): void => {
      options ??= initialOptions
      clientRef.value = new ConvexClient(options.url, options.clientOptions)
      httpClientRef.value = new ConvexHttpClient(options.url, {
        logger: options?.clientOptions?.logger,
        skipConvexDeploymentUrlCheck: options.clientOptions?.skipConvexDeploymentUrlCheck,
      })
    }

    if (!initialOptions.manualInit)
      initClient(initialOptions)

    // Provide Better Auth client if provided
    if (initialOptions.authClient) {
      provideBetterAuthClient(app, initialOptions.authClient)
    }

    app.provide<ConvexVueContext>('convex-vue', {
      options: initialOptions,
      clientRef,
      httpClientRef,
      initClient,
    })
  },
}
