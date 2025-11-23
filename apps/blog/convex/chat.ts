import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { components } from "./_generated/api";

// Chatroom management
export const createChatroom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    isPrivate: v.boolean(),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const chatroomId = await ctx.db.insert("chatrooms", {
      name: args.name,
      description: args.description,
      createdBy: args.createdBy,
      createdAt: Date.now(),
      isPrivate: args.isPrivate,
      slug: args.slug,
    });
    return chatroomId;
  },
});

export const getChatrooms = query({
  args: {},
  handler: async (ctx) => {
    const chatrooms = await ctx.db
      .query("chatrooms")
      .order("desc")
      .collect();

    return chatrooms;
  },
});

export const getChatroom = query({
  args: { chatroomId: v.id("chatrooms") },
  handler: async (ctx, args) => {
    const chatroom = await ctx.db.get(args.chatroomId);
    return chatroom;
  },
});

export const getChatroomBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const chatroom = await ctx.db
      .query("chatrooms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return chatroom;
  },
});

export const sendMessageToSlug = mutation({
  args: {
    personaId: v.id('personas'),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the persona to find userId for chatroom creation
    const persona = await ctx.db.get(args.personaId);
    if (!persona) {
      throw new Error("Persona not found");
    }

    // Get persona membership to find userId
    const membership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId", (q) => q.eq("personaId", args.personaId))
      .first();

    if (!membership) {
      throw new Error("Persona membership not found");
    }

    // Check if chatroom exists
    let chatroom = await ctx.db
      .query("chatrooms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    // Create chatroom if it doesn't exist
    if (!chatroom) {
      const chatroomId = await ctx.db.insert("chatrooms", {
        name: args.name,
        description: args.description,
        createdBy: membership.userId,
        createdAt: Date.now(),
        isPrivate: false,
        slug: args.slug,
      });
      chatroom = await ctx.db.get(chatroomId);
      if (!chatroom) throw new Error("Failed to create chatroom");
    }

    // Insert the message with timestamp
    await ctx.db.insert("messages", {
      personaId: args.personaId,
      chatroomId: chatroom._id,
      body: args.body,
      timestamp: Date.now(),
    });

    // Update user presence for this chatroom
    const existingPresence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId_chatroomId", (q) =>
        q.eq("userId", membership.userId).eq("chatroomId", chatroom._id)
      )
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId: membership.userId,
        chatroomId: chatroom._id,
        lastSeen: Date.now(),
      });
    }

    return chatroom._id;
  },
});

export const sendMessage = mutation({
  args: {
    personaId: v.id('personas'),
    chatroomId: v.id("chatrooms"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Get persona membership to find userId for presence tracking
    const membership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId", (q) => q.eq("personaId", args.personaId))
      .first();

    if (!membership) {
      throw new Error("Persona membership not found");
    }

    // Insert the message with timestamp
    await ctx.db.insert("messages", {
      personaId: args.personaId,
      chatroomId: args.chatroomId,
      body: args.body,
      timestamp: Date.now(),
    });

    // Update user presence for this chatroom
    const existingPresence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId_chatroomId", (q) =>
        q.eq("userId", membership.userId).eq("chatroomId", args.chatroomId)
      )
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId: membership.userId,
        chatroomId: args.chatroomId,
        lastSeen: Date.now(),
      });
    }
  },
});

export const getMessages = query({
  args: { chatroomId: v.id("chatrooms") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatroomId_timestamp", (q) =>
        q.eq("chatroomId", args.chatroomId)
      )
      .order("desc")
      .take(50);

    // Enrich messages with persona display names
    const messagesWithPersonas = await Promise.all(
      messages.map(async (message) => {
        const persona = await ctx.db.get(message.personaId);
        const displayName = persona?.name || "Anonymous";
        return {
          ...message,
          displayName,
          personaHandle: persona?.handle,
        };
      })
    );

    return messagesWithPersonas.reverse();
  },
});

export const updateUserPresence = mutation({
  args: {
    userId: v.string(),
    chatroomId: v.optional(v.id("chatrooms")),
  },
  handler: async (ctx, args) => {
    const existingPresence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId_chatroomId", (q) =>
        q.eq("userId", args.userId).eq("chatroomId", args.chatroomId)
      )
      .first();

    const now = Date.now();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastSeen: now,
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId: args.userId,
        chatroomId: args.chatroomId,
        lastSeen: now,
      });
    }
  },
});

export const setUserOffline = mutation({
  args: {
    userId: v.string(),
    chatroomId: v.optional(v.id("chatrooms")),
  },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("userPresence")
      .withIndex("by_userId_chatroomId", (q) =>
        q.eq("userId", args.userId).eq("chatroomId", args.chatroomId)
      )
      .first();

    if (presence) {
      await ctx.db.patch(presence._id, {
        lastSeen: Date.now(),
      });
    }
  },
});

export const getOnlineUsers = query({
  args: { chatroomId: v.optional(v.id("chatrooms")) },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes

    // Get users who were seen within the last 5 minutes in this chatroom
    const presences = await ctx.db
      .query("userPresence")
      .withIndex("by_chatroomId", (q) => q.eq("chatroomId", args.chatroomId))
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
    personaId: v.id('personas'),
    chatroomId: v.id("chatrooms"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtySecondsAgo = now - 30 * 1000; // 30 seconds ago

    // Check how many emojis this persona has sent in the last 30 seconds
    const recentEmojiEvents = await ctx.db
      .query("emojiEvents")
      .withIndex("by_personaId_timestamp", (q) =>
        q.eq("personaId", args.personaId).gt("timestamp", thirtySecondsAgo)
      )
      .collect();

    if (recentEmojiEvents.length >= 30) {
      throw new Error("Rate limit exceeded: too many emojis sent recently. Please wait before sending more.");
    }

    // Insert the emoji event
    await ctx.db.insert("emojiEvents", {
      personaId: args.personaId,
      chatroomId: args.chatroomId,
      emoji: args.emoji,
      timestamp: now,
    });
  },
});

export const getRecentEmojiEvents = query({
  args: { chatroomId: v.id("chatrooms") },
  handler: async (ctx, args) => {
    // Get emoji events from the last 10 seconds to catch real-time events
    const tenSecondsAgo = Date.now() - 10 * 1000;

    const emojiEvents = await ctx.db
      .query("emojiEvents")
      .withIndex("by_chatroomId_timestamp", (q) =>
        q.eq("chatroomId", args.chatroomId).gt("timestamp", tenSecondsAgo)
      )
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
