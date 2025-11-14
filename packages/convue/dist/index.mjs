import { computed, isRef, onScopeDispose, ref, shallowRef, toValue, watch } from "vue";
import { getFunctionName, httpActionGeneric, mutationGeneric, queryGeneric } from "convex/server";
import { ConvexClient, ConvexHttpClient } from "convex/browser";
import { v } from "convex/values";
import { createAdapterFactory } from "better-auth/adapters";
import { corsRouter } from "convex-helpers/server/cors";

//#region src/composables/useBetterAuthClient.ts
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
function useBetterAuthClient() {
	try {
		const nuxtApp = globalThis.useNuxtApp?.();
		if (nuxtApp?.$betterAuthClient) return nuxtApp.$betterAuthClient;
	} catch {}
	throw new Error("useBetterAuthClient() is called without a provider. Make sure to provide the authClient in your Nuxt plugin:\nreturn { provide: { betterAuthClient: authClient } }");
}

//#endregion
//#region src/composables/useConvexContext.ts
/**
* Returns the Convex plugin context from Nuxt app
*/
function useConvexContext() {
	try {
		const nuxtApp = globalThis.useNuxtApp?.();
		if (nuxtApp?.$convex) return nuxtApp.$convex;
	} catch {}
	throw new Error("useConvexContext() is called without a provider. Make sure to provide convex in your Nuxt plugin:\nreturn { provide: { convex: convexContext } }");
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
//#region src/composables/useAuth.ts
/**
* Unified composable for all authentication concerns
*
* This is the main auth composable that provides:
* - Session data and authentication state
* - Loading and error states
* - Better Auth client for sign in/out operations
* - Session refetch capability
* - Automatic Convex client authentication
*
* @example
* ```ts
* import { useAuth } from 'convue'
*
* const {
*   session,           // Current user session
*   isAuthenticated,   // Boolean auth state
*   isLoading,         // Loading state
*   client,            // Better Auth client
*   refetch            // Refetch session
* } = useAuth()
*
* // Sign in
* await client.signIn.email({ email, password })
*
* // Sign out
* await client.signOut()
*
* // Access user data
* console.log(session.value?.user.email)
* ```
*/
function useAuth() {
	const authClient = useBetterAuthClient();
	const convexClient$1 = useConvexClient();
	if (!authClient.useSession) throw new Error("Better Auth client is missing useSession method");
	if (!authClient.convex?.token) throw new Error("Better Auth client is missing convex.token method");
	const sessionResult = authClient.useSession();
	let session;
	let isPending;
	let error;
	let refetch;
	const unwrapped = isRef(sessionResult) ? sessionResult.value : sessionResult;
	if (unwrapped && typeof unwrapped === "object") if ("data" in unwrapped && "isPending" in unwrapped) if (isRef(sessionResult)) {
		session = computed(() => sessionResult.value.data);
		isPending = computed(() => sessionResult.value.isPending);
		error = computed(() => sessionResult.value.error);
		refetch = sessionResult.value.refetch || (async () => {});
	} else {
		const result = unwrapped;
		session = ref(result.data);
		isPending = ref(result.isPending);
		error = ref(result.error);
		refetch = result.refetch || (async () => {});
	}
	else {
		session = ref(unwrapped);
		isPending = ref(false);
		error = ref(null);
		refetch = async () => {};
	}
	else throw new Error("Better Auth useSession() returned unexpected value");
	const isLoading = computed(() => isPending?.value ?? false);
	const isAuthenticated = computed(() => session?.value !== null && session?.value !== void 0);
	const sessionId = computed(() => session?.value?.session?.id ?? null);
	/**
	* Fetch a Convex auth token from Better Auth
	*/
	const fetchAccessToken = async () => {
		try {
			const { data } = await authClient.convex.token();
			return data?.token || null;
		} catch {
			return null;
		}
	};
	watch(sessionId, (newSessionId) => {
		if (isLoading.value) return;
		if (newSessionId) convexClient$1.setAuth(async () => {
			const token = await fetchAccessToken();
			return token;
		});
		else convexClient$1.setAuth(async () => null);
	}, { immediate: false });
	return {
		session,
		isLoading,
		isAuthenticated,
		error: error || ref(null),
		client: authClient,
		refetch,
		fetchAccessToken
	};
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
	const convex$1 = useConvexHttpClient();
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
		return convex$1.query(query, args.value).then((result) => {
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
	const convex$1 = useConvexClient();
	const data = ref(convex$1.client.localQueryResult(getFunctionName(query), args.value));
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
			const result = await convex$1.query(query, args.value);
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
		return convex$1.onUpdate(query, args$1, handleResult, handleError);
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
/**
* Creates Convex clients to be provided in a Nuxt plugin
*/
function createConvexClients(url, clientOptions) {
	const clientRef = shallowRef();
	const httpClientRef = shallowRef();
	const initClient = (options) => {
		const opts = options ?? {
			url,
			clientOptions
		};
		clientRef.value = new ConvexClient(opts.url, opts.clientOptions);
		httpClientRef.value = new ConvexHttpClient(opts.url, {
			logger: opts?.clientOptions?.logger,
			skipConvexDeploymentUrlCheck: opts.clientOptions?.skipConvexDeploymentUrlCheck
		});
	};
	initClient();
	return {
		clientRef,
		httpClientRef,
		initClient
	};
}

//#endregion
//#region src/plugins/convexClient.ts
/**
* Better Auth client plugin for Convex integration
*
* This plugin adds a `token()` method to the auth client that fetches
* a Convex authentication token from the Better Auth backend.
*/
function convexClient() {
	return {
		id: "convex",
		getActions: ($fetch) => {
			return { token: async () => {
				return $fetch("/convex/token", { method: "POST" });
			} };
		}
	};
}

//#endregion
//#region src/server/convexPlugin.ts
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
function convex() {
	return {
		id: "convex",
		endpoints: { convexToken: {
			method: "POST",
			path: "/convex/token",
			handler: async (ctx) => {
				const session = await ctx.getSession();
				if (!session) return ctx.json({ error: "Unauthorized" }, { status: 401 });
				return ctx.json({ token: session.session.token || session.session.id });
			}
		} },
		init(_ctx) {
			return { options: { advanced: { generateId: false } } };
		}
	};
}

//#endregion
//#region src/server/createApi.ts
/**
* Generates the CRUD operations that Better Auth needs to work with Convex
*/
function createApi(_schema, _createAuth) {
	const whereValidator = v.array(v.object({
		field: v.string(),
		value: v.union(v.string(), v.number(), v.boolean(), v.array(v.string()), v.array(v.number()), v.null()),
		operator: v.optional(v.union(v.literal("lt"), v.literal("lte"), v.literal("gt"), v.literal("gte"), v.literal("eq"), v.literal("in"), v.literal("not_in"), v.literal("ne"), v.literal("contains"), v.literal("starts_with"), v.literal("ends_with"))),
		connector: v.optional(v.union(v.literal("AND"), v.literal("OR")))
	}));
	return {
		create: mutationGeneric({
			args: {
				input: v.union(v.object({
					model: v.string(),
					data: v.any()
				})),
				select: v.optional(v.array(v.string())),
				onCreateHandle: v.optional(v.string())
			},
			handler: async (ctx, args) => {
				const { model, data } = args.input;
				const result = await ctx.db.insert(model, data);
				const doc = await ctx.db.get(result);
				return doc;
			}
		}),
		findOne: queryGeneric({
			args: {
				model: v.string(),
				where: v.optional(whereValidator),
				select: v.optional(v.array(v.string()))
			},
			handler: async (ctx, args) => {
				const { model, where } = args;
				const all = await ctx.db.query(model).collect();
				if (!where || where.length === 0) return all[0] || null;
				const filtered = all.filter((doc) => {
					return where.every((condition) => {
						const { field, value, operator = "eq" } = condition;
						const docValue = doc[field];
						switch (operator) {
							case "eq": return docValue === value;
							case "ne": return docValue !== value;
							case "lt": return docValue < value;
							case "lte": return docValue <= value;
							case "gt": return docValue > value;
							case "gte": return docValue >= value;
							case "in": return Array.isArray(value) && value.includes(docValue);
							case "not_in": return Array.isArray(value) && !value.includes(docValue);
							case "contains": return typeof docValue === "string" && docValue.includes(String(value));
							case "starts_with": return typeof docValue === "string" && docValue.startsWith(String(value));
							case "ends_with": return typeof docValue === "string" && docValue.endsWith(String(value));
							default: return false;
						}
					});
				});
				return filtered[0] || null;
			}
		}),
		findMany: queryGeneric({
			args: {
				model: v.string(),
				where: v.optional(whereValidator),
				limit: v.optional(v.number()),
				offset: v.optional(v.number()),
				sortBy: v.optional(v.object({
					field: v.string(),
					direction: v.union(v.literal("asc"), v.literal("desc"))
				})),
				select: v.optional(v.array(v.string()))
			},
			handler: async (ctx, args) => {
				const { model, where, limit, sortBy } = args;
				let all = await ctx.db.query(model).collect();
				if (where && where.length > 0) all = all.filter((doc) => {
					return where.every((condition) => {
						const { field, value, operator = "eq" } = condition;
						const docValue = doc[field];
						switch (operator) {
							case "eq": return docValue === value;
							case "ne": return docValue !== value;
							case "lt": return docValue < value;
							case "lte": return docValue <= value;
							case "gt": return docValue > value;
							case "gte": return docValue >= value;
							case "in": return Array.isArray(value) && value.includes(docValue);
							case "not_in": return Array.isArray(value) && !value.includes(docValue);
							case "contains": return typeof docValue === "string" && docValue.includes(String(value));
							case "starts_with": return typeof docValue === "string" && docValue.startsWith(String(value));
							case "ends_with": return typeof docValue === "string" && docValue.endsWith(String(value));
							default: return false;
						}
					});
				});
				if (sortBy) all.sort((a, b) => {
					const aVal = a[sortBy.field];
					const bVal = b[sortBy.field];
					const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
					return sortBy.direction === "desc" ? -comparison : comparison;
				});
				if (limit) all = all.slice(0, limit);
				return all;
			}
		}),
		updateOne: mutationGeneric({
			args: {
				input: v.object({
					model: v.string(),
					where: v.optional(whereValidator),
					update: v.any()
				}),
				onUpdateHandle: v.optional(v.string())
			},
			handler: async (ctx, args) => {
				const { model, where, update } = args.input;
				const all = await ctx.db.query(model).collect();
				let doc = all[0];
				if (where && where.length > 0) doc = all.find((d) => {
					return where.every((condition) => {
						const { field, value, operator = "eq" } = condition;
						return operator === "eq" ? d[field] === value : false;
					});
				});
				if (!doc) return null;
				await ctx.db.patch(doc._id, update);
				return await ctx.db.get(doc._id);
			}
		}),
		updateMany: mutationGeneric({
			args: {
				input: v.object({
					model: v.string(),
					where: v.optional(whereValidator),
					update: v.any()
				}),
				onUpdateHandle: v.optional(v.string())
			},
			handler: async (ctx, args) => {
				const { model, where, update } = args.input;
				const all = await ctx.db.query(model).collect();
				let docsToUpdate = all;
				if (where && where.length > 0) docsToUpdate = all.filter((d) => {
					return where.every((condition) => {
						const { field, value, operator = "eq" } = condition;
						return operator === "eq" ? d[field] === value : false;
					});
				});
				await Promise.all(docsToUpdate.map((doc) => ctx.db.patch(doc._id, update)));
				return docsToUpdate.length;
			}
		}),
		deleteOne: mutationGeneric({
			args: { input: v.object({
				model: v.string(),
				where: v.optional(whereValidator)
			}) },
			handler: async (ctx, args) => {
				const { model, where } = args.input;
				const all = await ctx.db.query(model).collect();
				let doc = all[0];
				if (where && where.length > 0) doc = all.find((d) => {
					return where.every((condition) => {
						const { field, value, operator = "eq" } = condition;
						return operator === "eq" ? d[field] === value : false;
					});
				});
				if (!doc) return;
				await ctx.db.delete(doc._id);
			}
		}),
		deleteMany: mutationGeneric({
			args: { input: v.object({
				model: v.string(),
				where: v.optional(whereValidator)
			}) },
			handler: async (ctx, args) => {
				const { model, where } = args.input;
				const all = await ctx.db.query(model).collect();
				let docsToDelete = all;
				if (where && where.length > 0) docsToDelete = all.filter((d) => {
					return where.every((condition) => {
						const { field, value, operator = "eq" } = condition;
						return operator === "eq" ? d[field] === value : false;
					});
				});
				await Promise.all(docsToDelete.map((doc) => ctx.db.delete(doc._id)));
				return docsToDelete.length;
			}
		}),
		migrationRemoveUserId: mutationGeneric({
			args: { userId: v.string() },
			handler: async (ctx, args) => {
				await ctx.db.patch(args.userId, { userId: void 0 });
			}
		})
	};
}

//#endregion
//#region src/server/createClient.ts
/**
* Get static auth instance (for accessing options without context)
*/
function getStaticAuth(createAuth) {
	return createAuth({}, { optionsOnly: true });
}
/**
* Creates the component client that Better Auth uses to interact with Convex
*/
function createClient(component, config) {
	return {
		adapter(ctx) {
			return createAdapterFactory({
				config: {
					adapterId: "convex",
					adapterName: "Convex Adapter",
					debugLogs: config?.verbose || false,
					disableIdGeneration: true,
					transaction: false,
					supportsNumericIds: false,
					supportsJSON: false,
					usePlural: false,
					mapKeysTransformInput: { id: "_id" },
					mapKeysTransformOutput: { _id: "id" },
					supportsDates: false,
					customTransformInput: ({ data, fieldAttributes }) => {
						if (data && fieldAttributes.type === "date") return new Date(data).getTime();
						return data;
					},
					customTransformOutput: ({ data, fieldAttributes }) => {
						if (data && fieldAttributes.type === "date") return new Date(data).getTime();
						return data;
					}
				},
				adapter: ({ options }) => {
					options.telemetry = { enabled: false };
					return {
						id: "convex",
						options: { isRunMutationCtx: "runMutation" in ctx },
						createSchema: async ({ file: _file, tables }) => {
							const schemaLines = [
								"import { defineSchema, defineTable } from \"convex/server\"",
								"import { v } from \"convex/values\"",
								"",
								"export default defineSchema({"
							];
							for (const [tableName, table] of Object.entries(tables)) {
								schemaLines.push(`  ${tableName}: defineTable({`);
								const fields = table.fields;
								for (const [fieldName, field] of Object.entries(fields)) {
									let validator = "v.any()";
									if (field.type === "string") validator = "v.string()";
									else if (field.type === "number") validator = "v.number()";
									else if (field.type === "boolean") validator = "v.boolean()";
									else if (field.type === "date") validator = "v.number() // timestamp";
									schemaLines.push(`    ${fieldName}: ${validator},`);
								}
								schemaLines.push("  }),");
							}
							schemaLines.push("})");
							return {
								code: schemaLines.join("\n"),
								path: "convex/schema.ts",
								success: true
							};
						},
						create: async ({ model, data, select }) => {
							if (!("runMutation" in ctx)) throw new Error("ctx is not a mutation ctx");
							return ctx.runMutation(component.adapter.create, {
								input: {
									model,
									data
								},
								select
							});
						},
						findOne: async ({ model, where, select }) => {
							return await ctx.runQuery(component.adapter.findOne, {
								model,
								where,
								select
							});
						},
						findMany: async ({ model, where, limit, sortBy, offset }) => {
							if (offset) throw new Error("offset not supported");
							return await ctx.runQuery(component.adapter.findMany, {
								model,
								where,
								limit,
								sortBy
							});
						},
						update: async ({ model, where, update }) => {
							if (!("runMutation" in ctx)) throw new Error("ctx is not a mutation ctx");
							return await ctx.runMutation(component.adapter.updateOne, { input: {
								model,
								where,
								update
							} });
						},
						updateMany: async ({ model, where, update }) => {
							if (!("runMutation" in ctx)) throw new Error("ctx is not a mutation ctx");
							return await ctx.runMutation(component.adapter.updateMany, { input: {
								model,
								where,
								update
							} });
						},
						delete: async ({ model, where }) => {
							if (!("runMutation" in ctx)) throw new Error("ctx is not a mutation ctx");
							await ctx.runMutation(component.adapter.deleteOne, { input: {
								model,
								where
							} });
						},
						deleteMany: async ({ model, where }) => {
							if (!("runMutation" in ctx)) throw new Error("ctx is not a mutation ctx");
							return await ctx.runMutation(component.adapter.deleteMany, { input: {
								model,
								where
							} });
						},
						count: async ({ model, where }) => {
							const results = await ctx.runQuery(component.adapter.findMany, {
								model,
								where
							});
							return results.length;
						}
					};
				}
			});
		},
		async getAuth(createAuth, ctx) {
			const auth = createAuth(ctx);
			const headers = new Headers();
			if (ctx.auth?.getUserIdentity) {
				const identity = await ctx.auth.getUserIdentity();
				if (identity?.tokenIdentifier) headers.set("Authorization", `Bearer ${identity.tokenIdentifier}`);
			}
			return {
				auth,
				headers
			};
		},
		async getAuthUser(ctx) {
			if (ctx.auth?.getUserIdentity) {
				const identity = await ctx.auth.getUserIdentity();
				if (identity) {
					const user = await ctx.runQuery(component.adapter.findOne, {
						model: "user",
						where: [{
							field: "_id",
							value: identity.subject,
							operator: "eq"
						}]
					});
					if (!user) throw new Error("Unauthenticated");
					return user;
				}
			}
			throw new Error("Unauthenticated");
		},
		async safeGetAuthUser(ctx) {
			if (ctx.auth?.getUserIdentity) {
				const identity = await ctx.auth.getUserIdentity();
				if (identity) {
					const user = await ctx.runQuery(component.adapter.findOne, {
						model: "user",
						where: [{
							field: "_id",
							value: identity.subject,
							operator: "eq"
						}]
					});
					return user;
				}
			}
			return null;
		},
		async getAnyUserById(ctx, id) {
			return await ctx.runQuery(component.adapter.findOne, {
				model: "user",
				where: [{
					field: "_id",
					value: id
				}]
			});
		},
		async migrationGetUser(ctx, userId) {
			return await ctx.runQuery(component.adapter.findOne, {
				model: "user",
				where: [{
					field: "userId",
					value: userId
				}]
			});
		},
		triggersApi() {
			return {
				onCreate: async (ctx, doc) => {
					if (config?.triggers?.user?.onCreate) await config.triggers.user.onCreate(ctx, doc);
				},
				onUpdate: async (ctx, newDoc, oldDoc) => {
					if (config?.triggers?.user?.onUpdate) await config.triggers.user.onUpdate(ctx, newDoc, oldDoc);
				},
				onDelete: async (ctx, doc) => {
					if (config?.triggers?.user?.onDelete) await config.triggers.user.onDelete(ctx, doc);
				}
			};
		},
		async setUserId(ctx, authUserId, appUserId) {
			await ctx.runMutation(component.adapter.updateOne, { input: {
				model: "user",
				where: [{
					field: "_id",
					value: authUserId,
					operator: "eq"
				}],
				update: { userId: appUserId }
			} });
		},
		async migrationRemoveUserId(ctx, userId) {
			if (component.adapter.migrationRemoveUserId) await ctx.runMutation(component.adapter.migrationRemoveUserId, { userId });
		},
		registerRoutes(http, createAuth, opts = {}) {
			const staticAuth = createAuth({}, { optionsOnly: true });
			const path = staticAuth.options.basePath ?? "/api/auth";
			const authRequestHandler = httpActionGeneric(async (ctx, request) => {
				const auth = createAuth(ctx);
				return await auth.handler(request);
			});
			if (!opts.cors) {
				http.route({
					pathPrefix: `${path}/`,
					method: "GET",
					handler: authRequestHandler
				});
				http.route({
					pathPrefix: `${path}/`,
					method: "POST",
					handler: authRequestHandler
				});
				return;
			}
			const corsOpts = typeof opts.cors === "boolean" ? {
				allowedOrigins: [],
				allowedHeaders: [],
				exposedHeaders: []
			} : opts.cors;
			const cors = corsRouter(http, {
				allowedOrigins: async (_request) => {
					const trustedOrigins = staticAuth.options.trustedOrigins ?? [];
					const trustedOriginsArray = Array.isArray(trustedOrigins) ? trustedOrigins : [];
					return trustedOriginsArray.map((origin) => origin.endsWith("*") && origin.length > 1 ? origin.slice(0, -1) : origin).concat(corsOpts.allowedOrigins ?? []);
				},
				allowCredentials: true,
				allowedHeaders: [
					"Content-Type",
					"Better-Auth-Cookie",
					"Authorization"
				].concat(corsOpts.allowedHeaders ?? []),
				exposedHeaders: ["Set-Better-Auth-Cookie"].concat(corsOpts.exposedHeaders ?? []),
				debug: config?.verbose,
				enforceAllowOrigins: false
			});
			cors.route({
				pathPrefix: `${path}/`,
				method: "GET",
				handler: authRequestHandler
			});
			cors.route({
				pathPrefix: `${path}/`,
				method: "POST",
				handler: authRequestHandler
			});
		}
	};
}

//#endregion
export { convex, convexClient, createApi, createClient, createConvexClients, getStaticAuth, useAuth, useConvexClient, useConvexHttpClient, useConvexHttpQuery, useConvexMutation, useConvexQuery };