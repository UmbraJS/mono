# Umbra SSR Theme System

This directory contains the implementation for eliminating theme flash on SSR/SSG by pre-generating CSS and syncing user preferences via cookies.

## How It Works

### 1. Static Default CSS (`/public/umbra-default.css`)
- Generated at build time by `scripts/generate-umbra-css.ts`
- Contains the default theme from `packages/umbraco/composables/useUmbra.ts`
- Loaded in `app.vue` with high priority
- **Result:** No flash for users on default theme

### 2. SSR Plugin (`app/plugins/umbra-ssr.server.ts`)
- Runs on server during SSR
- Reads `umbra-theme` cookie if present
- Generates and injects inline critical CSS for custom themes
- **Result:** No flash for users with custom themes

### 3. Client Cookie Sync (`app/plugins/umbra-cookie-sync.client.ts`)
- Runs on client after hydration
- Watches localStorage for theme changes from `useUmbra`
- Syncs theme to cookie for next SSR request
- **Result:** Theme persists across page loads

### 4. Updated `useUmbra` Composable
- Saves theme changes to localStorage
- Triggers storage event for cookie sync
- Works in any Vue app (not just Nuxt)
- **Result:** Theme changes are automatically persisted

## File Structure

```
apps/blog/
├── app/
│   ├── app.vue                              # Loads static CSS
│   └── plugins/
│       ├── umbra-ssr.server.ts              # SSR theme injection
│       └── umbra-cookie-sync.client.ts      # Cookie sync
├── public/
│   └── umbra-default.css                    # Generated default theme
└── package.json                             # Build script

scripts/
└── generate-umbra-css.ts                    # CSS generation script

packages/umbraco/
└── composables/
    └── useUmbra.ts                          # Updated with localStorage
```

## Build Process

When you run `pnpm build` in `apps/blog`:

1. `nuxt prepare` - Generate types
2. `pnpm generate:umbra` - Generate static CSS file
3. `nuxt build` - Build app with CSS available

## User Experience

### First Visit (No Saved Theme)
1. Browser loads HTML
2. Static CSS loads immediately from `/umbra-default.css`
3. Page renders with default theme
4. ✅ No flash

### First Visit (Saved Theme)
1. Browser sends cookie with theme
2. SSR plugin generates theme CSS
3. HTML includes inline `<style>` with user theme
4. Page renders with user's theme
5. ✅ No flash

### Theme Change
1. User changes theme via `useUmbra().apply()`
2. Theme saved to localStorage
3. Storage event triggers cookie sync
4. Cookie updated
5. Next page load uses custom theme
6. ✅ No flash

## Testing

### Generate CSS
```bash
pnpm --filter ./apps/blog generate:umbra
```

### Check Generated File
```bash
cat apps/blog/public/umbra-default.css
```

### Test SSR (with custom theme)
1. Change theme in browser
2. Check cookies - should see `umbra-theme`
3. Refresh page - theme should persist without flash

## Technical Details

### Why Not Just CSS Variables?
CSS variables need to be set somewhere. Even if you hardcode them in CSS, you still need JS to update them dynamically. This solution pre-renders the *current* theme (default or custom) before any JS runs.

### Why Cookie + localStorage?
- **localStorage**: Fast client-side persistence, no size limit
- **Cookie**: Available during SSR, sent with every request
- Together: Best of both worlds

### Why Not Just Inline All Themes?
- Would bloat HTML for all users
- Only inject custom theme CSS if user has one
- Default users get static file (cached, no overhead)

## Limitations

- Cookie size ~4KB limit (theme should be <2KB)
- Requires JavaScript enabled for theme changes
- First-time visitors see default theme until they change it

## Future Improvements

- Add `prefers-color-scheme` detection
- Support multiple saved themes per user
- Add theme preview without saving
- Compress theme data for smaller cookies
