# Better Auth Integration for Convue - Implementation Summary

## Overview

This implementation adds Better Auth authentication support to your `convue` package, providing Vue 3 composables for seamless integration between Convex and Better Auth.

## What Was Implemented

### 1. Core Composables

#### `useBetterAuthClient.ts`
- Provides access to the Better Auth client instance via Vue's provide/inject system
- Defines TypeScript interfaces for Better Auth client and session types
- Includes helper functions for providing the auth client to the app

#### `useAuth.ts`
- Main authentication composable that provides:
  - `isLoading`: Reactive loading state
  - `isAuthenticated`: Reactive authentication state
  - `fetchAccessToken`: Function to get Convex auth tokens
- Automatically manages Convex client authentication by:
  - Setting auth when user logs in (via `setAuth`)
  - Clearing auth when user logs out (via `clearAuth`)
- Watches for session changes and updates Convex client accordingly

#### `useSession.ts`
- Simple wrapper around Better Auth's `useSession` hook
- Provides reactive access to session data, loading state, and errors
- Returns user information and session metadata

### 2. Plugin Integration

#### `plugin.ts` Updates
- Added `authClient` option to `ConvexVueOptions`
- Automatically provides Better Auth client to the app when configured
- Maintains backward compatibility - Better Auth is optional

### 3. Package Configuration

#### `package.json` Updates
- Added `better-auth` as an optional peer dependency (>=1.0.0)
- Configured with `peerDependenciesMeta` to mark it as optional
- Users can use convue without Better Auth if they don't need authentication

### 4. Exports

#### `index.ts` Updates
- Exported all three new composables:
  - `useAuth`
  - `useBetterAuthClient`
  - `useSession`

### 5. Documentation

#### `README.md` Updates
- Added comprehensive Better Auth integration section
- Includes setup instructions
- Provides example code for all composables
- Shows how to create protected routes
- Links to official documentation

## How It Works

### Authentication Flow

1. **Setup**: User provides Better Auth client when installing the plugin
2. **Initialization**: Plugin provides the client via Vue's provide/inject
3. **Auth State**: `useAuth()` watches for session changes
4. **Token Management**: When authenticated, `useAuth()` automatically:
   - Fetches tokens from Better Auth
   - Provides them to the Convex client via `setAuth()`
5. **Realtime Updates**: Session changes trigger automatic Convex client updates

### Key Design Decisions

1. **Optional Dependency**: Better Auth is optional - existing users aren't affected
2. **Automatic Token Management**: No manual token handling required
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Vue 3 Patterns**: Uses composables, provide/inject, and watch for reactivity
5. **Framework Agnostic Better Auth Client**: Works with any Better Auth client (vue, react, svelte)

## Usage Example

```ts
// main.ts
import { createApp } from 'vue'
import { convexVue } from 'convue'
import { createAuthClient } from 'better-auth/vue'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient()],
})

const app = createApp(App)

app.use(convexVue, {
  url: import.meta.env.VITE_CONVEX_URL,
  authClient, // Pass Better Auth client
})

app.mount('#app')
```

```vue
<!-- Component.vue -->
<script setup lang="ts">
import { useAuth, useSession, useConvexQuery } from 'convue'
import { api } from '../convex/_generated/api'

const { isAuthenticated, isLoading } = useAuth()
const { data: session } = useSession()
const { data: userData } = useConvexQuery(api.users.getCurrentUser, {})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isAuthenticated">
    <p>Welcome, {{ session?.user.name }}!</p>
    <p>Your data: {{ userData }}</p>
  </div>
  <div v-else>Please sign in</div>
</template>
```

## Server-Side Setup Required

Users will need to configure Better Auth on their Convex backend:

1. Install `@convex-dev/better-auth` component
2. Create `convex/auth.ts` with Better Auth configuration
3. Set up HTTP routes in `convex/http.ts`
4. Configure authentication providers

See the [official Convex + Better Auth docs](https://convex-better-auth.netlify.app) for complete setup.

## Benefits

1. **Seamless Integration**: Auth state automatically syncs with Convex client
2. **Developer Experience**: Simple, intuitive composables API
3. **Type Safety**: Full TypeScript support
4. **Reactive**: All auth state is reactive and updates in real-time
5. **Framework Consistency**: Follows Vue 3 patterns and conventions
6. **Backward Compatible**: Doesn't break existing convue installations

## Files Created/Modified

### Created
- `src/composables/useBetterAuthClient.ts`
- `src/composables/useAuth.ts`
- `src/composables/useSession.ts`

### Modified
- `src/plugin.ts` - Added authClient support
- `src/index.ts` - Exported new composables
- `package.json` - Added better-auth peer dependency
- `README.md` - Added documentation

## Testing Recommendations

To test this implementation:

1. Set up a Convex project with Better Auth backend
2. Create a Vue 3 app using your convue package
3. Test authentication flow:
   - Sign in/out
   - Check that Convex queries work when authenticated
   - Verify queries fail when unauthenticated (if configured)
4. Test reactivity:
   - Session changes should update UI immediately
   - Convex client should automatically use new tokens

## Next Steps

Consider adding:
1. Example app demonstrating the integration
2. Unit tests for the new composables
3. Support for cross-domain authentication (for client-side frameworks)
4. Helper composables for common auth operations (password reset, email verification)
