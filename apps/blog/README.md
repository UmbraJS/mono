# Blog (Nuxt 3 on Vercel)

## Features

- Server-Side rendering on Vercel (Nitro preset `vercel`)
- ESLint setup
- Ready to add a database, blob and KV storage
- One click deploy on 275+ locations for free

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

You can update the main text displayed by creating a `.env`:

```bash
NUXT_PUBLIC_HELLO_TEXT="Hello my world!"
```

### Convex (Realtime Backend) Setup

This app is configured to use [Convex](https://convex.dev/) via the `convex-nuxt` module.

1. Install the Convex CLI if you haven't:
   ```bash
   npm install -g convex
   ```
2. In this `apps/blog` directory, run the Convex dev server (creates `convex/` config & prints a deployment URL):
   ```bash
   npx convex dev
   ```
3. Copy `.env.example` to `.env.local` and set `CONVEX_URL` to the value printed (or your deployed Convex prod URL):
   ```bash
   CONVEX_URL="https://<your-deployment>.convex.cloud"
   ```
4. (Optional) Commit the generated `convex/_generated` updates after defining new functions or schema changes.

If `CONVEX_URL` is missing you'll see generic "Server Error" messages from queries. The plugin `app/plugins/convexWarn.client.ts` will warn in the console when the variable isn't set.

Common issues:

- Forgetting to run `npx convex dev` so tables/functions aren't deployed yet.
- Using a stale `CONVEX_URL` after recreating the deployment.
- Attempting to query during SSR (the module handles this; ensure you're not manually importing server-only code on the server).

After setting the URL, restart `pnpm dev` so Vite picks up the new environment variable.

### Verbose Convex logging

Convex composables now keep the console quiet by default. If you need the old lifecycle logging to investigate a query, set `NUXT_PUBLIC_CONVUE_DEBUG=true` (or `CONVUE_DEBUG=true` for server-only contexts) in `.env.local` and restart the dev server.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

Deploy to Vercel:

```bash
pnpm build
```

Then connect the repo to Vercel and set the Framework Preset to Nuxt. Nitro preset is forced to `vercel` in `nuxt.config.ts`.
