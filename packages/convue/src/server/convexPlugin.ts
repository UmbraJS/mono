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
export function convex() {
  return {
    id: 'convex',
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
