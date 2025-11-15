import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { components } from "./_generated/api";

export const sendMessage = mutation({
  args: {
    userId: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert the message with timestamp
    await ctx.db.insert("messages", {
      userId: args.userId,
      body: args.body,
      timestamp: Date.now(),
    });

    // Update user presence
    const existingPresence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId: args.userId,
        lastSeen: Date.now(),
      });
    }
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(50);

    // Enrich messages with user display names from Better Auth component
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const userId = message.userId as Id<"user">;
        const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: "user",
          where: [{ field: "_id", value: userId, operator: "eq", connector: "AND" }]
        });
        const displayName = user?.name || "Anonymous";
        return {
          ...message,
          displayName,
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
    const existingPresence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastSeen: now,
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId: args.userId,
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
    const presence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (presence) {
      await ctx.db.patch(presence._id, {
        lastSeen: Date.now(),
      });
    }
  },
});

export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes

    // Get users who were seen within the last 5 minutes
    const presences = await ctx.db
      .query("userPresence")
      .withIndex("by_lastSeen")
      .filter((q) => q.gt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    // Get display names from user table in Better Auth component
    const usersWithNames = await Promise.all(
      presences.map(async (presence) => {
        const userId = presence.userId as Id<"user">;
        const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: "user",
          where: [{ field: "_id", value: userId, operator: "eq", connector: "AND" }],
        });

        const displayName: string = user?.name || "Anonymous";

        return {
          userId: presence.userId,
          displayName,
          lastSeen: presence.lastSeen,
          isOnline: true,
        };
      })
    );

    return usersWithNames;
  },
});

export const cleanupStaleUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete presence records older than 1 week to prevent database bloat
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1 week

    const veryOldPresences = await ctx.db
      .query("userPresence")
      .withIndex("by_lastSeen")
      .filter((q) => q.lt(q.field("lastSeen"), oneWeekAgo))
      .collect();

    let deletedCount = 0;
    for (const presence of veryOldPresences) {
      await ctx.db.delete(presence._id);
      deletedCount++;
    }

    return { deletedCount };
  },
});

export const sendEmoji = mutation({
  args: {
    userId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtySecondsAgo = now - 30 * 1000; // 30 seconds ago

    // Check how many emojis this user has sent in the last 30 seconds
    const recentEmojiEvents = await ctx.db
      .query("emojiEvents")
      .withIndex("by_userId_timestamp", (q) =>
        q.eq("userId", args.userId).gt("timestamp", thirtySecondsAgo)
      )
      .collect();

    if (recentEmojiEvents.length >= 30) {
      throw new Error("Rate limit exceeded: too many emojis sent recently. Please wait before sending more.");
    }

    // Insert the emoji event
    await ctx.db.insert("emojiEvents", {
      userId: args.userId,
      emoji: args.emoji,
      timestamp: now,
    });
  },
});

export const getRecentEmojiEvents = query({
  args: {},
  handler: async (ctx) => {
    // Get emoji events from the last 10 seconds to catch real-time events
    const tenSecondsAgo = Date.now() - 10 * 1000;

    const emojiEvents = await ctx.db
      .query("emojiEvents")
      .withIndex("by_timestamp", (q) => q.gt("timestamp", tenSecondsAgo))
      .collect();

    return emojiEvents;
  },
});

export const cleanupOldEmojiEvents = mutation({
  args: {},
  handler: async (ctx) => {
    // Clean up emoji events older than 1 minute to prevent database bloat
    const oneMinuteAgo = Date.now() - 60 * 1000;

    const oldEvents = await ctx.db
      .query("emojiEvents")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", oneMinuteAgo))
      .collect();

    let deletedCount = 0;
    for (const event of oldEvents) {
      await ctx.db.delete(event._id);
      deletedCount++;
    }

    return { deletedCount };
  },
});
