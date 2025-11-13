# Quick Start: Better Auth with Convue

This guide will help you quickly integrate Better Auth authentication into your Vue 3 + Convex app using convue.

## Prerequisites

- A Convex project with Better Auth backend configured
- Vue 3 application
- convue package installed

## Installation

```bash
npm install better-auth @convex-dev/better-auth
```

## Step 1: Create Better Auth Client

Create a file `src/lib/auth-client.ts`:

```ts
import { createAuthClient } from 'better-auth/vue'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient()],
})
```

## Step 2: Configure Convue Plugin

Update your `main.ts`:

```ts
import { createApp } from 'vue'
import { convexVue } from 'convue'
import { authClient } from './lib/auth-client'
import App from './App.vue'

const app = createApp(App)

app.use(convexVue, {
  url: import.meta.env.VITE_CONVEX_URL,
  authClient, // Add this line
})

app.mount('#app')
```

## Step 3: Use in Components

### Show Login/Logout State

```vue
<script setup lang="ts">
import { useAuth } from 'convue'

const { isAuthenticated, isLoading } = useAuth()
</script>

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="isAuthenticated">Logged in ✓</p>
    <p v-else>Logged out</p>
  </div>
</template>
```

### Display User Info

```vue
<script setup lang="ts">
import { useSession } from 'convue'

const { data: session } = useSession()
</script>

<template>
  <div v-if="session">
    <h2>Welcome, {{ session.user.name }}!</h2>
    <p>{{ session.user.email }}</p>
  </div>
</template>
```

### Login/Logout Actions

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useBetterAuthClient, useAuth } from 'convue'

const authClient = useBetterAuthClient()
const { isAuthenticated } = useAuth()

const email = ref('')
const password = ref('')

async function signIn() {
  await authClient.signIn.email({
    email: email.value,
    password: password.value,
  })
}

async function signOut() {
  await authClient.signOut()
}
</script>

<template>
  <div v-if="!isAuthenticated">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signIn">Sign In</button>
  </div>
  <div v-else>
    <button @click="signOut">Sign Out</button>
  </div>
</template>
```

### Protected Convex Query

```vue
<script setup lang="ts">
import { useAuth, useConvexQuery } from 'convue'
import { api } from '../convex/_generated/api'

const { isAuthenticated, isLoading: authLoading } = useAuth()

// This query requires authentication on the backend
const { data: privateData, isPending } = useConvexQuery(
  api.users.getPrivateData,
  {}
)
</script>

<template>
  <div>
    <div v-if="authLoading || isPending">Loading...</div>
    <div v-else-if="!isAuthenticated">
      <p>Please sign in to view this data</p>
    </div>
    <div v-else>
      <h2>Your Private Data</h2>
      <pre>{{ privateData }}</pre>
    </div>
  </div>
</template>
```

## Environment Variables

Make sure you have these in your `.env` file:

```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site
```

## Backend Setup

Your Convex backend needs Better Auth configured. See the [official Convex + Better Auth documentation](https://convex-better-auth.netlify.app) for:

1. Installing the Better Auth component
2. Setting up authentication providers
3. Creating protected queries/mutations
4. Configuring HTTP routes

## Common Patterns

### Route Guard

```vue
<script setup lang="ts">
import { useAuth } from 'convue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const { isAuthenticated, isLoading } = useAuth()
const router = useRouter()

watch([isAuthenticated, isLoading], ([auth, loading]) => {
  if (!loading && !auth) {
    router.push('/login')
  }
})
</script>
```

### Conditional Queries

```vue
<script setup lang="ts">
import { useAuth, useConvexQuery } from 'convue'
import { api } from '../convex/_generated/api'
import { computed } from 'vue'

const { isAuthenticated } = useAuth()

// Only run query when authenticated
const { data } = useConvexQuery(
  computed(() => isAuthenticated.value ? api.users.getCurrentUser : undefined),
  {}
)
</script>
```

## Troubleshooting

### "useBetterAuthClient() is called without a provider"
- Make sure you passed `authClient` to the `convexVue` plugin
- Verify the import path for your auth client

### Queries fail with "Unauthenticated"
- Check that your Convex backend requires authentication for the query
- Verify the user is signed in before calling the query
- Check that Better Auth is properly configured on the backend

### Session not updating
- Ensure you're using the reactive `data`, `isAuthenticated` from the composables
- Check browser console for errors
- Verify environment variables are set correctly

## Next Steps

- Read the [full README](./README.md#better-auth-integration) for detailed documentation
- Check out the [Better Auth docs](https://www.better-auth.com) for auth configuration
- See [Convex + Better Auth](https://convex-better-auth.netlify.app) for backend setup

## Support

For issues related to:
- **convue**: Open an issue on your GitHub repo
- **Better Auth**: See [Better Auth GitHub](https://github.com/better-auth/better-auth)
- **Convex + Better Auth**: See [get-convex/better-auth](https://github.com/get-convex/better-auth)
