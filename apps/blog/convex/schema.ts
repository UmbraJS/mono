import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables as authTables } from "./betterAuth/generatedSchema";

const schema = defineSchema({
  ...authTables,
  // Personas - public identities that users can create and manage
  personas: defineTable({
    name: v.string(),
    handle: v.string(), // Unique identifier like @username
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    identityTags: v.array(v.object({
      id: v.string(),
      subject: v.string(),
      name: v.string(),
      fervor: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_handle', ['handle'])
    .index('by_createdAt', ['createdAt']),
  // Junction table for many-to-many relationship between users and personas
  personaMembers: defineTable({
    personaId: v.id('personas'),
    userId: v.string(), // References Better Auth user.id
    role: v.union(v.literal('owner'), v.literal('editor'), v.literal('viewer')),
    joinedAt: v.number(),
  })
    .index('by_personaId', ['personaId'])
    .index('by_userId', ['userId'])
    .index('by_personaId_userId', ['personaId', 'userId']),
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
    slug: v.optional(v.string()), // Unique identifier for page-specific chatrooms
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_slug", ["slug"]),
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
    personaId: v.id('personas'), // Who sent the message (public identity)
    chatroomId: v.id("chatrooms"),
    body: v.string(),
    timestamp: v.number(),
  }).index('by_personaId', ['personaId'])
    .index("by_chatroomId_timestamp", ["chatroomId", "timestamp"]),
  emojiEvents: defineTable({
    personaId: v.id('personas'), // Who sent the emoji (public identity)
    chatroomId: v.id("chatrooms"),
    emoji: v.string(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index('by_personaId_timestamp', ['personaId', 'timestamp'])
    .index("by_chatroomId_timestamp", ["chatroomId", "timestamp"]),
  posts: defineTable({
    title: v.any(),
    slug: v.string(),
    content: v.any(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    personaId: v.optional(v.id('personas')), // Post author is now a persona
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index('by_personaId', ['personaId']),
});

export default schema;
