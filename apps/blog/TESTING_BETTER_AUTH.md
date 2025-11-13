# Testing Better Auth Integration

This guide will help you test the Better Auth integration in the blog app.

## Prerequisites

1. You need a Convex project with Better Auth configured on the backend
2. Environment variables set up correctly

## Backend Setup (Convex)

### 1. Install Better Auth Component

In your Convex directory, install the Better Auth component:

```bash
cd convex
npx @convex-dev/auth
```

Follow the prompts to set up Better Auth with email/password authentication.

### 2. Configure Better Auth

The component will create the necessary files in your `convex/` directory. Make sure you have:

- `convex/auth.ts` - Better Auth configuration
- `convex/http.ts` - HTTP routes for authentication

### 3. Environment Variables

Create a `.env.local` file in the blog app root with:

```bash
# Convex URLs
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site

# Public Convex URL (for Nuxt)
CONVEX_URL=https://your-deployment.convex.cloud
```

Get these URLs from your Convex dashboard.

### 4. Deploy to Convex

```bash
npx convex dev
```

This will deploy your backend with Better Auth enabled.

## Testing the Integration

### 1. Start the Development Server

```bash
pnpm dev
```

### 2. Test Signup Flow

1. Navigate to http://localhost:3000/signup
2. Click "Sign up" tab
3. Enter:
   - Email address
   - Password
   - Name
4. Click "Sign Up"
5. You should see a success message

### 3. Test Sign In Flow

1. Navigate to http://localhost:3000/signin
2. Click "Sign in" tab (should be default)
3. Enter your credentials
4. Click "Sign In"
5. You should be redirected to `/profile`

### 4. Test Profile Page

After signing in, you should see:
- Your user information (name, email, user ID)
- Email verification status
- Session information (ID, expiration)
- Full session data (for debugging)
- Sign out button
- Navigation buttons

### 5. Test Sign Out

1. Click "Sign Out" button on profile page
2. You should see a success message
3. You should be redirected to `/signin`

### 6. Test Protected Route

1. Try to access `/profile` when not signed in
2. You should be automatically redirected to `/signin`

## Verifying Convex Integration

To verify that Convex queries work with authentication:

### 1. Create a Protected Query

In `convex/queries.ts`:

```ts
import { query } from "./_generated/server";
import { Auth } from "./auth";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await Auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const user = await Auth.getUser(ctx, userId);
    return user;
  },
});
```

### 2. Use the Query in Your App

In any Vue component:

```vue
<script setup lang="ts">
import { useConvexQuery, useAuth } from 'convue'
import { api } from '../convex/_generated/api'

const { isAuthenticated } = useAuth()

const { data: user, isPending } = useConvexQuery(
  api.queries.getCurrentUser,
  {}
)
</script>

<template>
  <div v-if="isAuthenticated && !isPending">
    <p>Authenticated user: {{ user?.email }}</p>
  </div>
</template>
```

### 3. Verify Token Management

- When you sign in, the Convex client should automatically receive auth tokens
- Your protected queries should work without any additional configuration
- When you sign out, the Convex client should clear the auth tokens

## Troubleshooting

### "Cannot find module '@convex-dev/better-auth/client/plugins'"

Make sure you've installed the packages:

```bash
pnpm add better-auth @convex-dev/better-auth
```

### "useBetterAuthClient() is called without a provider"

Check that:
1. `auth-client.ts` is properly configured
2. The `convue` plugin in `plugins/convue.ts` includes the `authClient`

### Queries fail with authentication errors

1. Verify you're signed in (check `/profile` page)
2. Check browser console for errors
3. Verify the Convex backend is configured correctly
4. Check that Better Auth is deployed on Convex

### Session not updating

1. Clear browser cache and cookies
2. Check that environment variables are set correctly
3. Verify the `VITE_CONVEX_SITE_URL` matches your Convex deployment

### GitHub OAuth not working

If you want to test GitHub OAuth:

1. Set up a GitHub OAuth app in GitHub settings
2. Configure it in your Convex Better Auth setup
3. Make sure your callback URL is configured correctly

## What's Happening Behind the Scenes

1. **Auth Client Setup** (`auth-client.ts`):
   - Creates Better Auth client with Convex plugin
   - Configures base URL to point to Convex site

2. **Plugin Integration** (`plugins/convue.ts`):
   - Passes auth client to convue plugin
   - Makes it available via provide/inject

3. **Automatic Token Management** (convue `useAuth`):
   - Watches for session changes
   - Calls `convexClient.setAuth()` when authenticated
   - Calls `convexClient.clearAuth()` when signed out
   - Tokens are automatically included in all Convex queries

4. **Components**:
   - `SignIn.vue` / `SignUp.vue`: Handle authentication UI
   - `profile.vue`: Protected route showing user data
   - All use convue composables for reactive auth state

## Next Steps

Once basic auth is working, you can:

1. Add social providers (GitHub, Google, etc.)
2. Implement email verification
3. Add password reset functionality
4. Create more protected Convex queries/mutations
5. Add role-based access control
6. Implement user profile editing

## Resources

- [Better Auth Docs](https://www.better-auth.com)
- [Convex + Better Auth](https://convex-better-auth.netlify.app)
- [Convue Package](../../packages/convue)
