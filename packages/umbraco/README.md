# Umbraco

> UI components and design system for UmbraJS theming (Vue 3)

Umbraco is a Vue 3 component library and design system built on top of UmbraJS semantic theming. It pairs accessible, composable primitives (via Reka UI) with a cohesive token system.

Name origin: “Umbraco” means Allen/hex wrench in Norwegian — a fitting tool reference — and blends “Umbra” + “components.”

## ✨ Features

- Theme-native: Components read Umbra CSS variables (base/accent ranges, text tokens)
- Design system tokens: Spacing, radius, borders, typography, timing in `styles/`
- Solid primitives: Built on Reka UI (dialogs, etc.) and Vaul (drawers)
- Ready-to-use components: Buttons, Inputs, Tabs, Select, Drawer, Dialog, Slider, Radio, Chip, ScrollArea, Toggle, Toaster, transitions, and more
- Accessible by default: Works hand-in-hand with Umbra’s APCA-first contrast
- Vue 3 + TypeScript: Typed props and variants, sensible defaults

## 🚀 Installation

```bash
pnpm add umbraco
# or npm i umbraco / yarn add umbraco
```

## 🧩 Quick start

1. Import the design tokens and base styles once (recommended in your app entry):

```ts
// main.ts
import "umbraco/styles/main.scss";
```

Note: Importing any Umbraco component will also include the library’s base styles via the build. Bringing in `styles/main.scss` yourself is optional and most useful when you want tokens/utilities available even before components load, or when consuming only tokens.

2. Use components:

```vue
<script setup lang="ts">
import { Button } from "umbraco";
</script>

<template>
  <Button variant="primary">Click me</Button>
  <Button variant="secondary" color="success" size="small">OK</Button>
</template>
```

3. Optional: add toasts and provider components:

```vue
<script setup lang="ts">
import { Toaster, toast } from "umbraco";

function notify() {
  toast("Saved!");
}
</script>

<template>
  <Toaster />
  <button @click="notify">Show toast</button>
  <!-- Your app -->
  <router-view />
</template>
```

## 🎨 Theming with Umbra

Umbraco reads the CSS variables produced by UmbraJS. If you already use Umbra, components will immediately match your theme.

```ts
import { umbra } from "@umbrajs/core";

umbra({
  background: "#16121f",
  foreground: "#f3f6ea",
  accents: ["#9999ff"],
}).apply();
```

Scoped color swaps are available with helper classes defined in `styles/main.scss`:

- `base-accent` – make base tokens mirror the current accent
- `base-warning`, `base-success`, `base-info`, `base-yellow` – map base tokens to semantic ranges
- `accent-warning` – use the warning range as the accent

```html
<div class="base-success">
  <button>Success base</button>
</div>
```

Tip: If you don’t use Umbra yet, sensible default variables ship in `styles/main.scss` so components still look good.

## 🧱 Components

All components are Vue SFCs exported from the package root (`import { Button, DialogRoot, ... } from 'umbraco'`). Styles are included via your explicit `main.scss` import (recommended) and some base resets are also referenced by the package.

Highlights include:

- Buttons: `Button`, `ButtonGroup`, `ButtonToggle`, plus variants in `components/ui/Button/variants`
  - Props: `variant` = `base | primary | secondary`, `size` = `medium | small | mini`, `color` = `default | success | warning`, `disabled`, `type`

  Example:

  ```vue
  <Button variant="primary" size="medium">Primary</Button>
  <Button variant="secondary" color="warning" size="small">Warn</Button>
  ```

- Dialogs (Reka UI): re-exports `DialogRoot`, `DialogTrigger`, `Dialog`, `DialogTitle`, `DialogDescription`, `DialogClose`

  ```vue
  <script setup lang="ts">
  import {
    DialogRoot,
    DialogTrigger,
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "umbraco";
  </script>
  <template>
    <DialogRoot>
      <DialogTrigger as-child>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <Dialog>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Details</DialogDescription>
        <DialogClose as-child><Button>Close</Button></DialogClose>
      </Dialog>
    </DialogRoot>
  </template>
  ```

- Drawer (Vaul): re-exports `DrawerRoot`, `DrawerTrigger`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerDescription`, `DrawerTitle`, plus wrappers `Drawer`, `DrawerButton`, `DrawerHandle`

- Form/UI: `Input`, `Radio`, `Select`, `Slider`, `Tabs`, `ScrollArea`, `Toggle`, `Chip`

- Feedback: `Toaster`, `ToastButton`, `toast()` from `vue-sonner`

- Misc: `PixelTransition`, `Graph`

See `index.ts` for the full export surface.

## 🧪 Design system tokens

Tokens live in `styles/`:

- `_base.scss` – base resets, anchors, selection, images, forms
- `_typography.scss` – Inter typography scale, display sizes, paragraph, headings
- `_utils.scss` – utility classes (rounded, border, buttonGroup helpers)
- `main.scss` – variables for radius, borders, spacing scale, timings, defaults for `--base`/`--accent` ranges and semantic ranges (`--warning`, `--success`, `--info`, `--yellow`), plus helper classes (`.base-accent`, `.base-success`, etc.)

Import once (recommended):

```ts
import "umbraco/styles/main.scss";
```

Then reference tokens in your own CSS as needed (e.g., `var(--space-3)`, `var(--radius)`, `var(--base-40)`).

## 📦 Project structure

```
packages/umbraco
├─ components/
│  ├─ ui/
│  │  ├─ Button/ (variants, presets, group)
│  │  ├─ Dialog/ (Reka UI integration)
│  │  ├─ Drawer/ (Vaul integration)
│  │  ├─ Input.vue, Select.vue, Slider/, Tabs/, Radio/, Toggle.vue, ScrollArea.vue
│  │  └─ Toaster.vue, ToastButton.vue, PixelTransition.vue
│  ├─ graph/Graph.vue
├─ styles/ (_base.scss, _typography.scss, _utils.scss, main.scss)
├─ types/ (e.g. button.ts)
├─ index.ts (exports, base style import)
└─ vite.config.ts
```

## 🛠️ Development

This package is built with Vite and TypeScript.

- Dev: `pnpm run dev`
- Build: `pnpm run build`

In the monorepo root you can also run workspace builds with `pnpm -w -r build`.

## 📚 Related

- UmbraJS Core (theming): https://github.com/UmbraJS/core
- Live examples: https://umbrax.netlify.app/

## 📄 License

MIT © Samuel M. Bednarz

---

Documentation • Examples • GitHub
