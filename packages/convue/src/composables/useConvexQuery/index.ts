import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'
import type { Ref } from 'vue'
import type { OptionalRestArgsAndOptions } from '../../types.ts'
import type { UseConvexQueryOptions, UseConvexQueryReturn } from './types.ts'
import {
  getFunctionName,
} from 'convex/server'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { debugLog } from '../../utils/debug.ts'
import { useConvexClient } from '../useConvexClient'
import { useQueryArgs } from './lib/useQueryArgs.ts'
import { useServerQuery } from './lib/useServerQuery.ts'

/**
 * A composable that provides a Realtime Convex query. It supports reactivity and can be used both on the client and server side.
 * @param query The Convex query function.
 * @param rest The arguments and options for the query.
 * @returns The result of the query.
 */
export function useConvexQuery<Query extends FunctionReference<'query'>>(query: Query, ...rest: OptionalRestArgsAndOptions<Query, UseConvexQueryOptions>): UseConvexQueryReturn<Query> {
  const { args, options } = useQueryArgs(rest)

  const isServer = typeof window === 'undefined'

  debugLog('[useConvexQuery] Starting query:', {
    isServer,
    queryName: getFunctionName(query),
    args: args.value,
  })

  // use http client on server-side
  if (isServer) {
    debugLog('[useConvexQuery] Using server path')
    return useServerQuery(query, args, options)
  }

  debugLog('[useConvexQuery] Using client path')
  const convex = useConvexClient()

  // Initial data
  const data: Ref<FunctionReturnType<Query> | undefined> = ref<FunctionReturnType<Query> | undefined>(convex.client.localQueryResult(getFunctionName(query), args.value))
  const error = ref<Error | null>(null)

  debugLog('[useConvexQuery] Initial client state:', {
    data: data.value,
    error: error.value,
  })

  const suspense = () => {
    if (data.value)
      return Promise.resolve(data.value)
    if (error.value)
      return Promise.reject(error.value)

    return new Promise<FunctionReturnType<Query>>((resolve, reject) => {
      const stop = watch(
        () => [data.value, error.value],
        ([newData, newError]) => {
          if (newData) {
            stop()
            resolve(newData)
          }
          else if (newError) {
            stop()
            reject(newError)
          }
        },
        { immediate: true },
      )
    })
  }

  const handleError = (err: Error) => {
    debugLog('[useConvexQuery] handleError called:', err)
    data.value = undefined
    error.value = err
  }

  const handleResult = (result: FunctionReturnType<Query>) => {
    debugLog('[useConvexQuery] handleResult called:', result)
    data.value = result
    error.value = null
  }

  const refetch = async () => {
    try {
      const result = await convex.query(query, args.value)
      handleResult(result)
      return result
    }
    catch (err) {
      const error_ = err instanceof Error ? err : new Error('Unknown error occurred')
      handleError(error_)
      throw error_
    }
  }

  const createSubscription = (args: FunctionArgs<Query>) => {
    debugLog('[useConvexQuery] Creating subscription with args:', args)
    return convex.onUpdate(
      query,
      args,
      handleResult,
      handleError,
    )
  }

  // recreate subscription when args change
  let cancelSubscription: () => void | undefined
  watch(args, (newArgs) => {
    debugLog('[useConvexQuery] Args changed, recreating subscription:', newArgs)
    cancelSubscription?.()
    cancelSubscription = createSubscription(newArgs)
  }, {
    immediate: true,
  })

  // cleanup subscription when component is unmounted
  onScopeDispose(() => {
    debugLog('[useConvexQuery] Component unmounting, cleaning up subscription')
    cancelSubscription?.()
  })

  return {
    data,
    error,
    isPending: computed(() => {
      const result = data.value === undefined && error.value === null
      debugLog('[useConvexQuery] isPending computed:', {
        dataValue: data.value,
        errorValue: error.value,
        isPending: result,
      })
      return result
    }),
    suspense,
    refetch,
  }
}
