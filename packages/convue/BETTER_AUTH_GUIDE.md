# Better Auth + Convex + Nuxt Authentication Guide

This guide documents the correct patterns for implementing authentication in a Nuxt app using Better Auth with Convex as the database backend.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Learnings](#key-learnings)
3. [Authentication Patterns](#authentication-patterns)
4. [Common Pitfalls](#common-pitfalls)
5. [Implementation Examples](#implementation-examples)

---

## Architecture Overview

### The Stack

- **Better Auth**: Session-based authentication with HttpOnly cookies
- **Convex**: Backend database and API layer
- **Nuxt**: Frontend framework with server-side rendering
- **Convue**: Integration package bridging Convex + Vue + Better Auth

### Authentication Flow

```
Client (Browser)
    ↓
Better Auth (creates session with HttpOnly cookie)
    ↓
Nuxt Server Proxy (/api/auth/[...slug].ts)
    ↓
Convex HTTP Routes (handles auth endpoints)
    ↓
Better Auth Component (validates session, manages users)
    ↓
Convex Database (sessions, users, accounts tables)
```

---

## Key Learnings

### 1. **DO NOT Use `ctx.auth.getUserIdentity()` with Better Auth**

❌ **Wrong Approach:**
```typescript
// This DOES NOT WORK with Better Auth
export const myMutation = mutation({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    // identity will always be null!
  }
})
```

**Why it fails:** `ctx.auth.getUserIdentity()` requires JWT-based authentication configured through Convex's auth system. Better Auth uses session tokens, not JWTs that Convex can validate via `ctx.auth`.

### 2. **DO Pass userId from Client Side**

✅ **Correct Approach:**
```typescript
// Client side - pass userId explicitly
const { user } = useAuth()

await client.mutation(api.myMutation.create, {
  userId: user.value.id,
  // ... other args
})

// Server side - verify user exists
export const create = mutation({
  args: {
    userId: v.string(),
    // ... other args
  },
  handler: async (ctx, args) => {
    // Verify the user exists in the database
    const user = await authComponent.getAnyUserById(ctx, args.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Now safely use args.userId for operations
    await ctx.db.insert("myTable", {
      userId: args.userId,
      // ... other fields
    })
  }
})
```

**Why this works:**
1. Client has access to authenticated user via Better Auth's `useAuth()` composable
2. userId is passed as a regular parameter
3. Server verifies user exists via `authComponent.getAnyUserById()`
4. No JWT validation required - just database verification

### 3. **HttpOnly Cookies Cannot Be Read by JavaScript**

❌ **This will NOT work:**
```typescript
// Trying to read HttpOnly cookie from JavaScript
const sessionToken = document.cookie
  .split(';')
  .find(c => c.includes('better-auth.session_token'))
// sessionToken will be undefined - HttpOnly cookies are invisible to JS
```

✅ **Instead, use Better Auth's composables:**
```typescript
const { isAuthenticated, user } = useAuth()
// Better Auth handles the HttpOnly cookie internally
```

### 4. **Queries for "My Data" Should Use `safeGetAuthUser()`**

For queries that return user-specific data (like "listMine"), use the safe version:

```typescript
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    // Returns null if not authenticated instead of throwing
    const authUser = await authComponent.safeGetAuthUser(ctx)
    if (!authUser) {
      return [] // Return empty array for unauthenticated users
    }
    
    return await ctx.db
      .query("myTable")
      .filter(q => q.eq(q.field("userId"), authUser.id))
      .collect()
  }
})
```

**Why:** This allows the query to work both when authenticated and not authenticated without throwing errors.

---

## Authentication Patterns

### Pattern 1: Create/Modify Operations (Mutations)

**Use Case:** User creates or modifies their own data

```typescript
// Client
const { user } = useAuth()
const client = useConvexClient()

await client.mutation(api.items.create, {
  userId: user.value.id,
  name: "My Item",
  description: "Item description"
})

// Server
export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verify user exists
    const user = await authComponent.getAnyUserById(ctx, args.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // 2. Perform operation
    const itemId = await ctx.db.insert("items", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      createdAt: Date.now(),
    })
    
    return itemId
  }
})
```

### Pattern 2: Read User's Own Data (Queries)

**Use Case:** List items belonging to the authenticated user

```typescript
// Client
const { data: myItems } = useConvexQuery(api.items.listMine, {})

// Server
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx)
    if (!authUser) {
      return []
    }
    
    return await ctx.db
      .query("items")
      .withIndex("by_userId", q => q.eq("userId", authUser.id))
      .collect()
  }
})
```

### Pattern 3: Admin/Permission Checks

**Use Case:** Verify user has permission to modify a resource

```typescript
export const update = mutation({
  args: {
    userId: v.string(),
    itemId: v.id("items"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verify user exists
    const user = await authComponent.getAnyUserById(ctx, args.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // 2. Get the item
    const item = await ctx.db.get(args.itemId)
    if (!item) {
      throw new Error('Item not found')
    }
    
    // 3. Check ownership
    if (item.userId !== args.userId) {
      throw new Error('You do not have permission to modify this item')
    }
    
    // 4. Perform update
    await ctx.db.patch(args.itemId, {
      name: args.name,
      updatedAt: Date.now(),
    })
  }
})
```

---

## Common Pitfalls

### Pitfall 1: Attempting JWT-Based Authentication

**Problem:** Trying to generate JWT tokens to use with `ctx.auth.getUserIdentity()`

**Why it fails:** Better Auth's Convex plugin doesn't generate valid JWTs that Convex can verify. The "token" it returns is actually just the session token with a signature, not a proper JWT (header.payload.signature format).

**Solution:** Don't try to use JWT authentication. Pass userId explicitly.

### Pitfall 2: Using `authComponent.getAuthUser()` in Mutations

**Problem:**
```typescript
const user = await authComponent.getAuthUser(ctx)
// Throws "Unauthenticated" error
```

**Why it fails:** `getAuthUser()` internally tries to use `ctx.auth.getUserIdentity()`, which doesn't work with Better Auth.

**Solution:** Pass userId from client and verify with `getAnyUserById()`:
```typescript
const user = await authComponent.getAnyUserById(ctx, args.userId)
if (!user) throw new Error('User not found')
```

### Pitfall 3: Inconsistent Auth Patterns Across Codebase

**Problem:** Mixing different authentication approaches (JWT, userId parameter, etc.)

**Solution:** 
- **Mutations:** Always pass `userId` as parameter, verify with `getAnyUserById()`
- **Queries (user-specific):** Use `safeGetAuthUser()` which gracefully handles unauthenticated state
- **Queries (public):** No auth needed
- **Client-side:** Always use `useAuth()` composable to get user info

### Pitfall 4: Not Handling Unauthenticated State in Queries

**Problem:**
```typescript
// This throws error for unauthenticated users
const authUser = await authComponent.getAuthUser(ctx)
```

**Solution:**
```typescript
// This returns null for unauthenticated users
const authUser = await authComponent.safeGetAuthUser(ctx)
if (!authUser) {
  return [] // or appropriate default
}
```

---

## Implementation Examples

### Complete Example: Todo App with Auth

#### Schema (`convex/schema.ts`)

```typescript
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  todos: defineTable({
    userId: v.string(),
    title: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
})
```

#### Mutations (`convex/todos.ts`)

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { authComponent } from "./auth"

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await authComponent.getAnyUserById(ctx, args.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    const todoId = await ctx.db.insert("todos", {
      userId: args.userId,
      title: args.title,
      completed: false,
      createdAt: Date.now(),
    })
    
    return todoId
  }
})

export const toggle = mutation({
  args: {
    userId: v.string(),
    todoId: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await authComponent.getAnyUserById(ctx, args.userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Get todo and verify ownership
    const todo = await ctx.db.get(args.todoId)
    if (!todo) {
      throw new Error('Todo not found')
    }
    
    if (todo.userId !== args.userId) {
      throw new Error('Permission denied')
    }
    
    // Toggle
    await ctx.db.patch(args.todoId, {
      completed: !todo.completed,
    })
  }
})

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx)
    if (!authUser) {
      return []
    }
    
    return await ctx.db
      .query("todos")
      .withIndex("by_userId", q => q.eq("userId", authUser.id))
      .order("desc")
      .collect()
  }
})
```

#### Client Component (`pages/todos.vue`)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useConvexQuery, useConvexClient } from 'convue'
import { api } from '../convex/_generated/api'

const { isAuthenticated, user } = useAuth()
const client = useConvexClient()

const { data: todos } = useConvexQuery(api.todos.listMine, {})

const newTodoTitle = ref('')

async function createTodo() {
  if (!user.value?.id || !newTodoTitle.value) return
  
  await client.mutation(api.todos.create, {
    userId: user.value.id,
    title: newTodoTitle.value,
  })
  
  newTodoTitle.value = ''
}

async function toggleTodo(todoId: string) {
  if (!user.value?.id) return
  
  await client.mutation(api.todos.toggle, {
    userId: user.value.id,
    todoId,
  })
}
</script>

<template>
  <div v-if="isAuthenticated">
    <form @submit.prevent="createTodo">
      <input v-model="newTodoTitle" placeholder="New todo" />
      <button type="submit">Add</button>
    </form>
    
    <ul>
      <li v-for="todo in todos" :key="todo._id">
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="toggleTodo(todo._id)"
        />
        {{ todo.title }}
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Please sign in to view your todos</p>
  </div>
</template>
```

---

## Summary: The Golden Rules

1. ✅ **Always pass `userId` from client to mutations**
2. ✅ **Verify user exists with `authComponent.getAnyUserById()`**
3. ✅ **Use `safeGetAuthUser()` for queries that return user-specific data**
4. ✅ **Never try to use `ctx.auth.getUserIdentity()` with Better Auth**
5. ✅ **Never try to read HttpOnly cookies from JavaScript**
6. ✅ **Always verify ownership before modifying resources**
7. ✅ **Use `useAuth()` composable on client side for user info**

---

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Convex Adapter](https://www.better-auth.com/docs/integrations/convex)

---

## Troubleshooting

### "Not authenticated" errors in mutations

**Cause:** Trying to use `ctx.auth.getUserIdentity()` or `authComponent.getAuthUser()`

**Fix:** Pass `userId` from client and verify with `getAnyUserById()`

### "Cannot find name 'user'" on client side

**Cause:** Not destructuring `user` from `useAuth()`

**Fix:**
```typescript
const { isAuthenticated, user } = useAuth()
```

### Empty user data even when authenticated

**Cause:** Session cookie not being sent with requests

**Fix:** Ensure your auth proxy is configured correctly in `server/api/auth/[...slug].ts` and forwards cookies properly

### Query returns empty array when it should return data

**Cause:** Using wrong index or filter

**Fix:** Ensure your database has the correct index defined and you're filtering by the right field:
```typescript
// Schema
.index("by_userId", ["userId"])

// Query
.withIndex("by_userId", q => q.eq("userId", authUser.id))
```

---

*Last updated: November 25, 2025*
