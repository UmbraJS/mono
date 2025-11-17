import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables as authTables } from "./betterAuth/generatedSchema";

const schema = defineSchema({
  ...authTables,
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  // Chatrooms
  chatrooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    isPrivate: v.boolean(),
  }).index("by_createdAt", ["createdAt"]),
  // Track user presence/online status (now per room)
  userPresence: defineTable({
    userId: v.string(),
    chatroomId: v.optional(v.id("chatrooms")),
    lastSeen: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_chatroomId", ["chatroomId"])
    .index("by_lastSeen", ["lastSeen"])
    .index("by_userId_chatroomId", ["userId", "chatroomId"]),
  messages: defineTable({
    userId: v.string(),
    chatroomId: v.id("chatrooms"),
    body: v.string(),
    timestamp: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_chatroomId_timestamp", ["chatroomId", "timestamp"]),
  emojiEvents: defineTable({
    userId: v.string(),
    chatroomId: v.id("chatrooms"),
    emoji: v.string(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_userId_timestamp", ["userId", "timestamp"])
    .index("by_chatroomId_timestamp", ["chatroomId", "timestamp"]),
  posts: defineTable({
    title: v.any(),
    slug: v.string(),
    content: v.any(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    authorId: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"]),
});

export default schema;
