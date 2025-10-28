# UI App Development Setup

This UI app is configured for seamless development with the `umbraco` package without requiring rebuilds.

## How it works

The Vite configuration includes these key aliases:

```typescript
alias: [
  {
    find: /^umbraco\/(.*)$/,
    replacement: '../../packages/umbraco/$1'  // Maps any umbraco/* to source
  },
  {
    find: 'umbraco',
    replacement: '../../packages/umbraco/index.ts'  // Points directly to source
  }
]
```

## Development Benefits

- ✅ **Hot Reloading**: Changes to umbraco components automatically update in the UI app
- ✅ **No Rebuilds**: Edit umbraco source files and see changes immediately
- ✅ **TypeScript Support**: Full type checking and IntelliSense for umbraco imports
- ✅ **CSS/Styles**: Direct access to umbraco styles without build step

## Usage

1. Start the UI app: `pnpm run dev`
2. Edit any file in `packages/umbraco/`
3. Changes appear instantly in the running UI app

## Import Examples

```typescript
// Component imports (resolved to source)
import { Button, Dialog } from 'umbraco'

// Style imports (resolved to source)
import 'umbraco/styles/_index.css'

// Built assets (when needed)
import 'umbraco/dist/umbraco.css'
```

This setup eliminates the development friction of constantly rebuilding the umbraco package during active development.
