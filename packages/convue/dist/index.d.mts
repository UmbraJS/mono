import * as vue1 from "vue";
import * as vue3 from "vue";
import { MaybeRefOrGetter, Ref } from "vue";
import * as convex_server0 from "convex/server";
import * as convex_server5 from "convex/server";
import { FunctionArgs, FunctionReference, FunctionReturnType, GenericDataModel, SchemaDefinition } from "convex/server";
import { ConvexClient, ConvexClientOptions, ConvexHttpClient, OptimisticUpdate } from "convex/browser";
import * as better_auth_adapters13 from "better-auth/adapters";

//#region src/composables/useAuth.d.ts
interface UseAuthReturn {
  /**
   * Whether authentication is currently loading
   */
  isLoading: Ref<boolean>;
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: Ref<boolean>;
  /**
   * Function to fetch a Convex auth token for the current session
   * This is used internally by the Convex client
   */
  fetchAccessToken: () => Promise<string | null>;
}
/**
 * Composable that provides authentication state and token management
 * for integrating Better Auth with Convex.
 *
 * This composable:
 * - Tracks authentication state (isLoading, isAuthenticated)
 * - Provides a token fetcher for Convex client authentication
 * - Automatically sets/clears auth on the Convex client
 *
 * @example
 * ```ts
 * import { useAuth } from 'convue'
 *
 * const { isAuthenticated, isLoading } = useAuth()
 * ```
 */
declare function useAuth(): UseAuthReturn;

//#endregion
//#region src/composables/useBetterAuthClient.d.ts
/**
 * Interface for the Better Auth client
 * This accepts any Better Auth client (React, Vue, or vanilla)
 */
interface BetterAuthClient {
  useSession?: () => any;
  getSession?: (...args: any[]) => Promise<any>;
  convex?: {
    token: () => Promise<{
      data: {
        token: string;
      } | null;
      error: Error | null;
    }>;
  };
  [key: string]: any;
}
interface Session {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    [key: string]: any;
  };
  user: {
    id: string;
    email: string;
    name: string;
    [key: string]: any;
  };
}
/**
 * Composable to access the Better Auth client instance
 * The client must be provided via Nuxt's plugin provide system
 *
 * @example
 * ```ts
 * import { useBetterAuthClient } from 'convue'
 *
 * const authClient = useBetterAuthClient()
 * await authClient.signIn.email({ email, password })
 * ```
 */
declare function useBetterAuthClient(): BetterAuthClient;

//#endregion
//#region src/composables/useConvexClient.d.ts
/**
 * Returns the Convex client instance.
 */
declare function useConvexClient(): ConvexClient;

//#endregion
//#region src/composables/useConvexHttpClient.d.ts
/**
 * Returns the Convex HTTP client instance.
 */
declare function useConvexHttpClient(): ConvexHttpClient;

//#endregion
//#region src/composables/useConvexHttpQuery.d.ts
/**
 * A composable that returns a function to call a Convex query via the Convex HTTP API.
 * This is useful for server-side rendering or static site generation.
 */
declare function useConvexHttpQuery<Query extends FunctionReference<'query'>>(query: Query, args?: MaybeRefOrGetter<FunctionArgs<Query>>): Promise<FunctionReturnType<Query>>;

//#endregion
//#region src/composables/useConvexMutation.d.ts
interface MutationOptions<Mutation extends FunctionReference<'mutation'>> {
  optimisticUpdate?: OptimisticUpdate<FunctionArgs<Mutation>>;
}
/**
 * Appliess a mutation to the Convex server.
 */
declare function useConvexMutation<Mutation extends FunctionReference<'mutation'>>(mutationReference: Mutation, {
  optimisticUpdate
}?: MutationOptions<Mutation>): {
  mutate: (args: MaybeRefOrGetter<FunctionArgs<Mutation>>) => Promise<convex_server0.FunctionReturnType<Mutation>>;
  error: vue1.Ref<Error | null, Error | null>;
  isPending: vue1.ComputedRef<boolean>;
};

//#endregion
//#region src/types.d.ts
type IsOptionalKey<T, K extends keyof T> = object extends Pick<T, K> ? true : false;
type AreAllPropertiesOptional<T> = true extends { [K in keyof T]: IsOptionalKey<T, K> extends true ? never : true }[keyof T] ? false : true;
type OptionalRestArgs<FuncRef extends FunctionReference<any>> = AreAllPropertiesOptional<FuncRef['_args']> extends true ? [args?: MaybeRefOrGetter<FuncRef['_args']>] : [args: MaybeRefOrGetter<FuncRef['_args']>];
type OptionalRestArgsAndOptions<FuncRef extends FunctionReference<any>, Options> = AreAllPropertiesOptional<FuncRef['_args']> extends true ? [args?: MaybeRefOrGetter<FuncRef['_args']>, options?: Options] : [args: MaybeRefOrGetter<FuncRef['_args']>, options?: Options];

//#endregion
//#region src/composables/useConvexQuery/types.d.ts
interface UseConvexQueryOptions {
  /**
   * Set to `false` to disable this query during server-side rendering.
   */
  server?: boolean;
}
interface UseConvexQueryReturn<Query extends FunctionReference<'query'>> {
  data: Ref<FunctionReturnType<Query> | undefined>;
  error: Ref<Error | null>;
  isPending: Ref<boolean>;
  suspense: () => Promise<FunctionReturnType<Query>>;
  refetch: () => Promise<FunctionReturnType<Query>>;
}
interface UseConvexQueryReturn<Query extends FunctionReference<'query'>> {
  data: Ref<FunctionReturnType<Query> | undefined>;
  error: Ref<Error | null>;
  isPending: Ref<boolean>;
  suspense: () => Promise<FunctionReturnType<Query>>;
  refetch: () => Promise<FunctionReturnType<Query>>;
}

//#endregion
//#region src/composables/useConvexQuery/index.d.ts
/**
 * A composable that provides a Realtime Convex query. It supports reactivity and can be used both on the client and server side.
 * @param query The Convex query function.
 * @param rest The arguments and options for the query.
 * @returns The result of the query.
 */
declare function useConvexQuery<Query extends FunctionReference<'query'>>(query: Query, ...rest: OptionalRestArgsAndOptions<Query, UseConvexQueryOptions>): UseConvexQueryReturn<Query>;

//#endregion
//#region src/composables/useSession.d.ts
interface UseSessionReturn {
  /**
   * The current session data, or null if not authenticated
   */
  data: Ref<Session | null>;
  /**
   * Whether the session is currently being loaded
   */
  isPending: Ref<boolean>;
  /**
   * Any error that occurred while loading the session
   */
  error: Ref<Error | null>;
}
/**
 * Composable that provides access to the current Better Auth session
 *
 * This composable returns reactive session data, loading state, and any errors.
 * The session data includes both user information and session metadata.
 *
 * @example
 * ```ts
 * import { useSession } from 'convue'
 *
 * const { data: session, isPending, error } = useSession()
 *
 * // Access user data
 * console.log(session.value?.user.email)
 * ```
 */
declare function useSession(): UseSessionReturn;

//#endregion
//#region src/plugin.d.ts
interface ConvexAuthOptions {
  forceRefreshToken: boolean;
}
interface ConvexVueOptions {
  url: string;
  clientOptions?: ConvexClientOptions;
  auth?: ConvexAuthOptions;
  /**
   * Set to `false` to disable queries during server-side rendering.
   * This global option can be overridden for individual queries by setting their `server` option to `true`
   */
  server?: boolean;
}
interface ConvexVueContext {
  options: ConvexVueOptions;
  clientRef: Ref<ConvexClient | undefined>;
  httpClientRef: Ref<ConvexHttpClient | undefined>;
  /**
   * (Re-)init the global convex client with specified options.
   */
  initClient: (options?: ConvexVueOptions) => void;
}
/**
 * Creates Convex clients to be provided in a Nuxt plugin
 */
declare function createConvexClients(url: string, clientOptions?: ConvexClientOptions): {
  clientRef: vue3.ShallowRef<ConvexClient | undefined, ConvexClient | undefined>;
  httpClientRef: vue3.ShallowRef<ConvexHttpClient | undefined, ConvexHttpClient | undefined>;
  initClient: (options?: ConvexVueOptions) => void;
};

//#endregion
//#region src/plugins/convexClient.d.ts
/**
 * Better Auth client plugin for Convex integration
 *
 * This plugin adds a `token()` method to the auth client that fetches
 * a Convex authentication token from the Better Auth backend.
 */
declare function convexClient(): {
  id: string;
  getActions: ($fetch: any) => {
    token: () => Promise<{
      data: {
        token: string;
      };
    }>;
  };
};

//#endregion
//#region src/server/convexPlugin.d.ts
/**
 * Better Auth server plugin for Convex integration
 *
 * This plugin configures Better Auth to work with Convex's database
 * and handles Convex-specific authentication logic.
 */
/**
 * Convex plugin for Better Auth
 *
 * This makes Better Auth compatible with Convex by:
 * - Configuring the adapter for Convex's database structure
 * - Handling ID generation (Convex uses _id instead of id)
 * - Setting up proper field mappings
 */
declare function convex(): {
  id: string;
  init(_ctx: any): {
    options: {
      advanced: {
        generateId: false;
      };
    };
  };
};

//#endregion
//#region src/server/createApi.d.ts
type CreateAuth<_DataModel extends GenericDataModel> = ((ctx: any) => any) | ((ctx: any, opts?: {
  optionsOnly?: boolean;
}) => any);
/**
 * Generates the CRUD operations that Better Auth needs to work with Convex
 */
declare function createApi<DataModel extends GenericDataModel, Schema extends SchemaDefinition<any, any>>(_schema: Schema, _createAuth: CreateAuth<DataModel>): {
  /**
   * Create a new document
   */
  create: convex_server5.RegisteredMutation<"public", any, Promise<any>>;
  /**
   * Find a single document
   */
  findOne: convex_server5.RegisteredQuery<"public", any, Promise<any>>;
  /**
   * Find multiple documents
   */
  findMany: convex_server5.RegisteredQuery<"public", any, Promise<any>>;
  /**
   * Update a single document
   */
  updateOne: convex_server5.RegisteredMutation<"public", any, Promise<any>>;
  /**
   * Update multiple documents
   */
  updateMany: convex_server5.RegisteredMutation<"public", any, Promise<any>>;
  /**
   * Delete a single document
   */
  deleteOne: convex_server5.RegisteredMutation<"public", any, Promise<void>>;
  /**
   * Delete multiple documents
   */
  deleteMany: convex_server5.RegisteredMutation<"public", any, Promise<any>>;
  /**
   * Migration helper to remove userId field
   */
  migrationRemoveUserId: convex_server5.RegisteredMutation<"public", any, Promise<void>>;
};

//#endregion
//#region src/server/createClient.d.ts
interface ComponentReference {
  adapter: {
    create: any;
    findOne: any;
    findMany: any;
    updateOne: any;
    updateMany: any;
    deleteOne: any;
    deleteMany: any;
    migrationRemoveUserId?: any;
  };
  [key: string]: any;
}
interface GenericCtx<_DataModel extends GenericDataModel> {
  db?: any;
  runQuery?: any;
  runMutation?: any;
  runAction?: any;
  auth?: any;
  [key: string]: any;
}
interface ClientConfig {
  verbose?: boolean;
  local?: {
    schema: any;
  };
  triggers?: Record<string, {
    onCreate?: (ctx: any, doc: any) => Promise<void>;
    onUpdate?: (ctx: any, newDoc: any, oldDoc: any) => Promise<void>;
    onDelete?: (ctx: any, doc: any) => Promise<void>;
  }>;
}
type CreateAuth$1<_DataModel extends GenericDataModel> = ((ctx: any) => any) | ((ctx: any, opts?: {
  optionsOnly?: boolean;
}) => any);
/**
 * Get static auth instance (for accessing options without context)
 */
declare function getStaticAuth<Auth extends ReturnType<any>>(createAuth: CreateAuth$1<any>): Auth;
/**
 * Creates the component client that Better Auth uses to interact with Convex
 */
declare function createClient<DataModel extends GenericDataModel, _Schema = any>(component: ComponentReference, config?: ClientConfig): {
  /**
   * Returns the database adapter for Better Auth using createAdapterFactory
   */
  adapter(ctx: GenericCtx<DataModel>): better_auth_adapters13.AdapterFactory;
  /**
   * Helper to get Better Auth instance with headers
   */
  getAuth(createAuth: (ctx: any) => any, ctx: GenericCtx<DataModel>): Promise<{
    auth: any;
    headers: Headers;
  }>;
  /**
   * Helper to get the authenticated user
   */
  getAuthUser(ctx: GenericCtx<DataModel>): Promise<any>;
  /**
   * Safely get the authenticated user (returns null instead of throwing)
   */
  safeGetAuthUser(ctx: GenericCtx<DataModel>): Promise<any>;
  /**
   * Get user by their Better Auth ID
   */
  getAnyUserById(ctx: GenericCtx<DataModel>, id: string): Promise<any>;
  /**
   * Get user by legacy userId field (migration helper)
   */
  migrationGetUser(ctx: GenericCtx<DataModel>, userId: string): Promise<any>;
  /**
   * Triggers API for component lifecycle hooks
   */
  triggersApi(): {
    onCreate: (ctx: any, doc: any) => Promise<void>;
    onUpdate: (ctx: any, newDoc: any, oldDoc: any) => Promise<void>;
    onDelete: (ctx: any, doc: any) => Promise<void>;
  };
  /**
   * Helper to set the userId field (for migrations)
   */
  setUserId(ctx: GenericCtx<DataModel>, authUserId: string, appUserId: string): Promise<void>;
  /**
   * Helper for migrations - remove userId
   */
  migrationRemoveUserId(ctx: GenericCtx<DataModel>, userId: string): Promise<void>;
  /**
   * Register Better Auth HTTP routes with Convex HTTP router
   * Handles CORS and forwards requests to Better Auth
   */
  registerRoutes(http: any, createAuth: (ctx: GenericCtx<DataModel>, options?: any) => any, opts?: {
    cors?: boolean | {
      allowedOrigins?: string[];
      allowedHeaders?: string[];
      exposedHeaders?: string[];
    };
  }): void;
};

//#endregion
export { AreAllPropertiesOptional, BetterAuthClient, ClientConfig, ComponentReference, ConvexAuthOptions, ConvexVueContext, ConvexVueOptions, CreateAuth, GenericCtx, IsOptionalKey, OptionalRestArgs, OptionalRestArgsAndOptions, convex, convexClient, createApi, createClient, createConvexClients, getStaticAuth, useAuth, useBetterAuthClient, useConvexClient, useConvexHttpClient, useConvexHttpQuery, useConvexMutation, useConvexQuery, useSession };