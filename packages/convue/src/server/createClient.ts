/**
 * Creates a Better Auth component client for Convex
 *
 * This provides helper methods for integrating Better Auth with Convex,
 * including the database adapter and authentication utilities.
 */

import type { GenericDataModel } from 'convex/server'
import { createAdapterFactory } from 'better-auth/adapters'
import { corsRouter } from 'convex-helpers/server/cors'
import { httpActionGeneric } from 'convex/server'

export interface ComponentReference {
  adapter: {
    create: any
    findOne: any
    findMany: any
    updateOne: any
    updateMany: any
    deleteOne: any
    deleteMany: any
    migrationRemoveUserId?: any
  }
  [key: string]: any
}

export interface GenericCtx<_DataModel extends GenericDataModel> {
  db?: any
  runQuery?: any
  runMutation?: any
  runAction?: any
  auth?: any
  [key: string]: any
}

export interface ClientConfig {
  verbose?: boolean
  local?: {
    schema: any
  }
  triggers?: Record<string, {
    onCreate?: (ctx: any, doc: any) => Promise<void>
    onUpdate?: (ctx: any, newDoc: any, oldDoc: any) => Promise<void>
    onDelete?: (ctx: any, doc: any) => Promise<void>
  }>
}

export type CreateAuth<_DataModel extends GenericDataModel>
  = | ((ctx: any) => any)
  | ((ctx: any, opts?: { optionsOnly?: boolean }) => any)

/**
 * Get static auth instance (for accessing options without context)
 */
export function getStaticAuth<Auth extends ReturnType<any>>(
  createAuth: CreateAuth<any>,
): Auth {
  return createAuth({} as any, { optionsOnly: true })
}

/**
 * Creates the component client that Better Auth uses to interact with Convex
 */
export function createClient<
  DataModel extends GenericDataModel,
  _Schema = any,
>(
  component: ComponentReference,
  config?: ClientConfig,
) {
  return {
    /**
     * Returns the database adapter for Better Auth using createAdapterFactory
     */
    adapter(ctx: GenericCtx<DataModel>) {
      return createAdapterFactory({
        config: {
          adapterId: 'convex',
          adapterName: 'Convex Adapter',
          debugLogs: config?.verbose || false,
          disableIdGeneration: true,
          transaction: false,
          supportsNumericIds: false,
          supportsJSON: false,
          usePlural: false,
          mapKeysTransformInput: {
            id: '_id',
          },
          mapKeysTransformOutput: {
            _id: 'id',
          },
          supportsDates: false,
          customTransformInput: ({ data, fieldAttributes }) => {
            if (data && fieldAttributes.type === 'date') {
              return new Date(data).getTime()
            }
            return data
          },
          customTransformOutput: ({ data, fieldAttributes }) => {
            if (data && fieldAttributes.type === 'date') {
              return new Date(data).getTime()
            }
            return data
          },
        },
        adapter: ({ options }) => {
          // Disable telemetry in all cases because it requires Node
          options.telemetry = { enabled: false }

          return {
            id: 'convex',
            options: {
              isRunMutationCtx: 'runMutation' in ctx,
            },

            createSchema: async ({ file: _file, tables }) => {
              // Generate Convex schema from Better Auth tables
              // This is called during setup to help create schema.ts
              const schemaLines = ['import { defineSchema, defineTable } from "convex/server"', 'import { v } from "convex/values"', '', 'export default defineSchema({']

              for (const [tableName, table] of Object.entries(tables)) {
                schemaLines.push(`  ${tableName}: defineTable({`)
                const fields = table.fields as Record<string, any>
                for (const [fieldName, field] of Object.entries(fields)) {
                  let validator = 'v.any()'
                  if (field.type === 'string')
                    validator = 'v.string()'
                  else if (field.type === 'number')
                    validator = 'v.number()'
                  else if (field.type === 'boolean')
                    validator = 'v.boolean()'
                  else if (field.type === 'date')
                    validator = 'v.number() // timestamp'

                  schemaLines.push(`    ${fieldName}: ${validator},`)
                }
                schemaLines.push('  }),')
              }

              schemaLines.push('})')

              return {
                code: schemaLines.join('\n'),
                path: 'convex/schema.ts',
                success: true,
              }
            },

            create: async ({ model, data, select }): Promise<any> => {
              if (!('runMutation' in ctx)) {
                throw new Error('ctx is not a mutation ctx')
              }
              return ctx.runMutation(component.adapter.create, {
                input: { model, data },
                select,
              })
            },

            findOne: async ({ model, where, select }): Promise<any> => {
              return await ctx.runQuery(component.adapter.findOne, {
                model,
                where,
                select,
              })
            },

            findMany: async ({ model, where, limit, sortBy, offset }): Promise<any> => {
              if (offset) {
                throw new Error('offset not supported')
              }
              return await ctx.runQuery(component.adapter.findMany, {
                model,
                where,
                limit,
                sortBy,
              })
            },

            update: async ({ model, where, update }): Promise<any> => {
              if (!('runMutation' in ctx)) {
                throw new Error('ctx is not a mutation ctx')
              }
              return await ctx.runMutation(component.adapter.updateOne, {
                input: { model, where, update },
              })
            },

            updateMany: async ({ model, where, update }): Promise<any> => {
              if (!('runMutation' in ctx)) {
                throw new Error('ctx is not a mutation ctx')
              }
              return await ctx.runMutation(component.adapter.updateMany, {
                input: { model, where, update },
              })
            },

            delete: async ({ model, where }): Promise<void> => {
              if (!('runMutation' in ctx)) {
                throw new Error('ctx is not a mutation ctx')
              }
              await ctx.runMutation(component.adapter.deleteOne, {
                input: { model, where },
              })
            },

            deleteMany: async ({ model, where }): Promise<any> => {
              if (!('runMutation' in ctx)) {
                throw new Error('ctx is not a mutation ctx')
              }
              return await ctx.runMutation(component.adapter.deleteMany, {
                input: { model, where },
              })
            },

            count: async ({ model, where }): Promise<number> => {
              const results = await ctx.runQuery(component.adapter.findMany, {
                model,
                where,
              })
              return results.length
            },
          }
        },
      })
    },

    /**
     * Helper to get Better Auth instance with headers
     */
    async getAuth(createAuth: (ctx: any) => any, ctx: GenericCtx<DataModel>) {
      const auth = createAuth(ctx)

      // In Convex, we can get the auth token from the context
      const headers = new Headers()
      if (ctx.auth?.getUserIdentity) {
        const identity = await ctx.auth.getUserIdentity()
        if (identity?.tokenIdentifier) {
          headers.set('Authorization', `Bearer ${identity.tokenIdentifier}`)
        }
      }

      return { auth, headers }
    },

    /**
     * Helper to get the authenticated user
     */
    async getAuthUser(ctx: GenericCtx<DataModel>) {
      if (ctx.auth?.getUserIdentity) {
        const identity = await ctx.auth.getUserIdentity()
        if (identity) {
          // Query the user from the database
          const user = await ctx.runQuery(component.adapter.findOne, {
            model: 'user',
            where: [{ field: '_id', value: identity.subject, operator: 'eq' }],
          })
          if (!user) {
            throw new Error('Unauthenticated')
          }
          return user
        }
      }
      throw new Error('Unauthenticated')
    },

    /**
     * Safely get the authenticated user (returns null instead of throwing)
     */
    async safeGetAuthUser(ctx: GenericCtx<DataModel>) {
      if (ctx.auth?.getUserIdentity) {
        const identity = await ctx.auth.getUserIdentity()
        if (identity) {
          // Query the user from the database
          const user = await ctx.runQuery(component.adapter.findOne, {
            model: 'user',
            where: [{ field: '_id', value: identity.subject, operator: 'eq' }],
          })
          return user
        }
      }
      return null
    },

    /**
     * Get user by their Better Auth ID
     */
    async getAnyUserById(ctx: GenericCtx<DataModel>, id: string) {
      return await ctx.runQuery(component.adapter.findOne, {
        model: 'user',
        where: [{ field: '_id', value: id }],
      })
    },

    /**
     * Get user by legacy userId field (migration helper)
     */
    async migrationGetUser(ctx: GenericCtx<DataModel>, userId: string) {
      return await ctx.runQuery(component.adapter.findOne, {
        model: 'user',
        where: [{ field: 'userId', value: userId }],
      })
    },

    /**
     * Triggers API for component lifecycle hooks
     */
    triggersApi() {
      return {
        onCreate: async (ctx: any, doc: any) => {
          if (config?.triggers?.user?.onCreate) {
            await config.triggers.user.onCreate(ctx, doc)
          }
        },
        onUpdate: async (ctx: any, newDoc: any, oldDoc: any) => {
          if (config?.triggers?.user?.onUpdate) {
            await config.triggers.user.onUpdate(ctx, newDoc, oldDoc)
          }
        },
        onDelete: async (ctx: any, doc: any) => {
          if (config?.triggers?.user?.onDelete) {
            await config.triggers.user.onDelete(ctx, doc)
          }
        },
      }
    },

    /**
     * Helper to set the userId field (for migrations)
     */
    async setUserId(ctx: GenericCtx<DataModel>, authUserId: string, appUserId: string) {
      await ctx.runMutation(component.adapter.updateOne, {
        input: {
          model: 'user',
          where: [{ field: '_id', value: authUserId, operator: 'eq' }],
          update: { userId: appUserId },
        },
      })
    },

    /**
     * Helper for migrations - remove userId
     */
    async migrationRemoveUserId(ctx: GenericCtx<DataModel>, userId: string) {
      if (component.adapter.migrationRemoveUserId) {
        await ctx.runMutation(component.adapter.migrationRemoveUserId, {
          userId,
        })
      }
    },

    /**
     * Register Better Auth HTTP routes with Convex HTTP router
     * Handles CORS and forwards requests to Better Auth
     */
    registerRoutes(
      http: any,
      createAuth: (ctx: GenericCtx<DataModel>, options?: any) => any,
      opts: {
        cors?: boolean | {
          allowedOrigins?: string[]
          allowedHeaders?: string[]
          exposedHeaders?: string[]
        }
      } = {},
    ) {
      // Get static auth to determine base path
      const staticAuth = createAuth({} as any, { optionsOnly: true })
      const path = staticAuth.options.basePath ?? '/api/auth'

      // Create the auth request handler
      const authRequestHandler = httpActionGeneric(async (ctx: any, request: Request) => {
        const auth = createAuth(ctx)
        return await auth.handler(request)
      })

      // If CORS is disabled, just register the routes
      if (!opts.cors) {
        http.route({
          pathPrefix: `${path}/`,
          method: 'GET',
          handler: authRequestHandler,
        })

        http.route({
          pathPrefix: `${path}/`,
          method: 'POST',
          handler: authRequestHandler,
        })

        return
      }

      // Setup CORS with Better Auth's trusted origins
      const corsOpts
        = typeof opts.cors === 'boolean'
          ? { allowedOrigins: [], allowedHeaders: [], exposedHeaders: [] }
          : opts.cors

      const cors = corsRouter(http, {
        allowedOrigins: async (_request: Request) => {
          // Get trusted origins from static auth options
          const trustedOrigins = staticAuth.options.trustedOrigins ?? []
          const trustedOriginsArray = Array.isArray(trustedOrigins)
            ? trustedOrigins
            : []

          return trustedOriginsArray
            .map((origin: string) =>
              // Strip trailing wildcards, unsupported for allowedOrigins
              origin.endsWith('*') && origin.length > 1
                ? origin.slice(0, -1)
                : origin,
            )
            .concat(corsOpts.allowedOrigins ?? [])
        },
        allowCredentials: true,
        allowedHeaders: [
          'Content-Type',
          'Better-Auth-Cookie',
          'Authorization',
        ].concat(corsOpts.allowedHeaders ?? []),
        exposedHeaders: ['Set-Better-Auth-Cookie'].concat(
          corsOpts.exposedHeaders ?? [],
        ),
        debug: config?.verbose,
        enforceAllowOrigins: false,
      })

      cors.route({
        pathPrefix: `${path}/`,
        method: 'GET',
        handler: authRequestHandler,
      })

      cors.route({
        pathPrefix: `${path}/`,
        method: 'POST',
        handler: authRequestHandler,
      })
    },
  }
}
