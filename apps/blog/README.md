# Blog (Nuxt 3 on Vercel)

## Features

- Server-Side rendering on Cloudflare Workers
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
