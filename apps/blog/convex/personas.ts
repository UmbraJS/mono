import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Create a new persona for the authenticated user
 */
export const create = mutation({
  args: {
    name: v.string(),
    handle: v.string(),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    identityTags: v.array(v.object({
      id: v.string(),
      subject: v.string(),
      name: v.string(),
      fervor: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject

    // Check if handle is already taken
    const existing = await ctx.db
      .query("personas")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first()

    if (existing) {
      throw new Error("Handle already taken")
    }

    const now = Date.now()

    // Create the persona
    const personaId = await ctx.db.insert("personas", {
      name: args.name,
      handle: args.handle,
      bio: args.bio,
      avatarUrl: args.avatarUrl,
      identityTags: args.identityTags,
      createdAt: now,
      updatedAt: now,
    })

    // Add the creator as owner
    await ctx.db.insert("personaMembers", {
      personaId,
      userId,
      role: "owner",
      joinedAt: now,
    })

    return personaId
  },
})

/**
 * Update an existing persona (only owners can update)
 */
export const update = mutation({
  args: {
    personaId: v.id("personas"),
    name: v.optional(v.string()),
    handle: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    identityTags: v.optional(v.array(v.object({
      id: v.string(),
      subject: v.string(),
      name: v.string(),
      fervor: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    }))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject

    // Check if user is owner
    const membership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", userId)
      )
      .first()

    if (!membership || membership.role !== "owner") {
      throw new Error("Only owners can update personas")
    }

    // If handle is being changed, check if new handle is available
    if (args.handle) {
      const existing = await ctx.db
        .query("personas")
        .withIndex("by_handle", (q) => q.eq("handle", args.handle))
        .first()

      if (existing && existing._id !== args.personaId) {
        throw new Error("Handle already taken")
      }
    }

    const persona = await ctx.db.get(args.personaId)
    if (!persona) {
      throw new Error("Persona not found")
    }

    // Update the persona
    await ctx.db.patch(args.personaId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.handle !== undefined && { handle: args.handle }),
      ...(args.bio !== undefined && { bio: args.bio }),
      ...(args.avatarUrl !== undefined && { avatarUrl: args.avatarUrl }),
      ...(args.identityTags !== undefined && { identityTags: args.identityTags }),
      updatedAt: Date.now(),
    })

    return args.personaId
  },
})

/**
 * Get all personas for the current user
 */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    const userId = identity.subject

    // Get all persona memberships for this user
    const memberships = await ctx.db
      .query("personaMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    // Fetch the actual personas
    const personas = await Promise.all(
      memberships.map(async (membership) => {
        const persona = await ctx.db.get(membership.personaId)
        return persona ? { ...persona, role: membership.role } : null
      })
    )

    return personas.filter((p) => p !== null)
  },
})

/**
 * Get a specific persona by ID
 */
export const getById = query({
  args: { personaId: v.id("personas") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.personaId)
  },
})

/**
 * Get a persona by handle
 */
export const getByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("personas")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first()
  },
})

/**
 * Get all members of a persona
 */
export const listMembers = query({
  args: { personaId: v.id("personas") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId", (q) => q.eq("personaId", args.personaId))
      .collect()

    // Fetch user details for each member
    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db
          .query("user")
          .filter((q) => q.eq(q.field("_id"), membership.userId))
          .first()

        return {
          userId: membership.userId,
          role: membership.role,
          joinedAt: membership.joinedAt,
          user,
        }
      })
    )

    return members
  },
})

/**
 * Add a member to a persona (only owners can add members)
 */
export const addMember = mutation({
  args: {
    personaId: v.id("personas"),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const currentUserId = identity.subject

    // Check if current user is owner
    const currentMembership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", currentUserId)
      )
      .first()

    if (!currentMembership || currentMembership.role !== "owner") {
      throw new Error("Only owners can add members")
    }

    // Check if user is already a member
    const existingMembership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", args.userId)
      )
      .first()

    if (existingMembership) {
      throw new Error("User is already a member")
    }

    // Add the member
    await ctx.db.insert("personaMembers", {
      personaId: args.personaId,
      userId: args.userId,
      role: args.role,
      joinedAt: Date.now(),
    })
  },
})

/**
 * Remove a member from a persona (owners can remove others, anyone can remove themselves)
 */
export const removeMember = mutation({
  args: {
    personaId: v.id("personas"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const currentUserId = identity.subject

    // Check if current user is owner or removing themselves
    const currentMembership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", currentUserId)
      )
      .first()

    const isOwner = currentMembership?.role === "owner"
    const isSelf = currentUserId === args.userId

    if (!isOwner && !isSelf) {
      throw new Error("Only owners can remove other members")
    }

    // Find the membership to remove
    const membershipToRemove = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", args.userId)
      )
      .first()

    if (!membershipToRemove) {
      throw new Error("Member not found")
    }

    // Prevent removing the last owner
    if (membershipToRemove.role === "owner") {
      const ownerCount = await ctx.db
        .query("personaMembers")
        .withIndex("by_personaId", (q) => q.eq("personaId", args.personaId))
        .collect()
        .then(members => members.filter(m => m.role === "owner").length)

      if (ownerCount <= 1) {
        throw new Error("Cannot remove the last owner")
      }
    }

    // Remove the member
    await ctx.db.delete(membershipToRemove._id)
  },
})

/**
 * Update a member's role (only owners can change roles)
 */
export const updateMemberRole = mutation({
  args: {
    personaId: v.id("personas"),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const currentUserId = identity.subject

    // Check if current user is owner
    const currentMembership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", currentUserId)
      )
      .first()

    if (!currentMembership || currentMembership.role !== "owner") {
      throw new Error("Only owners can change roles")
    }

    // Find the membership to update
    const membershipToUpdate = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", args.userId)
      )
      .first()

    if (!membershipToUpdate) {
      throw new Error("Member not found")
    }

    // If demoting an owner, ensure there's at least one owner left
    if (membershipToUpdate.role === "owner" && args.role !== "owner") {
      const ownerCount = await ctx.db
        .query("personaMembers")
        .withIndex("by_personaId", (q) => q.eq("personaId", args.personaId))
        .collect()
        .then(members => members.filter(m => m.role === "owner").length)

      if (ownerCount <= 1) {
        throw new Error("Cannot demote the last owner")
      }
    }

    // Update the role
    await ctx.db.patch(membershipToUpdate._id, { role: args.role })
  },
})

/**
 * Delete a persona (only owners can delete, requires confirmation)
 */
export const remove = mutation({
  args: {
    personaId: v.id("personas"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject

    // Check if user is owner
    const membership = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId_userId", (q) => 
        q.eq("personaId", args.personaId).eq("userId", userId)
      )
      .first()

    if (!membership || membership.role !== "owner") {
      throw new Error("Only owners can delete personas")
    }

    // Delete all memberships
    const memberships = await ctx.db
      .query("personaMembers")
      .withIndex("by_personaId", (q) => q.eq("personaId", args.personaId))
      .collect()

    for (const m of memberships) {
      await ctx.db.delete(m._id)
    }

    // Delete the persona
    await ctx.db.delete(args.personaId)
  },
})
