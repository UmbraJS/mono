/**
 * Creates a Better Auth component client for Convex
 *
 * This provides helper methods for integrating Better Auth with Convex,
 * including the database adapter and authentication utilities.
 */

import type { GenericDataModel } from 'convex/server'

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
  triggers?: Record<string, any>
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
     * Returns the database adapter for Better Auth
     */
    adapter(ctx: GenericCtx<DataModel>) {
      return {
        id: 'convex',

        async create(data: { model: string, data: any, select?: string[] }) {
          const result = await ctx.runMutation(component.adapter.create, {
            input: {
              model: data.model,
              data: data.data,
            },
            select: data.select,
          })
          return result
        },

        async findOne(data: { model: string, where: any[], select?: string[] }) {
          const result = await ctx.runQuery(component.adapter.findOne, {
            model: data.model,
            where: data.where,
            select: data.select,
          })
          return result
        },

        async findMany(data: { model: string, where?: any[], limit?: number, sortBy?: any, select?: string[] }) {
          const result = await ctx.runQuery(component.adapter.findMany, {
            model: data.model,
            where: data.where,
            limit: data.limit,
            sortBy: data.sortBy,
            select: data.select,
          })
          return result
        },

        async update(data: { model: string, where: any[], update: any }) {
          const result = await ctx.runMutation(component.adapter.updateOne, {
            input: {
              model: data.model,
              where: data.where,
              update: data.update,
            },
          })
          return result
        },

        async updateMany(data: { model: string, where: any[], update: any }) {
          const result = await ctx.runMutation(component.adapter.updateMany, {
            input: {
              model: data.model,
              where: data.where,
              update: data.update,
            },
          })
          return result
        },

        async delete(data: { model: string, where: any[] }) {
          await ctx.runMutation(component.adapter.deleteOne, {
            input: {
              model: data.model,
              where: data.where,
            },
          })
        },

        async deleteMany(data: { model: string, where: any[] }) {
          const result = await ctx.runMutation(component.adapter.deleteMany, {
            input: {
              model: data.model,
              where: data.where,
            },
          })
          return result
        },

        async count(data: { model: string, where?: any[] }) {
          // Simple count - query all and count
          const results = await ctx.runQuery(component.adapter.findMany, {
            model: data.model,
            where: data.where,
          })
          return results.length
        },

        options: config,
      }
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
            where: [{ field: 'id', value: identity.subject, operator: 'eq' }],
          })
          return user
        }
      }
      return null
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
  }
}
