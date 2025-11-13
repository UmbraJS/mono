/**
 * Creates CRUD API functions for Better Auth integration with Convex
 *
 * Generates mutations and queries that Better Auth can use to interact
 * with the Convex database for authentication operations.
 */

import type { GenericDataModel, SchemaDefinition } from 'convex/server'
import { mutationGeneric, queryGeneric } from 'convex/server'
import { v } from 'convex/values'

export type CreateAuth<_DataModel extends GenericDataModel>
  = | ((ctx: any) => any)
  | ((ctx: any, opts?: { optionsOnly?: boolean }) => any)

/**
 * Generates the CRUD operations that Better Auth needs to work with Convex
 */
export function createApi<
  DataModel extends GenericDataModel,
  Schema extends SchemaDefinition<any, any>,
>(_schema: Schema, _createAuth: CreateAuth<DataModel>) {
  // Get the validator for where clauses
  const whereValidator = v.array(
    v.object({
      field: v.string(),
      value: v.union(
        v.string(),
        v.number(),
        v.boolean(),
        v.array(v.string()),
        v.array(v.number()),
        v.null(),
      ),
      operator: v.optional(
        v.union(
          v.literal('lt'),
          v.literal('lte'),
          v.literal('gt'),
          v.literal('gte'),
          v.literal('eq'),
          v.literal('in'),
          v.literal('not_in'),
          v.literal('ne'),
          v.literal('contains'),
          v.literal('starts_with'),
          v.literal('ends_with'),
        ),
      ),
      connector: v.optional(v.union(v.literal('AND'), v.literal('OR'))),
    }),
  )

  return {
    /**
     * Create a new document
     */
    create: mutationGeneric({
      args: {
        input: v.union(
          v.object({
            model: v.string(),
            data: v.any(),
          }),
        ),
        select: v.optional(v.array(v.string())),
        onCreateHandle: v.optional(v.string()),
      },
      handler: async (ctx: any, args: any) => {
        const { model, data } = args.input
        const result = await ctx.db.insert(model, data)
        const doc = await ctx.db.get(result)
        return doc
      },
    }),

    /**
     * Find a single document
     */
    findOne: queryGeneric({
      args: {
        model: v.string(),
        where: v.optional(whereValidator),
        select: v.optional(v.array(v.string())),
      },
      handler: async (ctx: any, args: any) => {
        const { model, where } = args

        // Simple implementation - get all and filter
        // In production, you'd want to use indexes
        const all = await ctx.db.query(model).collect()

        if (!where || where.length === 0) {
          return all[0] || null
        }

        // Apply where filters
        const filtered = all.filter((doc: any) => {
          return where.every((condition: any) => {
            const { field, value, operator = 'eq' } = condition
            const docValue = doc[field]

            switch (operator) {
              case 'eq':
                return docValue === value
              case 'ne':
                return docValue !== value
              case 'lt':
                return docValue < value
              case 'lte':
                return docValue <= value
              case 'gt':
                return docValue > value
              case 'gte':
                return docValue >= value
              case 'in':
                return Array.isArray(value) && value.includes(docValue)
              case 'not_in':
                return Array.isArray(value) && !value.includes(docValue)
              case 'contains':
                return typeof docValue === 'string' && docValue.includes(String(value))
              case 'starts_with':
                return typeof docValue === 'string' && docValue.startsWith(String(value))
              case 'ends_with':
                return typeof docValue === 'string' && docValue.endsWith(String(value))
              default:
                return false
            }
          })
        })

        return filtered[0] || null
      },
    }),

    /**
     * Find multiple documents
     */
    findMany: queryGeneric({
      args: {
        model: v.string(),
        where: v.optional(whereValidator),
        limit: v.optional(v.number()),
        offset: v.optional(v.number()),
        sortBy: v.optional(
          v.object({
            field: v.string(),
            direction: v.union(v.literal('asc'), v.literal('desc')),
          }),
        ),
        select: v.optional(v.array(v.string())),
      },
      handler: async (ctx: any, args: any) => {
        const { model, where, limit, sortBy } = args

        let all = await ctx.db.query(model).collect()

        // Apply where filters
        if (where && where.length > 0) {
          all = all.filter((doc: any) => {
            return where.every((condition: any) => {
              const { field, value, operator = 'eq' } = condition
              const docValue = doc[field]

              switch (operator) {
                case 'eq':
                  return docValue === value
                case 'ne':
                  return docValue !== value
                case 'lt':
                  return docValue < value
                case 'lte':
                  return docValue <= value
                case 'gt':
                  return docValue > value
                case 'gte':
                  return docValue >= value
                case 'in':
                  return Array.isArray(value) && value.includes(docValue)
                case 'not_in':
                  return Array.isArray(value) && !value.includes(docValue)
                case 'contains':
                  return typeof docValue === 'string' && docValue.includes(String(value))
                case 'starts_with':
                  return typeof docValue === 'string' && docValue.startsWith(String(value))
                case 'ends_with':
                  return typeof docValue === 'string' && docValue.endsWith(String(value))
                default:
                  return false
              }
            })
          })
        }

        // Apply sorting
        if (sortBy) {
          all.sort((a: any, b: any) => {
            const aVal = a[sortBy.field]
            const bVal = b[sortBy.field]
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
            return sortBy.direction === 'desc' ? -comparison : comparison
          })
        }

        // Apply limit
        if (limit) {
          all = all.slice(0, limit)
        }

        return all
      },
    }),

    /**
     * Update a single document
     */
    updateOne: mutationGeneric({
      args: {
        input: v.object({
          model: v.string(),
          where: v.optional(whereValidator),
          update: v.any(),
        }),
        onUpdateHandle: v.optional(v.string()),
      },
      handler: async (ctx: any, args: any) => {
        const { model, where, update } = args.input

        // Find the document
        const all = await ctx.db.query(model).collect()

        let doc = all[0]
        if (where && where.length > 0) {
          doc = all.find((d: any) => {
            return where.every((condition: any) => {
              const { field, value, operator = 'eq' } = condition
              return operator === 'eq' ? d[field] === value : false
            })
          })
        }

        if (!doc) {
          return null
        }

        // Update the document
        await ctx.db.patch(doc._id, update)
        return await ctx.db.get(doc._id)
      },
    }),

    /**
     * Update multiple documents
     */
    updateMany: mutationGeneric({
      args: {
        input: v.object({
          model: v.string(),
          where: v.optional(whereValidator),
          update: v.any(),
        }),
        onUpdateHandle: v.optional(v.string()),
      },
      handler: async (ctx: any, args: any) => {
        const { model, where, update } = args.input

        const all = await ctx.db.query(model).collect()

        let docsToUpdate = all
        if (where && where.length > 0) {
          docsToUpdate = all.filter((d: any) => {
            return where.every((condition: any) => {
              const { field, value, operator = 'eq' } = condition
              return operator === 'eq' ? d[field] === value : false
            })
          })
        }

        // Update all matching documents
        await Promise.all(
          docsToUpdate.map((doc: any) => ctx.db.patch(doc._id, update)),
        )

        return docsToUpdate.length
      },
    }),

    /**
     * Delete a single document
     */
    deleteOne: mutationGeneric({
      args: {
        input: v.object({
          model: v.string(),
          where: v.optional(whereValidator),
        }),
      },
      handler: async (ctx: any, args: any) => {
        const { model, where } = args.input

        const all = await ctx.db.query(model).collect()

        let doc = all[0]
        if (where && where.length > 0) {
          doc = all.find((d: any) => {
            return where.every((condition: any) => {
              const { field, value, operator = 'eq' } = condition
              return operator === 'eq' ? d[field] === value : false
            })
          })
        }

        if (!doc) {
          return
        }

        await ctx.db.delete(doc._id)
      },
    }),

    /**
     * Delete multiple documents
     */
    deleteMany: mutationGeneric({
      args: {
        input: v.object({
          model: v.string(),
          where: v.optional(whereValidator),
        }),
      },
      handler: async (ctx: any, args: any) => {
        const { model, where } = args.input

        const all = await ctx.db.query(model).collect()

        let docsToDelete = all
        if (where && where.length > 0) {
          docsToDelete = all.filter((d: any) => {
            return where.every((condition: any) => {
              const { field, value, operator = 'eq' } = condition
              return operator === 'eq' ? d[field] === value : false
            })
          })
        }

        // Delete all matching documents
        await Promise.all(
          docsToDelete.map((doc: any) => ctx.db.delete(doc._id)),
        )

        return docsToDelete.length
      },
    }),

    /**
     * Migration helper to remove userId field
     */
    migrationRemoveUserId: mutationGeneric({
      args: {
        userId: v.string(),
      },
      handler: async (ctx: any, args: any) => {
        await ctx.db.patch(args.userId as any, {
          userId: undefined,
        })
      },
    }),
  }
}
