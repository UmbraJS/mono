import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable({
    userId: v.string(),
    displayName: v.string(),
    lastSeen: v.number(),
  }).index("by_userId", ["userId"]),
  messages: defineTable({
    userId: v.string(),
    body: v.string(),
  }).index("by_userId", ["userId"]),
});
