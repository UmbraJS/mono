# UmbraJS Core

> **Modern, future-proof theme management for the web**

UmbraJS is a flexible, type-safe color theming engine that builds semantic color systems based on relationships, not hard-coded values. It uses a 12-shade scale (aligned with Radix Colors) and the APCA contrast algorithm (future WCAG 3.0 standard) to generate accessible, scalable themes for light, dark, and custom modes - automatically.

[![NPM Version](https://img.shields.io/npm/v/@umbrajs/core.svg)](https://www.npmjs.com/package/@umbrajs/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎯 One call, full theme** - Generates complete theme systems from minimal input
- **🎨 Semantic & scalable** - Colors adapt intelligently across light/dark modes  
- **♿ Accessible** - APCA contrast compliance (future WCAG 3.0 standard) built-in
- **🔒 Type-safe** - Complete TypeScript support and autocompletion
- **🌊 Tailwind-ready** - CSS variables work directly with Tailwind CSS v4
- **⚡ Performant** - Zero-runtime CSS variable injection and optimized generation

### What makes UmbraJS unique?

Most theming libraries just manage palettes. UmbraJS builds color relationships, ensuring harmony, readability, and flexibility as your design system evolves.

**[👉 Try it live →](https://umbrax.netlify.app/)**

## 🚀 Quick Start

### Install
```bash
npm install @umbrajs/core
```

### Minimal Example
```typescript
import { umbra } from '@umbrajs/core'

const theme = umbra({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074']
})

theme.apply()
```

### Resulting CSS variables:
```css
:root {
  --base-background: #0c0915;
  --base-10: #201c26;
  --base-20: #484349;
  --base-30: #524f56;
  /* ... 12 shades ... */
  --base-foreground: #c0aea3;

  --accent-background: #c97074;
  --accent-foreground: #0c0915;
  --accent-10: #ba9a9d;
  --accent-20: #79646a;
  /* ... accent shades ... */
}
```

> **💡 Tailwind v4:** These variables map directly to Tailwind colors. [Setup guide →](#tailwind-css-integration)

## 🎨 The 12-Shade Color System

UmbraJS uses the same 12-step scale as Radix Colors to build consistent, usable color ranges. Each shade is mapped to a real-world UI purpose (e.g., background, hover states, borders, text).

### Why 12 steps?

Because Radix tested them across thousands of UI combinations. Each shade has a defined job:

| Step | Use Case | Variable |
|------|----------|----------|
| 1 | App background | `--base-10` |
| 4 | Hovered element background | `--base-40` |
| 9 | Solid backgrounds | `--base-90` |
| 12 | High-contrast text | `--base-120` |

Shades 1-12 bridge the background (`--base-background`) and foreground (`--base-foreground`).

### Radix Colors Integration

You can also plug in full Radix scales directly:

```typescript
import { slate } from '@radix-ui/colors'

const theme = umbra({
  background: '#fff',
  foreground: '#000',
  settings: { shades: slate }
})
```

### Benefits of the Unified System

- **🎯 Consistency**: All shades align with proven design standards
- **♿ Accessibility**: Shades are built with contrast in mind
- **🔄 Flexibility**: Swap generated colors with Radix colors seamlessly

## 🔬 APCA: Accessible Perceptual Contrast

UmbraJS doesn't rely on outdated WCAG 2.x contrast ratios. Instead, it uses APCA - the algorithm that will power WCAG 3.0.

### Why APCA is better

**Problems with WCAG 2.x:**
- **Dark mode failures**: ratios that "pass" are often unreadable
- **Binary pass/fail**: ignores real-world context  
- **Linear math**: doesn't match human visual perception

**APCA advantages:**
- **Perceptually uniform**: 60 Lc feels the same contrast in light and dark modes
- **Context-aware**: font size, weight, and spacing are factored in
- **Dark mode optimized**: contrast calculations stay accurate

### Example:
```typescript
const theme = umbra({
  background: '#1a1a1a',
  foreground: '#ffffff',
  settings: { readability: 75 } // APCA Lc value
})
```

### APCA Readability Scale

| Lc Value | Use Case |
|----------|----------|
| **90+** | Body text (max readability) |
| **75** | Primary UI text |
| **60** | Headlines and larger elements |
| **30** | Subtle UI, disabled states |

**👉 UmbraJS themes are future-ready for WCAG 3.0 while delivering better accessibility today.**

## 🌈 Understanding Color Ranges

UmbraJS doesn't just generate colors - it builds semantic ranges.

### Base Range

Every theme starts with a base range from background → foreground:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000'
})
```

**Result:**
- `--base-background`
- `--base-10` ... `--base-120`
- `--base-foreground`

### Accent Ranges

Each accent color creates a complete range relative to the base:

```typescript
umbra({
  background: '#fff',
  foreground: '#000',
  accents: [
    '#3b82f6', // --accent-*
    { name: 'success', color: '#10b981' }, // --success-*
    { name: 'warning', color: '#f59e0b' } // --warning-*
  ]
})
```

**Benefits:**
- **🎯 Consistency**: All colors stay visually aligned
- **♿ Accessibility**: Ranges maintain proper contrast
- **🔄 Flexibility**: Change a base color and all accents adapt

## 🌟 Advanced Usage

### Dark/Light Mode
```typescript
const lightTheme = umbra({ background: '#fff', foreground: '#000' })
const darkTheme = lightTheme.inverse()

lightTheme.apply()
darkTheme.apply({ target: '.dark' })
```

### Scoped Themes
```typescript
umbra({ background: '#fff', foreground: '#000' }).apply()
umbra({ background: '#f9fafb', foreground: '#111827' }).apply({ target: '.sidebar' })
```

### Tailwind CSS Integration

UmbraJS variables map directly into Tailwind v4:

```javascript
// tailwind.config.js
export default {
  theme: {
    colors: {
      base: {
        DEFAULT: 'var(--base-background)',
        foreground: 'var(--base-foreground)',
        10: 'var(--base-10)',
        20: 'var(--base-20)'
      },
      accent: {
        DEFAULT: 'var(--accent-background)',
        foreground: 'var(--accent-foreground)',
        10: 'var(--accent-10)',
        20: 'var(--accent-20)'
      }
    }
  }
}
```

**Usage:**
```html
<div class="bg-base-10 text-base-foreground">
  <button class="bg-accent text-accent-foreground hover:bg-accent-10">
    Click me
  </button>
</div>
```

## 📖 API Reference

### `umbra(input?: UmbraInput): Umbra`

Creates a full theme system.

**Example:**
```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#007acc'],
  settings: {
    readability: 70,
    shades: [5, 10, 15, 20, 25, 30],
    formater: 'hex'
  }
})
```

### Theme Methods

- **`theme.apply(options?)`** - Applies theme to the DOM
- **`theme.inverse()`** - Creates inverted (dark/light) theme  
- **`theme.format(formatter?)`** - Returns color data without applying
- **`theme.isDark()`** - Returns true if theme background is dark

### Utility Functions

UmbraJS exports helpers like:

- `getReadability(bg, fg)`
- `mostReadable(color, [candidates])`
- `colorMix(colorA, colorB, amount)`
- `isDark(color)`

## 🔧 TypeScript Support

UmbraJS is fully type-safe:

```typescript
import type { UmbraInput } from '@umbrajs/core'

const config: UmbraInput = {
  background: '#fff',
  foreground: '#000',
  accents: ['#007acc']
}

const theme = umbra(config)
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/UmbraJS/core/blob/main/CONTRIBUTING.md).

## 📄 License

MIT © [Samuel M. Bednarz](https://github.com/CarelessCourage)

---

**[Documentation](https://umbrajs.org)** • **[Examples](https://umbrax.netlify.app/)** • **[GitHub](https://github.com/UmbraJS/core)**

---

### Optional Fun: Easter Egg 🥚

UmbraJS adds a hidden generation counter in your CSS each time a theme is applied. Look in DevTools:

```css
theme-2-15, :root {
  --base-background: #ffffff;
}
```

- **First number**: times this selector was updated
- **Second number**: total themes applied

Harmless, purely for curious developers 🎉
