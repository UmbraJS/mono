import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables as authTables } from "./betterAuth/generatedSchema";

const schema = defineSchema({
  ...authTables,
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  // Track user presence/online status
  userPresence: defineTable({
    userId: v.string(),
    lastSeen: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_lastSeen", ["lastSeen"]),
  messages: defineTable({
    userId: v.string(),
    body: v.string(),
    displayName: v.string(),
    timestamp: v.number(),
  }).index("by_userId", ["userId"]),
  emojiEvents: defineTable({
    userId: v.string(),
    emoji: v.string(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_userId_timestamp", ["userId", "timestamp"]),
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
