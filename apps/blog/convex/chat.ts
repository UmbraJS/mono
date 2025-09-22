import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    userId: v.string(),
    body: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("REX: sendMessage called");

    // Update or create user with the current display name
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user's display name and last seen
      await ctx.db.patch(existingUser._id, {
        displayName: args.displayName,
        lastSeen: now,
      });
    } else {
      // Create new user record
      await ctx.db.insert("users", {
        userId: args.userId,
        displayName: args.displayName,
        lastSeen: now,
      });
    }

    // Insert the message
    await ctx.db.insert("messages", {
      userId: args.userId,
      body: args.body,
    });
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(50);

    // Get user info for each message
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", message.userId))
          .first();

        return {
          ...message,
          lastSeen: user?.lastSeen || 0,
          displayName: user?.displayName || "Anonymous",
        };
      })
    );

    return messagesWithUsers.reverse();
  },
});

export const updateUserPresence = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    console.log("REX: updateUserPresence called for", args.userId);

    const now = Date.now();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        lastSeen: now,
      });
    } else {
      console.log("REX: Creating new user record for", args.userId);
      await ctx.db.insert("users", {
        userId: args.userId,
        displayName: "Anonymous",
        lastSeen: now,
      });
    }
  },
});

export const setUserOffline = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("REX: setUserOffline called for", args.userId);

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (user) {
      // Just update lastSeen - no need to explicitly set offline
      await ctx.db.patch(user._id, {
        lastSeen: Date.now(),
      });
    }
  },
});

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return user ? {
      userId: user.userId,
      displayName: user.displayName,
      lastSeen: user.lastSeen
    } : null;
  },
});

export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes

    // Get users who were seen within the last 5 minutes
    const users = await ctx.db
      .query("users")
      .filter((q) => q.gt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    return users.map(user => ({
      userId: user.userId,
      displayName: user.displayName,
      lastSeen: user.lastSeen,
      isOnline: true, // All returned users are considered online by definition
    }));
  },
});

export const cleanupStaleUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // This function is now less necessary since we compute online status dynamically
    // But we could use it to delete very old user records if needed
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1 week

    const veryOldUsers = await ctx.db
      .query("users")
      .filter((q) => q.lt(q.field("lastSeen"), oneWeekAgo))
      .collect();

    let deletedCount = 0;
    for (const user of veryOldUsers) {
      await ctx.db.delete(user._id);
      deletedCount++;
    }

    console.log(`REX Cleaned up ${deletedCount} very old user records`);
    return { deletedCount };
  },
});
