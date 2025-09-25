import * as vue1 from "vue";
import { MaybeRefOrGetter, ObjectPlugin, Ref } from "vue";
import * as convex_server0 from "convex/server";
import { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server";
import { ConvexClient, ConvexClientOptions, ConvexHttpClient, OptimisticUpdate } from "convex/browser";

//#region src/composables/useConvexClient.d.ts
/**
* Returns the Convex client instance.
*/
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
//#region src/plugin.d.ts
interface ConvexAuthOptions {
  forceRefreshToken: boolean;
}
interface ConvexVueOptions {
  url: string;
  clientOptions?: ConvexClientOptions;
  auth?: ConvexAuthOptions;
  /**
   * If true, the global default client wont be initialized automatically,
   * you will need to init the client yourself before using the composables.
   */
  manualInit?: boolean;
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
declare const convexVue: ObjectPlugin<ConvexVueOptions>;

//#endregion
export { AreAllPropertiesOptional, ConvexAuthOptions, ConvexVueContext, ConvexVueOptions, IsOptionalKey, OptionalRestArgs, OptionalRestArgsAndOptions, convexVue, useConvexClient, useConvexHttpClient, useConvexHttpQuery, useConvexMutation, useConvexQuery };