import { internalMutation } from "../_generated/server";

/**
 * One-time migration to clear the old users table that conflicts with authTables
 * Run this with: npx convex run migrations/clearOldUsersTable:clearOldUsers
 */
export const clearOldUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const oldUsers = await ctx.db.query("users").collect();

    let deletedCount = 0;
    for (const user of oldUsers) {
      // Only delete users that have the old schema (with displayName and lastSeen)
      if ('displayName' in user && 'lastSeen' in user) {
        await ctx.db.delete(user._id);
        deletedCount++;
      }
    }

    console.log(`Deleted ${deletedCount} old user records`);
    return { deletedCount };
  },
});
