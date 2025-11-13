import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  // Renamed from 'users' to avoid conflict with auth tables
  chatUsers: defineTable({
    userId: v.string(),
    displayName: v.string(),
    lastSeen: v.number(),
  }).index("by_userId", ["userId"]),
  messages: defineTable({
    userId: v.string(),
    body: v.string(),
  }).index("by_userId", ["userId"]),
  emojiEvents: defineTable({
    userId: v.string(),
    emoji: v.string(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_userId_timestamp", ["userId", "timestamp"]),
});

export default schema;
