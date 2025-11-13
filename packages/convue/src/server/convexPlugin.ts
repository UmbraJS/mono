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
export function convex() {
  return {
    id: 'convex',
    endpoints: {
      '/convex/token': {
        method: 'POST',
        handler: async (ctx: any) => {
          // Get the session from the request
          const session = await ctx.getSession()

          if (!session) {
            return ctx.json({ error: 'Unauthorized' }, { status: 401 })
          }

          // Return the session token - Convex will validate this on the backend
          return ctx.json({
            token: session.session.token || session.session.id,
          })
        },
      },
    },
    init(_ctx: any) {
      // Configure for Convex
      return {
        options: {
          advanced: {
            // Use Convex's auto-generated IDs
            generateId: false as const,
          },
        },
      }
    },
  }
}
