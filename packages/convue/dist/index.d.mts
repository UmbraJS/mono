import * as better_auth_client17 from "better-auth/client";
import * as vue14 from "vue";
import * as vue1 from "vue";
import * as vue3 from "vue";
import { MaybeRefOrGetter, Ref } from "vue";
import * as convex_server0 from "convex/server";
import * as convex_server5 from "convex/server";
import { FunctionArgs, FunctionReference, FunctionReturnType, GenericDataModel, SchemaDefinition } from "convex/server";
import { ConvexClient, ConvexClientOptions, ConvexHttpClient, OptimisticUpdate } from "convex/browser";
import * as better_auth_adapters13 from "better-auth/adapters";
import * as node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31 from "node_modules/better-auth/dist/shared/better-auth.DNnBkMGu";

//#region src/composables/useAuth.d.ts
/**
* Creates an SSR-compatible auth composable for Nuxt
*
* This factory function allows the consuming app to provide Nuxt-specific composables
* that aren't available in the package context.
*
* @example
* In your Nuxt app's composables/useAuth.ts:
* ```ts
* import { createUseAuth } from 'convue'
*
* export const useAuth = createUseAuth({
*   useRequestURL,
*   useRequestHeaders,
*   useState,
* })
* ```
*/
/**
 * Creates an SSR-compatible auth composable for Nuxt
 *
 * This factory function allows the consuming app to provide Nuxt-specific composables
 * that aren't available in the package context.
 *
 * @example
 * In your Nuxt app's composables/useAuth.ts:
 * ```ts
 * import { createUseAuth } from 'convue'
 *
 * export const useAuth = createUseAuth({
 *   useRequestURL,
 *   useRequestHeaders,
 *   useState,
 * })
 * ```
 */
declare function createUseAuth(nuxtComposables: {
  useRequestURL: () => URL;
  useRequestHeaders: () => Record<string, string>;
  useState: <T>(key: string, init: () => T) => Ref<T>;
  isServer: boolean;
  isClient: boolean;
}): () => {
  session: Ref<any, any>;
  user: vue14.ComputedRef<any>;
  isAuthenticated: vue14.ComputedRef<boolean>;
  isLoading: vue14.ComputedRef<boolean>;
  client: {
    signIn: {
      social: <FetchOptions extends {
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: (HeadersInit & (HeadersInit | {
          accept: "application/json" | "text/plain" | "application/octet-stream";
          "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
          authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
        onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
          cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: better_auth_client17.FetchEsque | undefined;
        plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
          type: "Bearer";
          token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
          type: "Basic";
          username: string | (() => string | undefined) | undefined;
          password: string | (() => string | undefined) | undefined;
        } | {
          type: "Custom";
          prefix: string | (() => string | undefined) | undefined;
          value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
          provider: unknown;
          callbackURL?: string | undefined;
          newUserCallbackURL?: string | undefined;
          errorCallbackURL?: string | undefined;
          disableRedirect?: boolean | undefined;
          idToken?: {
            token: string;
            nonce?: string | undefined;
            accessToken?: string | undefined;
            refreshToken?: string | undefined;
            expiresAt?: number | undefined;
          } | undefined;
          scopes?: string[] | undefined;
          requestSignUp?: boolean | undefined;
          loginHint?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: better_auth_client17.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
      }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
        provider: unknown;
        callbackURL?: string | undefined;
        newUserCallbackURL?: string | undefined;
        errorCallbackURL?: string | undefined;
        disableRedirect?: boolean | undefined;
        idToken?: {
          token: string;
          nonce?: string | undefined;
          accessToken?: string | undefined;
          refreshToken?: string | undefined;
          expiresAt?: number | undefined;
        } | undefined;
        scopes?: string[] | undefined;
        requestSignUp?: boolean | undefined;
        loginHint?: string | undefined;
      } & {
        fetchOptions?: FetchOptions | undefined;
      }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<NonNullable<{
        redirect: boolean;
        token: string;
        url: undefined;
        user: {
          id: string;
          email: string;
          name: string;
          image: string | null | undefined;
          emailVerified: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      } | {
        url: string;
        redirect: boolean;
      }>, {
        code?: string;
        message?: string;
      }, FetchOptions["throw"] extends true ? true : false>>;
    };
  } & {
    signOut: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query?: Record<string, any> | undefined;
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      success: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    signUp: {
      email: <FetchOptions extends {
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: (HeadersInit & (HeadersInit | {
          accept: "application/json" | "text/plain" | "application/octet-stream";
          "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
          authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
        onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
          cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: better_auth_client17.FetchEsque | undefined;
        plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
          type: "Bearer";
          token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
          type: "Basic";
          username: string | (() => string | undefined) | undefined;
          password: string | (() => string | undefined) | undefined;
        } | {
          type: "Custom";
          prefix: string | (() => string | undefined) | undefined;
          value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
          name: string;
          email: string;
          password: string;
          image?: string;
          callbackURL?: string;
          rememberMe?: boolean;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: better_auth_client17.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
      }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
        email: string;
        name: string;
        password: string;
        image?: string;
        callbackURL?: string;
        fetchOptions?: FetchOptions | undefined;
      }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<NonNullable<{
        token: null;
        user: {
          id: string;
          email: string;
          name: string;
          image: string | null | undefined;
          emailVerified: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      } | {
        token: string;
        user: {
          id: string;
          email: string;
          name: string;
          image: string | null | undefined;
          emailVerified: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      }>, {
        code?: string;
        message?: string;
      }, FetchOptions["throw"] extends true ? true : false>>;
    };
  } & {
    signIn: {
      email: <FetchOptions extends {
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: (HeadersInit & (HeadersInit | {
          accept: "application/json" | "text/plain" | "application/octet-stream";
          "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
          authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
        onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
          cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: better_auth_client17.FetchEsque | undefined;
        plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
          type: "Bearer";
          token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
          type: "Basic";
          username: string | (() => string | undefined) | undefined;
          password: string | (() => string | undefined) | undefined;
        } | {
          type: "Custom";
          prefix: string | (() => string | undefined) | undefined;
          value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
          email: string;
          password: string;
          callbackURL?: string | undefined;
          rememberMe?: boolean | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: better_auth_client17.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
      }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
        email: string;
        password: string;
        callbackURL?: string | undefined;
        rememberMe?: boolean | undefined;
      } & {
        fetchOptions?: FetchOptions | undefined;
      }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
        redirect: boolean;
        token: string;
        url: string | undefined;
        user: {
          id: string;
          email: string;
          name: string;
          image: string | null | undefined;
          emailVerified: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      }, {
        code?: string;
        message?: string;
      }, FetchOptions["throw"] extends true ? true : false>>;
    };
  } & {
    forgetPassword: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        email: string;
        redirectTo?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      email: string;
      redirectTo?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    resetPassword: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        newPassword: string;
        token?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<{
        token?: string | undefined;
      }> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      newPassword: string;
      token?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    verifyEmail: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<{
        token: string;
        callbackURL?: string | undefined;
      }> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query: {
        token: string;
        callbackURL?: string | undefined;
      };
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<NonNullable<void | {
      status: boolean;
      user: {
        id: string;
        email: string;
        name: string;
        image: string | null | undefined;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    } | {
      status: boolean;
      user: null;
    }>, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    sendVerificationEmail: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        email: string;
        callbackURL?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      email: string;
      callbackURL?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    changeEmail: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        newEmail: string;
        callbackURL?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      newEmail: string;
      callbackURL?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    changePassword: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        newPassword: string;
        currentPassword: string;
        revokeOtherSessions?: boolean | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      newPassword: string;
      currentPassword: string;
      revokeOtherSessions?: boolean | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      token: string | null;
      user: {
        id: string;
        email: string;
        name: string;
        image: string | null | undefined;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    updateUser: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<Partial<{}> & {
        name?: string;
        image?: string;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      image?: string | null;
      name?: string;
      fetchOptions?: FetchOptions | undefined;
    } & Partial<{}>> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    deleteUser: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        callbackURL?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      callbackURL?: string | undefined;
      password?: string | undefined;
      token?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      success: boolean;
      message: string;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    resetPassword: {
      ":token": <FetchOptions extends {
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: (HeadersInit & (HeadersInit | {
          accept: "application/json" | "text/plain" | "application/octet-stream";
          "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
          authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
        onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
          cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: better_auth_client17.FetchEsque | undefined;
        plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
          type: "Bearer";
          token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
          type: "Basic";
          username: string | (() => string | undefined) | undefined;
          password: string | (() => string | undefined) | undefined;
        } | {
          type: "Custom";
          prefix: string | (() => string | undefined) | undefined;
          value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<{
          callbackURL: string;
        }> & Record<string, any>) | undefined;
        params?: {
          token: string;
        } | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: better_auth_client17.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
      }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
        query: {
          callbackURL: string;
        };
        fetchOptions?: FetchOptions | undefined;
      }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<never, {
        code?: string;
        message?: string;
      }, FetchOptions["throw"] extends true ? true : false>>;
    };
  } & {
    requestPasswordReset: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        email: string;
        redirectTo?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      email: string;
      redirectTo?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
      message: string;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    resetPassword: {
      ":token": <FetchOptions extends {
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: (HeadersInit & (HeadersInit | {
          accept: "application/json" | "text/plain" | "application/octet-stream";
          "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
          authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
        onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
          cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: better_auth_client17.FetchEsque | undefined;
        plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
          type: "Bearer";
          token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
          type: "Basic";
          username: string | (() => string | undefined) | undefined;
          password: string | (() => string | undefined) | undefined;
        } | {
          type: "Custom";
          prefix: string | (() => string | undefined) | undefined;
          value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<{
          callbackURL: string;
        }> & Record<string, any>) | undefined;
        params?: {
          token: string;
        } | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: better_auth_client17.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
      }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
        query: {
          callbackURL: string;
        };
        fetchOptions?: FetchOptions | undefined;
      }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<never, {
        code?: string;
        message?: string;
      }, FetchOptions["throw"] extends true ? true : false>>;
    };
  } & {
    listSessions: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query?: Record<string, any> | undefined;
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined | undefined;
      userAgent?: string | null | undefined | undefined;
    }>[], {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    revokeSession: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        token: string;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      token: string;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    revokeSessions: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query?: Record<string, any> | undefined;
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    revokeOtherSessions: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query?: Record<string, any> | undefined;
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    linkSocial: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        provider: unknown;
        callbackURL?: string | undefined;
        idToken?: {
          token: string;
          nonce?: string | undefined;
          accessToken?: string | undefined;
          refreshToken?: string | undefined;
          scopes?: string[] | undefined;
        } | undefined;
        requestSignUp?: boolean | undefined;
        scopes?: string[] | undefined;
        errorCallbackURL?: string | undefined;
        disableRedirect?: boolean | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      provider: unknown;
      callbackURL?: string | undefined;
      idToken?: {
        token: string;
        nonce?: string | undefined;
        accessToken?: string | undefined;
        refreshToken?: string | undefined;
        scopes?: string[] | undefined;
      } | undefined;
      requestSignUp?: boolean | undefined;
      scopes?: string[] | undefined;
      errorCallbackURL?: string | undefined;
      disableRedirect?: boolean | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      url: string;
      redirect: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    listAccounts: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query?: Record<string, any> | undefined;
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      id: string;
      providerId: string;
      createdAt: Date;
      updatedAt: Date;
      accountId: string;
      scopes: string[];
    }[], {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    deleteUser: {
      callback: <FetchOptions extends {
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: (HeadersInit & (HeadersInit | {
          accept: "application/json" | "text/plain" | "application/octet-stream";
          "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
          authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
        onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
          cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: better_auth_client17.FetchEsque | undefined;
        plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
          type: "Bearer";
          token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
          type: "Basic";
          username: string | (() => string | undefined) | undefined;
          password: string | (() => string | undefined) | undefined;
        } | {
          type: "Custom";
          prefix: string | (() => string | undefined) | undefined;
          value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<{
          token: string;
          callbackURL?: string | undefined;
        }> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: better_auth_client17.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
      }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
        query: {
          token: string;
          callbackURL?: string | undefined;
        };
        fetchOptions?: FetchOptions | undefined;
      }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
        success: boolean;
        message: string;
      }, {
        code?: string;
        message?: string;
      }, FetchOptions["throw"] extends true ? true : false>>;
    };
  } & {
    unlinkAccount: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        providerId: string;
        accountId?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      providerId: string;
      accountId?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      status: boolean;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    refreshToken: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      providerId: string;
      accountId?: string | undefined;
      userId?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<any, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    getAccessToken: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      providerId: string;
      accountId?: string | undefined;
      userId?: string | undefined;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      accessToken: string;
      accessTokenExpiresAt: Date | undefined;
      scopes: string[];
      idToken: string | undefined;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    accountInfo: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: (Partial<{
        accountId: string;
      }> & Record<string, any>) | undefined;
      query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      accountId: string;
    } & {
      fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      user: packages_core_dist_oauth2.OAuth2UserInfo;
      data: Record<string, any>;
    }, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    getSession: <FetchOptions extends {
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials | undefined;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method?: string | undefined;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRequest?: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
      onResponse?: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
      onSuccess?: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
      onError?: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl?: better_auth_client17.FetchEsque | undefined;
      plugins?: better_auth_client17.BetterFetchPlugin[] | undefined;
      baseURL?: string | undefined;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: undefined;
      query?: (Partial<{
        disableCookieCache?: unknown;
        disableRefresh?: unknown;
      }> & Record<string, any>) | undefined;
      params?: Record<string, any> | undefined;
      duplex?: "full" | "half" | undefined;
      jsonParser?: ((text: string) => Promise<any> | any) | undefined;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }>(data_0?: node_modules_better_auth_dist_shared_better_auth_DNnBkMGu31.a<{
      query?: {
        disableCookieCache?: unknown;
        disableRefresh?: unknown;
      } | undefined;
      fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<better_auth_client17.BetterFetchResponse<{
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      };
    } | null, {
      code?: string;
      message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
  } & {
    token: () => Promise<{
      data: {
        token: string;
      };
    }>;
  } & {
    useSession: better_auth_client17.Atom<{
      data: {
        user: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          email: string;
          emailVerified: boolean;
          name: string;
          image?: string | null | undefined;
        };
        session: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          userId: string;
          expiresAt: Date;
          token: string;
          ipAddress?: string | null | undefined;
          userAgent?: string | null | undefined;
        };
      } | null;
      error: better_auth_client17.BetterFetchError | null;
      isPending: boolean;
    }>;
    $fetch: better_auth_client17.BetterFetch<{
      plugins: (better_auth_client17.BetterFetchPlugin | {
        id: string;
        name: string;
        hooks: {
          onSuccess: ((context: better_auth_client17.SuccessContext<any>) => Promise<void> | void) | undefined;
          onError: ((context: better_auth_client17.ErrorContext) => Promise<void> | void) | undefined;
          onRequest: (<T extends Record<string, any>>(context: better_auth_client17.RequestContext<T>) => Promise<better_auth_client17.RequestContext | void> | better_auth_client17.RequestContext | void) | undefined;
          onResponse: ((context: better_auth_client17.ResponseContext) => Promise<Response | void | better_auth_client17.ResponseContext> | Response | better_auth_client17.ResponseContext | void) | undefined;
        };
      } | {
        id: string;
        name: string;
        hooks: {
          onSuccess(context: better_auth_client17.SuccessContext<any>): void;
        };
      })[];
      cache?: RequestCache | undefined;
      credentials?: RequestCredentials;
      headers?: (HeadersInit & (HeadersInit | {
        accept: "application/json" | "text/plain" | "application/octet-stream";
        "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
        authorization: "Bearer" | "Basic";
      })) | undefined;
      integrity?: string | undefined;
      keepalive?: boolean | undefined;
      method: string;
      mode?: RequestMode | undefined;
      priority?: RequestPriority | undefined;
      redirect?: RequestRedirect | undefined;
      referrer?: string | undefined;
      referrerPolicy?: ReferrerPolicy | undefined;
      signal?: (AbortSignal | null) | undefined;
      window?: null | undefined;
      onRetry?: ((response: better_auth_client17.ResponseContext) => Promise<void> | void) | undefined;
      hookOptions?: {
        cloneResponse?: boolean;
      } | undefined;
      timeout?: number | undefined;
      customFetchImpl: better_auth_client17.FetchEsque;
      baseURL: string;
      throw?: boolean | undefined;
      auth?: ({
        type: "Bearer";
        token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
      } | {
        type: "Basic";
        username: string | (() => string | undefined) | undefined;
        password: string | (() => string | undefined) | undefined;
      } | {
        type: "Custom";
        prefix: string | (() => string | undefined) | undefined;
        value: string | (() => string | undefined) | undefined;
      }) | undefined;
      body?: any;
      query?: any;
      params?: any;
      duplex?: "full" | "half" | undefined;
      jsonParser: (text: string) => Promise<any> | any;
      retry?: better_auth_client17.RetryOptions | undefined;
      retryAttempt?: number | undefined;
      output?: (better_auth_client17.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
      errorSchema?: better_auth_client17.StandardSchemaV1 | undefined;
      disableValidation?: boolean | undefined;
    }, unknown, unknown, {}>;
    $store: {
      notify: (signal?: Omit<string, "$sessionSignal"> | "$sessionSignal") => void;
      listen: (signal: Omit<string, "$sessionSignal"> | "$sessionSignal", listener: (value: boolean, oldValue?: boolean | undefined) => void) => void;
      atoms: Record<string, better_auth_client17.WritableAtom<any>>;
    };
    $Infer: {
      Session: {
        user: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          email: string;
          emailVerified: boolean;
          name: string;
          image?: string | null | undefined;
        };
        session: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          userId: string;
          expiresAt: Date;
          token: string;
          ipAddress?: string | null | undefined;
          userAgent?: string | null | undefined;
        };
      };
    };
    $ERROR_CODES: {
      readonly USER_NOT_FOUND: "User not found";
      readonly FAILED_TO_CREATE_USER: "Failed to create user";
      readonly FAILED_TO_CREATE_SESSION: "Failed to create session";
      readonly FAILED_TO_UPDATE_USER: "Failed to update user";
      readonly FAILED_TO_GET_SESSION: "Failed to get session";
      readonly INVALID_PASSWORD: "Invalid password";
      readonly INVALID_EMAIL: "Invalid email";
      readonly INVALID_EMAIL_OR_PASSWORD: "Invalid email or password";
      readonly SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked";
      readonly PROVIDER_NOT_FOUND: "Provider not found";
      readonly INVALID_TOKEN: "Invalid token";
      readonly ID_TOKEN_NOT_SUPPORTED: "id_token not supported";
      readonly FAILED_TO_GET_USER_INFO: "Failed to get user info";
      readonly USER_EMAIL_NOT_FOUND: "User email not found";
      readonly EMAIL_NOT_VERIFIED: "Email not verified";
      readonly PASSWORD_TOO_SHORT: "Password too short";
      readonly PASSWORD_TOO_LONG: "Password too long";
      readonly USER_ALREADY_EXISTS: "User already exists.";
      readonly USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.";
      readonly EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated";
      readonly CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found";
      readonly SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.";
      readonly FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account";
      readonly ACCOUNT_NOT_FOUND: "Account not found";
      readonly USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.";
    };
  };
  fetchSession: () => Promise<{
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
  } | null | undefined>;
}; //#endregion
//#region src/composables/useBetterAuthClient.d.ts
/**
 * Interface for the Better Auth client
 * This accepts any Better Auth client (React, Vue, or vanilla)
 */
/**
 * Better Auth session result that can be returned by useSession()
 */
interface BetterAuthSessionResult {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
  refetch?: () => Promise<void>;
}
interface BetterAuthClient {
  useSession?: () => BetterAuthSessionResult | {
    value: BetterAuthSessionResult;
  };
  getSession?: () => Promise<{
    data: Session | null;
    error: Error | null;
  }>;
  signIn: {
    email: (credentials: {
      email: string;
      password: string;
    }) => Promise<{
      data?: Session;
      error?: Error;
    }>;
    social: (options: {
      provider: string;
      callbackURL?: string;
    }) => Promise<{
      data?: Session;
      error?: Error;
    }>;
  };
  signOut: () => Promise<{
    data?: unknown;
    error?: Error;
  }>;
  convex?: {
    token: () => Promise<{
      data: {
        token: string;
      } | null;
      error: Error | null;
    }>;
  };
}
interface Session {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token?: string;
    [key: string]: unknown;
  };
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified?: boolean;
    [key: string]: unknown;
  };
}

//#endregion
//#region src/composables/useConvexClient.d.ts
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
/**
 * Returns the Convex client instance.
 * Note: This only works on the client-side. Use useConvexHttpClient for server-side queries.
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
 * - Adding a /convex/token endpoint for Convex client authentication
 */
declare function convex(): {
  id: string;
  endpoints: {
    convexToken: {
      method: string;
      path: string;
      handler: (ctx: any) => Promise<any>;
    };
  };
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
export { AreAllPropertiesOptional, BetterAuthClient, BetterAuthSessionResult, ClientConfig, ComponentReference, ConvexAuthOptions, ConvexVueContext, ConvexVueOptions, CreateAuth, GenericCtx, IsOptionalKey, OptionalRestArgs, OptionalRestArgsAndOptions, Session, convex, convexClient, createApi, createClient, createConvexClients, createUseAuth, getStaticAuth, useConvexClient, useConvexHttpClient, useConvexHttpQuery, useConvexMutation, useConvexQuery };