import { computed, inject, onScopeDispose, ref, shallowRef, toValue, watch } from "vue";
import { getFunctionName } from "convex/server";
import { ConvexClient, ConvexHttpClient } from "convex/browser";

//#region src/composables/useConvexContext.ts
/**
* Returns the Convex plugin context
*/
function useConvexContext() {
	const convexVueContext = inject("convex-vue");
	if (!convexVueContext) throw new Error("Context not found");
	return convexVueContext;
}

//#endregion
//#region src/composables/useConvexClient.ts
/**
* Returns the Convex client instance.
*/
function useConvexClient() {
	const convexVueContext = useConvexContext();
	if (!convexVueContext.clientRef.value) throw new Error("Client not initialized");
	return convexVueContext.clientRef.value;
}

//#endregion
//#region src/composables/useConvexHttpClient.ts
/**
* Returns the Convex HTTP client instance.
*/
function useConvexHttpClient() {
	const convexVueContext = useConvexContext();
	if (!convexVueContext.httpClientRef.value) throw new Error("HTTP client not initialized");
	return convexVueContext.httpClientRef.value;
}

//#endregion
//#region src/composables/useConvexHttpQuery.ts
/**
* A composable that returns a function to call a Convex query via the Convex HTTP API.
* This is useful for server-side rendering or static site generation.
*/
function useConvexHttpQuery(query, args = {}) {
	const client = useConvexHttpClient();
	return client.query(query, toValue(args));
}

//#endregion
//#region src/composables/useConvexMutation.ts
/**
* Appliess a mutation to the Convex server.
*/
function useConvexMutation(mutationReference, { optimisticUpdate } = {}) {
	const client = useConvexClient();
	const error = ref(null);
	const isPendingCount = ref(0);
	const mutate = async (args) => {
		++isPendingCount.value;
		error.value = null;
		return await client.mutation(mutationReference, toValue(args), { optimisticUpdate }).catch((e) => {
			error.value = e;
			throw e;
		}).finally(() => {
			--isPendingCount.value;
		});
	};
	return {
		mutate,
		error,
		isPending: computed(() => Boolean(isPendingCount.value))
	};
}

//#endregion
//#region src/composables/useConvexQuery/lib/useQueryArgs.ts
/**
* A composable that returns the query arguments and options for use in Convex queries.
* It determines whether the query arguments are optional and provides a computed reference to the arguments and options.
*/
function useQueryArgs(rest) {
	const args = computed(() => toValue(rest[0]));
	const options = rest[1];
	return {
		args,
		options
	};
}

//#endregion
//#region src/composables/useConvexQuery/lib/useServerQuery.ts
/**
* A composable that provides the server-side implementation of a Convex query. The output equals that of
* `useConvexQuery`, but it does not support reactivity. It should only be used on the server side.
*/
function useServerQuery(query, args, options) {
	const convex = useConvexHttpClient();
	const convexContext = useConvexContext();
	const isServer = typeof window === "undefined";
	if (!isServer) throw new Error("useServerQuery should only be called on the server side");
	const isServerEnabled = options?.server ?? convexContext.options.server ?? true;
	if (!isServerEnabled) {
		console.warn("[useServerQuery] Server queries disabled, returning static response");
		return {
			data: ref(void 0),
			error: ref(null),
			isPending: ref(false),
			suspense: () => Promise.resolve(void 0),
			refetch: () => Promise.resolve(void 0)
		};
	}
	const data = ref(void 0);
	const error = ref(null);
	const executeQuery = () => {
		return convex.query(query, args.value).then((result) => {
			data.value = result;
			error.value = null;
			return result;
		}).catch((err) => {
			data.value = void 0;
			error.value = err;
			throw err;
		});
	};
	const promise = executeQuery();
	return {
		data,
		error,
		isPending: computed(() => data.value === void 0),
		suspense: () => promise,
		refetch: executeQuery
	};
}

//#endregion
//#region src/composables/useConvexQuery/index.ts
/**
* A composable that provides a Realtime Convex query. It supports reactivity and can be used both on the client and server side.
* @param query The Convex query function.
* @param rest The arguments and options for the query.
* @returns The result of the query.
*/
function useConvexQuery(query, ...rest) {
	const { args, options } = useQueryArgs(rest);
	const isServer = typeof window === "undefined";
	console.warn("[useConvexQuery] Starting query:", {
		isServer,
		queryName: getFunctionName(query),
		args: args.value
	});
	if (isServer) {
		console.warn("[useConvexQuery] Using server path");
		return useServerQuery(query, args, options);
	}
	console.warn("[useConvexQuery] Using client path");
	const convex = useConvexClient();
	const data = ref(convex.client.localQueryResult(getFunctionName(query), args.value));
	const error = ref(null);
	console.warn("[useConvexQuery] Initial client state:", {
		data: data.value,
		error: error.value
	});
	const suspense = () => {
		if (data.value) return Promise.resolve(data.value);
		if (error.value) return Promise.reject(error.value);
		return new Promise((resolve, reject) => {
			const stop = watch(() => [data.value, error.value], ([newData, newError]) => {
				if (newData) {
					stop();
					resolve(newData);
				} else if (newError) {
					stop();
					reject(newError);
				}
			}, { immediate: true });
		});
	};
	const handleError = (err) => {
		console.warn("[useConvexQuery] handleError called:", err);
		data.value = void 0;
		error.value = err;
	};
	const handleResult = (result) => {
		console.warn("[useConvexQuery] handleResult called:", result);
		data.value = result;
		error.value = null;
	};
	const refetch = async () => {
		try {
			const result = await convex.query(query, args.value);
			handleResult(result);
			return result;
		} catch (err) {
			const error_ = err instanceof Error ? err : new Error("Unknown error occurred");
			handleError(error_);
			throw error_;
		}
	};
	const createSubscription = (args$1) => {
		console.warn("[useConvexQuery] Creating subscription with args:", args$1);
		return convex.onUpdate(query, args$1, handleResult, handleError);
	};
	let cancelSubscription;
	watch(args, (newArgs) => {
		console.warn("[useConvexQuery] Args changed, recreating subscription:", newArgs);
		cancelSubscription?.();
		cancelSubscription = createSubscription(newArgs);
	}, { immediate: true });
	onScopeDispose(() => {
		console.warn("[useConvexQuery] Component unmounting, cleaning up subscription");
		cancelSubscription?.();
	});
	return {
		data,
		error,
		isPending: computed(() => {
			const result = data.value === void 0 && error.value === null;
			console.warn("[useConvexQuery] isPending computed:", {
				dataValue: data.value,
				errorValue: error.value,
				isPending: result
			});
			return result;
		}),
		suspense,
		refetch
	};
}

//#endregion
//#region src/plugin.ts
const convexVue = { install(app, initialOptions) {
	const clientRef = shallowRef();
	const httpClientRef = shallowRef();
	const initClient = (options) => {
		options ??= initialOptions;
		clientRef.value = new ConvexClient(options.url, options.clientOptions);
		httpClientRef.value = new ConvexHttpClient(options.url, {
			logger: options?.clientOptions?.logger,
			skipConvexDeploymentUrlCheck: options.clientOptions?.skipConvexDeploymentUrlCheck
		});
	};
	if (!initialOptions.manualInit) initClient(initialOptions);
	app.provide("convex-vue", {
		options: initialOptions,
		clientRef,
		httpClientRef,
		initClient
	});
} };

//#endregion
export { convexVue, useConvexClient, useConvexHttpClient, useConvexHttpQuery, useConvexMutation, useConvexQuery };