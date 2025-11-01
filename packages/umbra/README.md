# Umbra

> **The color system that just works**

Umbra generates complete, accessible color themes from just three inputs: a background color, a foreground color, and your accent colors. That's it. No complicated configuration, no wrestling with contrast ratios, no manual shade generation.

```typescript
import { umbra } from '@umbrajs/core'

umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue']
}).apply()
```

**That's all you need.** Umbra generates 14 perfectly balanced shades for your base theme and 14 more for each accent color—all with guaranteed readability. The colors work together harmoniously, look great in both light and dark mode, and are instantly available as CSS variables.

**[Try it live →](https://umbrax.netlify.app/)**

---

## Why You'll Love It

**🎯 Dead Simple**  
One function call. Three inputs. Done. No PhD in color theory required.

**🎨 Smart Color Presets**  
Write `'tomato'` instead of `'#E54D2E'`. Each preset includes hand-tuned color scales that just look *right*.

**♿ Actually Accessible**  
Uses APCA (the future WCAG 3.0 standard) instead of broken WCAG 2.x ratios. Your dark mode will actually be readable.

**✅ Built-In Validation**  
Automatic contrast checking warns you when accent colors are too close to backgrounds. Catch accessibility issues before they ship.

**🌓 Dark Mode Built-In**  
Call `.inverse()` and get a perfectly inverted theme. All colors maintain their relationships and readability.

**🔄 Range Mapping**  
Write component styles once using base variables. Get infinite color variants by adding a class (`.base-primary`, `.base-success`, etc.).

**🎨 Scales With You**  
Start with three colors. Add semantic accents (`danger`, `success`, `warning`) as you grow. Umbra scales from MVP to design system.

**⚡ Framework Agnostic**  
Plain CSS variables. Works with React, Vue, Svelte, vanilla JS, or your framework of next week.

---

## Getting Started

### Installation

```bash
npm install @umbrajs/core
```

### Your First Theme

Let's create a simple light theme:

```typescript
import { umbra } from '@umbrajs/core'

umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue']
}).apply()
```

**What just happened?**

Umbra generated 28 CSS variables for you:

```css
:root {
  /* Base colors (14 shades from white to black) */
  --base: #ffffff;
  --base-10: #f4f4f4;
  --base-20: #e8e8e8;
  /* ... 8 more shades ... */
  --base-110: #333333;
  --base-120: #1a1a1a;
  --base-text: #000000;
  
  /* Accent colors (14 shades of blue) */
  --accent: #0090ff;
  --accent-10: #e6f4ff;
  --accent-20: #cce9ff;
  /* ... 8 more shades ... */
  --accent-110: #005299;
  --accent-120: #003d73;
  --accent-text: #000000;
}
```

Now use them anywhere:

```css
.card {
  background: var(--base-10);
  color: var(--base-text);
  border: 1px solid var(--accent-20);
}

button {
  background: var(--accent);
  color: var(--accent-text);
}

button:hover {
  background: var(--accent-90);
}
```

**That's the basics.** You now have a complete, accessible color system ready to use.

---

## Level Up: Color Presets

Instead of looking up hex codes, just use color names:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['tomato', 'blue', 'green']
}).apply()
```

Each preset includes optimized color scales hand-tuned to look great. Available presets:

```
tomato  red  orange  amber  yellow  gold  lime  green  emerald
cyan  teal  blue  sky  indigo  purple  violet  pink  rose
```

**Why presets?**

Without presets, you'd need to manually define 12 tint values and 12 shade values for each accent color. That's 24 numbers to tune. With presets? Just write the color name.

```typescript
// Before: ~30 lines of configuration per color
umbra({
  accents: [{
    color: '#E54D2E',
    tints: [
      { mix: 1, hue: "next", saturation: "+=99" },
      { mix: 2, hue: "next", saturation: "+=99" },
      5, 8, 12, 17, 24, 35, 'primer',
      { mix: "+=5", hue: 0, saturation: "-=4" },
      { mix: "+=7", hue: 0, saturation: "-=8" },
      { mix: "+=9", hue: 0, saturation: "-=12" }
    ],
    shades: [/* another 12 values */]
  }]
})

// After: 1 word
umbra({
  accents: ['tomato']
})
```

---

## Power Move: Dark Mode

Get a perfect dark theme with one method:

```typescript
const light = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue']
})

const dark = light.inverse()

// Apply light theme to the page
light.apply()

// Apply dark theme to .dark elements
dark.apply({ target: '.dark' })
```

Now you have both themes. Add a class toggle and you're done:

```javascript
// Toggle dark mode
document.body.classList.toggle('dark')
```

**How inversion works:**

Umbra doesn't just flip colors randomly. It:
1. Swaps background and foreground
2. Adjusts all shades to maintain contrast relationships
3. Preserves your accent colors
4. Ensures everything stays readable

The result? A dark theme that actually looks designed, not broken.

---

## Next Level: Semantic Accents

Stop using generic "accent" variables. Give your colors meaning:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    { name: 'primary', color: 'blue' },
    { name: 'danger', color: 'tomato' },
    { name: 'success', color: 'green' },
    { name: 'warning', color: 'yellow' }
  ]
}).apply()
```

Now you have semantic CSS variables:

```css
.button-primary { background: var(--primary); }
.button-danger { background: var(--danger); }
.alert-success { border-color: var(--success-40); }
.badge-warning { background: var(--warning-20); }
```

Your code becomes self-documenting. New developers know what colors mean just by reading the variable names.

---

## Pro Level: Scoped Themes

Different parts of your app can have different themes:

```typescript
### Scoped Themes

Apply different themes to different parts of your application:

```typescript
// Global theme
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue']
}).apply()

// Sidebar theme
umbra({
  background: '#f5f5f5',
  foreground: '#222222',
  accents: ['purple']
}).apply({ target: '.sidebar' })

// Admin panel theme
umbra({
  background: '#1a1a1a',
  foreground: '#ffffff',
  accents: ['orange']
}).apply({ target: '.admin' })
```

Each scope gets its own complete color system. No conflicts, no complexity.

---

## Range Mapping Classes

**New in v1.0:** Umbra automatically generates CSS classes that let you remap the base range to any accent range. This is incredibly powerful for component-based design.

### The Problem

Imagine you build all your UI components using only the base range:

```css
.button {
  background: var(--base-40);
  color: var(--base-text);
  border: 1px solid var(--base-60);
}

.button:hover {
  background: var(--base-50);
}
```

Now you need a warning button, a success button, a primary button... do you rewrite all the CSS for each variant? **No!**

### The Solution

Umbra generates range mapping classes automatically:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    { name: 'primary', color: 'blue' },
    { name: 'warning', color: 'yellow' },
    { name: 'success', color: 'green' },
    { name: 'danger', color: 'tomato' }
  ]
}).apply()
```

This generates classes like:

```css
.base-primary {
  --base: var(--primary);
  --base-10: var(--primary-10);
  --base-20: var(--primary-20);
  /* ... all shades ... */
  --base-text: var(--primary-text);
}

.base-warning {
  --base: var(--warning);
  --base-10: var(--warning-10);
  /* ... all shades ... */
}

.base-success { /* ... */ }
.base-danger { /* ... */ }
```

### Usage

Now your single button component works for all variants:

```html
<!-- Generic button (uses base range) -->
<button class="button">
  Default
</button>

<!-- Primary button (remaps base to primary) -->
<button class="button base-primary">
  Primary
</button>

<!-- Warning button (remaps base to warning) -->
<button class="button base-warning">
  Warning
</button>

<!-- Success button (remaps base to success) -->
<button class="button base-success">
  Success
</button>
```

**Your CSS stays the same. Just add a class.**

### Why This Is Powerful

**🎯 Component Reusability**  
Write your component styles once using base variables. Get infinite variants for free.

**🎨 Consistent Design**  
All variants use the same shade structure. Your warning button and success button will have the same visual weight.

**⚡ Tiny Bundle Size**  
No duplicate CSS. One set of styles works for all variants through CSS variable remapping.

**🔧 Easy Maintenance**  
Change your base button? All variants update automatically.

### Real-World Example

```css
/* Write once */
.card {
  background: var(--base-10);
  border: 1px solid var(--base-30);
  color: var(--base-text);
}

.card-header {
  background: var(--base-20);
  border-bottom: 1px solid var(--base-40);
}

.card-badge {
  background: var(--base);
  color: var(--base-text);
  padding: 0.25rem 0.5rem;
}
```

```html
<!-- Use everywhere with different colors -->
<div class="card">Default Card</div>
<div class="card base-primary">Primary Card</div>
<div class="card base-success">Success Card</div>
<div class="card base-warning">Warning Card</div>
```

### Disable Range Mapping

If you don't want these classes generated:

```typescript
umbra({
  accents: ['blue']
}).apply({ rangeMapping: false })
```
```

Each scope gets its own complete color system. No conflicts, no complexity. 

---

## Understanding Color Ranges

Here's where Umbra gets interesting. Most theme systems give you individual colors. Umbra gives you **color ranges**.

### What's a Color Range?

Think of it like a gradient from your background to your foreground:

```
Background (#ffffff)
    ↓
  --base-10  (very light gray)
  --base-20  (light gray)
  --base-30  (medium-light gray)
    ...
  --base-110 (dark gray)
  --base-120 (very dark gray)
    ↓
Foreground (#000000)
```

Umbra generates 12 evenly-distributed steps between your two endpoints. This gives you a complete grayscale to work with.

### Why This Matters

Every color in the range has the right contrast with every other color. No guessing. No manual testing. No accessibility nightmares.

```css
/* All of these combinations just work */
background: var(--base-10);   color: var(--base-text);    /* ✅ Readable */
background: var(--base-40);   color: var(--base-text);    /* ✅ Readable */
background: var(--base-80);   color: var(--base);         /* ✅ Readable */
background: var(--base-120);  color: var(--base);         /* ✅ Readable */
```

### Accent Ranges

Here's the clever part: **accents aren't just colors, they're entire ranges too**.

When you add an accent color, Umbra creates a full range for it:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{ name: 'primary', color: 'blue' }]
})
```

You get:

```
Background (#ffffff)
    ↓
  --primary-10  (barely blue)
  --primary-20  (light blue)
  --primary-30  (medium-light blue)
    ...
  --primary (your blue)
    ...
  --primary-110 (dark blue)
  --primary-120 (very dark blue)
    ↓
Foreground (#000000)
```

**This is powerful.** You can now use different shades of your brand color throughout your UI, all with guaranteed contrast.

```css
.button {
  background: var(--primary);
  color: var(--primary-text);
}

.button:hover {
  background: var(--primary-90);
}

.button:active {
  background: var(--primary-110);
}

.badge {
  background: var(--primary-20);
  color: var(--primary);
  border: 1px solid var(--primary-40);
}
```

### Multiple Accent Ranges

Add as many accent colors as you need. Each gets its own complete range:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    { name: 'primary', color: 'blue' },
    { name: 'danger', color: 'tomato' },
    { name: 'success', color: 'green' }
  ]
})
```

Now you have `--primary-*`, `--danger-*`, and `--success-*` ranges. Each range maintains proper contrast with the base theme. Everything works together harmoniously.

---

## The Secret Sauce: APCA

Here's something most developers don't know: **WCAG 2.x contrast ratios are mathematically broken**.

### The WCAG 2.x Problem

WCAG 2.x uses a simple ratio like `4.5:1`. Sounds scientific, right? Except:

- It fails with dark colors (dark mode looks terrible)
- It's binary (4.49:1 fails, 4.51:1 passes—really?)
- It doesn't match human perception
- It ignores font size and weight

**Real example:**

```css
/* WCAG 2.x says this passes */
background: #2a2a2a;
color: #757575;
/* Try reading this. It's awful. */

/* WCAG 2.x says this fails */
background: #ffffff;
color: #767676;
/* This is perfectly readable. */
```

### The APCA Solution

APCA (Advanced Perceptual Contrast Algorithm) is the future WCAG 3.0 standard. It:

- **Matches human vision**: Uses perceptual uniformity, not linear math
- **Works in dark mode**: Actually accounts for how we see dark colors
- **Considers context**: Font size and weight matter
- **Provides ranges**: `Lc 75` for body text, `Lc 60` for headlines, etc.

**Umbra uses APCA by default.** Your themes are not just WCAG 2.x compliant—they're actually readable.

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  settings: {
    readability: 75  // APCA Lc value (higher = more contrast)
  }
})
```

| APCA Lc | Use Case | Umbra Application |
|---------|----------|-------------------|
| **90** | Body text | `--base-text`, `--accent-text` |
| **75** | Headings | `--base-120`, `--base-10` |
| **60** | Large text | `--base-100`, `--base-30` |
| **45** | Icons | `--base-80`, `--base-50` |
| **30** | Disabled | `--base-60` |

By the time WCAG 3.0 becomes the standard, your themes will already be compliant.

---

## Color Validation

Umbra automatically validates your color choices and warns you about potential accessibility issues.

### Automatic Contrast Checking

When you generate a theme, Umbra checks if your accent colors have enough contrast with the background and foreground:

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#1a1a1a',
  accents: {
    primary: '#f0f0f0',  // Too close to background!
  }
})

// Check for validation warnings
if (theme.validationWarnings.length > 0) {
  theme.validationWarnings.forEach(warning => {
    console.warn(`${warning.severity}: ${warning.message}`)
    console.log('Context:', warning.context)
  })
}
```

Output:
```
warning: Accent color 'primary' primer has low contrast with background
Context: { accentName: 'primary', contrast: 12.5, threshold: 30, against: 'background' }
```

### Validation Rules

Umbra validates color contrast at two levels:

| Check | Requirement | Setting | Why It Matters |
|-------|-------------|---------|----------------|
| **Foreground vs Background** | APCA Lc ≥ 70 | `readability` | Ensures base text is readable |
| **Accent vs Background** | APCA Lc ≥ 30 | `minContrastThreshold` | Ensures accent elements are visible |
| **Accent vs Foreground** | APCA Lc ≥ 30 | `minContrastThreshold` | Prevents accents from blending with text |

The defaults balance accessibility with design flexibility: **70 APCA Lc** for text readability, **30 APCA Lc** for accent visibility.

### Customizing Thresholds

Adjust validation thresholds independently:

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#f5f5f5',  // Close to background
  accents: {
    primary: '#e8e8e8',   // Also close to background
  },
  settings: {
    readability: 45,            // Stricter base fg/bg requirement
    minContrastThreshold: 30    // Standard accent validation
  }
})
```

### Handling Warnings in Production

Validation warnings are development aids—use them to improve your color choices:

```typescript
function createTheme(colors) {
  const theme = umbra(colors)
  
  if (process.env.NODE_ENV === 'development') {
    if (theme.validationWarnings.length > 0) {
      console.group('🎨 Theme Validation Warnings')
      theme.validationWarnings.forEach(w => {
        console.warn(w.message)
        console.log('Details:', w.context)
      })
      console.groupEnd()
    }
  }
  
  return theme
}
```

### What Gets Validated

| Validated | Not Validated |
|-----------|---------------|
| ✅ Accent primer colors | ❌ Generated scale colors |
| ✅ Contrast with background | ❌ Color harmony |
| ✅ Contrast with foreground | ❌ Color blindness |
| ✅ APCA-based checks | ❌ WCAG 2.x ratios |

**Why only primer colors?** The generated color scales are mathematically derived to meet accessibility standards. If the primer passes validation, the entire scale will be accessible.

### TypeScript Support

Full type safety for validation warnings:

```typescript
import { umbra, type ValidationWarning } from '@umbrajs/core'

const theme = umbra({ /* ... */ })

theme.validationWarnings.forEach((warning: ValidationWarning) => {
  // warning.type: 'low-contrast'
  // warning.severity: 'warning' | 'error'
  // warning.message: string
  // warning.context: { accentName, contrast, threshold, against }
})
```

For more details, see [VALIDATION.md](./VALIDATION.md).

---

## Framework Integration

### React

```typescript
import { umbra } from '@umbrajs/core'
import { useEffect, useState } from 'react'

function useTheme(initialTheme) {
  const [theme, setTheme] = useState(() => umbra(initialTheme))
  
  useEffect(() => {
    theme.apply()
  }, [theme])
  
  const toggleDarkMode = () => {
    setTheme(current => current.inverse())
  }
  
  return { theme, toggleDarkMode, isDark: theme.isDark() }
}

// Usage
function App() {
  const { toggleDarkMode, isDark } = useTheme({
    background: '#ffffff',
    foreground: '#000000',
    accents: ['blue']
  })
  
  return (
    <button onClick={toggleDarkMode}>
      Switch to {isDark ? 'light' : 'dark'} mode
    </button>
  )
}
```

### Vue

```typescript
import { umbra } from '@umbrajs/core'
import { ref, watch } from 'vue'

export function useUmbra(initialTheme) {
  const currentTheme = ref(umbra(initialTheme))
  
  watch(currentTheme, (theme) => {
    theme.apply()
  }, { immediate: true })
  
  const toggleDarkMode = () => {
    currentTheme.value = currentTheme.value.inverse()
  }
  
  return {
    theme: currentTheme,
    toggleDarkMode,
    isDark: computed(() => currentTheme.value.isDark())
  }
}
```

### Tailwind CSS v4

Umbra's CSS variables work directly with Tailwind v4—no configuration needed:

```html
<div class="bg-[var(--base-10)] text-[var(--base-text)]">
  <button class="bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-90)]">
    Click me
  </button>
</div>
```

Or configure theme colors for cleaner syntax:

```javascript
// tailwind.config.js
export default {
  theme: {
    colors: {
      base: {
        DEFAULT: 'var(--base)',
        10: 'var(--base-10)',
        20: 'var(--base-20)',
        // ...
        text: 'var(--base-text)',
      },
      primary: {
        DEFAULT: 'var(--primary)',
        10: 'var(--primary-10)',
        // ...
      }
    }
  }
}
```

Then use normal Tailwind classes:

```html
<div class="bg-base-10 text-base-text">
  <button class="bg-primary text-primary-text hover:bg-primary-90">
    Click me
  </button>
</div>
```

---

## Storing Themes: The Stable Schema

When you generate a theme dynamically, the configuration uses logic (numbers, easing functions, etc.) to create colors. This means if Umbra's generation algorithm improves in a future version, your theme could change unexpectedly when you update the package.

**The solution:** Use the `stable` property on the output. It's a serializable representation of your generated theme using only color strings—perfect for storage and SSR.

### Why You Need This

**Problem 1: Version Stability**
```typescript
// Your config uses generation logic
const theme = umbra({
  baseRange: [10, 20, '+=10', 50, 60, 70, 80, 90],
  accents: ['blue']
})

// If Umbra updates its generation algorithm, these numbers
// might produce different colors in the next version
```

**Problem 2: SSR & Serialization**
```typescript
// This won't serialize for SSR or Pinia state
const config = {
  baseRange: [10, 20, '+=10', 50], // Contains logic
  accents: [{ name: 'primary', color: 'blue' }]
}

JSON.stringify(config) // ❌ Works, but will regenerate differently later
```

### The Solution: Stable Schema

Every theme output includes a `stable` property with the exact colors that were generated:

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{ name: 'primary', color: 'blue' }]
})

const outputs = theme.format()

// outputs.stable contains only strings - perfectly serializable
console.log(outputs.stable)
// {
//   background: "#ffffff",
//   foreground: "#000000",
//   baseRange: [
//     "#f5f5f5", "#e0e0e0", "#d0d0d0", ...
//   ],
//   accents: [
//     {
//       name: "primary",
//       color: "#0066ff",
//       range: ["#f0f6ff", "#e0edff", ...]
//     }
//   ]
// }
```

### Storing & Loading Themes

**1. Generate and Store**
```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue', 'red']
})

const { stable } = theme.format()

// Store anywhere - localStorage, database, Pinia, etc.
localStorage.setItem('myTheme', JSON.stringify(stable))
```

**2. Load and Apply**
```typescript
// Load the stable schema
const stored = JSON.parse(localStorage.getItem('myTheme'))

// Pass it directly to umbra - it just works!
const theme = umbra(stored)
theme.apply()
```

The stable schema is just another valid `umbra()` input—no special handling needed.

### SSR Example (Nuxt/Next)

```typescript
// Server-side: generate theme
export async function getServerSideProps() {
  const theme = umbra({ background: '#fff', foreground: '#000', accents: ['blue'] })
  const { stable } = theme.format()
  
  return {
    props: {
      themeSchema: stable  // ✅ Serializes perfectly
    }
  }
}

// Client-side: hydrate theme
export default function Page({ themeSchema }) {
  useEffect(() => {
    umbra(themeSchema).apply()
  }, [])
}
```

### State Management Example (Pinia)

```typescript
export const useThemeStore = defineStore('theme', () => {
  const stableScheme = ref<StableScheme | null>(null)
  
  function saveTheme(theme: Umbra) {
    const { stable } = theme.format()
    stableScheme.value = stable
    // Pinia can serialize this perfectly
  }
  
  function applyTheme() {
    if (stableScheme.value) {
      umbra(stableScheme.value).apply()
    }
  }
  
  return { stableScheme, saveTheme, applyTheme }
})
```

### Database Storage

```typescript
// Save generated theme
const theme = umbra({ /* ... */ })
const { stable } = theme.format()

await db.themes.create({
  name: 'My Brand Theme',
  schema: stable  // Store as JSON
})

// Load and apply later
const saved = await db.themes.findOne({ name: 'My Brand Theme' })
umbra(saved.schema).apply()
```

### Key Benefits

✅ **Version Stable** - Colors never change across Umbra updates  
✅ **SSR Ready** - 100% serializable with `JSON.stringify/parse`  
✅ **State Management** - Works with Pinia, Redux, Zustand, etc.  
✅ **Database Friendly** - Store as JSON in any database  
✅ **No Special API** - Just pass the stable schema to `umbra()`

---

## API Reference

### Core Function: `umbra(config?)`

Creates a theme system. All parameters are optional.

```typescript
const theme = umbra({
  background: '#ffffff',  // Optional, defaults to white
  foreground: '#000000',  // Optional, defaults to black
  accents: ['blue'],      // Optional, defaults to empty
  settings: {             // Optional settings
    readability: 75,      // APCA Lc contrast target
    shades: [/* ... */],  // Custom shade progression
    tints: [/* ... */]    // Custom tint progression
  }
})
```

### Theme Methods

#### `.validationWarnings`

An array of validation warnings about potential accessibility issues.

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#1a1a1a',
  accents: { primary: '#f5f5f5' }  // Too close to background
})

theme.validationWarnings.forEach(warning => {
  console.warn(warning.message)
  // "Accent color 'primary' primer has low contrast with background"
})
```

See the [Color Validation](#color-validation) section for details.

#### `.apply(options?)`

Applies the theme to the DOM as CSS variables.

```typescript
// Apply to :root (default)
theme.apply()

// Apply to specific element
theme.apply({ target: '.my-component' })

// Custom formatter
theme.apply({ 
  formatter: (color) => color.toHex()
})

// Disable range mapping classes
theme.apply({ rangeMapping: false })
```

**Options:**
- `target` - Element or selector to apply theme to (default: `:root`)
- `rangeMapping` - Generate `.base-*` mapping classes (default: `true`)
- `alias` - CSS variable aliases object

#### `.inverse()`

Creates an inverted version of the theme.

```typescript
const dark = light.inverse()
dark.apply({ target: '.dark' })
```

#### `.format(formatter?)`

Formats colors without applying them.

```typescript
theme.format('hex')    // Hex strings
theme.format('rgb')    // RGB strings  
theme.format('hsl')    // HSL strings

// Custom formatter
theme.format((color) => color.toOklch())
```

#### `.isDark()`

Returns `true` if background is dark.

```typescript
if (theme.isDark()) {
  console.log('Using dark mode')
}
```

### Configuration Types

#### `UmbraInput`

```typescript
interface UmbraInput {
  background?: string      // Background color
  foreground?: string      // Foreground/text color
  accents?: string | Array<string | Accent>  // Accent colors
  settings?: UmbraSettings // Generation settings
  inversed?: UmbraInput    // Custom inverse theme
}
```

#### `Accent`

```typescript
interface Accent {
  name?: string           // CSS variable name
  color: string           // Hex color or preset name
  readability?: number    // Custom readability target
  tints?: UmbraShade[]   // Custom light theme progression
  shades?: UmbraShade[]  // Custom dark theme progression
}
```

#### `UmbraSettings`

```typescript
interface UmbraSettings {
  readability?: number           // APCA target for base fg/bg (default: 70)
  iterations?: number            // Adjustment iterations (default: 20)
  minContrastThreshold?: number  // Accent primer validation (default: 30)
  shades?: UmbraShade[]         // Dark theme progression
  tints?: UmbraShade[]          // Light theme progression
  formatter?: Formatter          // Output format
}
```

**Settings:**
- `readability` - APCA Lc contrast target for base foreground/background (default: 70)
- `iterations` - Number of color adjustment iterations (default: 20)
- `minContrastThreshold` - Minimum APCA Lc for accent primer validation (default: 30)
- `shades` - Custom progression for dark mode color scales
- `tints` - Custom progression for light mode color scales
- `formatter` - Default output formatter for colors

### Utility Functions

#### Color Analysis

```typescript
import { getReadability, isDark, mostReadable } from '@umbrajs/core'

// Check APCA contrast
getReadability('#fff', '#000')  // → 107

// Check if color is dark
isDark('#1a1a1a')  // → true

// Find most readable option
mostReadable('#fff', ['#ff0000', '#00ff00', '#0000ff'])
```

#### Color Manipulation

```typescript
import { colorMix, findContrast } from '@umbrajs/core'

// Mix two colors
colorMix('#ff0000', '#0000ff', 0.5)

// Find high contrast color
findContrast('#888888')
```

#### Presets

```typescript
import { 
  colorPresets,
  getPresetByName, 
  findClosestPreset,
  resolveColorPreset 
} from '@umbrajs/core'

// All available presets
console.log(colorPresets)

// Get preset by name/alias
getPresetByName('blue')
getPresetByName('sky')  // Alias for blue

// Find closest match
findClosestPreset('#0095FF')  // → blue preset

// Resolve any color input
resolveColorPreset('tomato')    // → { hex: '#E54D2E', preset: {...} }
resolveColorPreset('#E54D2E')   // → { hex: '#E54D2E', preset: {...} }
```

---

## Advanced Concepts

### Custom Color Progressions

By default, Umbra generates 12 evenly-spaced shades. You can customize this:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  settings: {
    // Custom progression with specific percentages
    tints: [0.5, 2, 5, 8, 12, 18, 25, 35, 50, 65, 80, 92]
  }
})
```

Each number represents the mix percentage from background to foreground.

### Color Stops

You can insert specific colors into the progression:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primary',
    tints: [
      5, 8, 12, 17, 24, 35,
      '#0090ff',  // Exact color at this position
      45, 55, 65, 75, 85
    ]
  }]
})
```

### HSL Interpolation

Fine-tune individual color channels:

```typescript
umbra({
  accents: [{
    name: 'primary',
    tints: [
      { mix: 1, hue: "next", saturation: "+=99" },  // Inherit hue from accent
      { mix: 5, hue: 0, saturation: "-=10" },       // Preserve hue, reduce saturation
      10, 20, 30, 40,
      '#0090ff',
      50, 60, 70, 80, 90
    ]
  }]
})
```

**Advanced controls:**
- `mix`: Base interpolation position (0-100%)
- `hue`: Hue adjustment (`0` = preserve, `"next"`/`"prev"` = reference, or degrees)
- `saturation`: Saturation override (`"+=20"` = increase by 20%, or absolute value)
- `lightness`: Lightness override

### Multiple Themes

Create theme variations for different contexts:

```typescript
const themes = {
  default: umbra({
    accents: ['blue']
  }),
  
  brand: umbra({
    accents: [
      { name: 'primary', color: 'purple' },
      { name: 'secondary', color: 'pink' }
    ]
  }),
  
  high-contrast: umbra({
    background: '#000000',
    foreground: '#ffffff',
    settings: {
      readability: 90  // Maximum contrast
    }
  })
}

// Apply dynamically
themes[currentTheme].apply()
```

### Radix Colors Integration

Use Radix color scales directly:

```typescript
import { slate, blue, red } from '@radix-ui/colors'
import { umbra } from '@umbrajs/core'

umbra({
  background: '#ffffff',
  foreground: '#000000',
  settings: {
    tints: Object.values(slate)
  },
  accents: [{
    name: 'primary',
    tints: Object.values(blue)
  }]
})
```

---

## Color Preset Reference

### Available Presets

| Name | Hex | Aliases | Description |
|------|-----|---------|-------------|
| tomato | `#E54D2E` | red | Warm red |
| orange | `#F76B15` | amber | Vibrant orange |
| yellow | `#FFE629` | gold | Bright yellow |
| lime | `#BDEE63` | — | Yellow-green |
| green | `#30A46C` | emerald, grass | Natural green |
| cyan | `#00A2C7` | teal, aqua | Blue-green |
| blue | `#0090FF` | azure, sky | Primary blue |
| indigo | `#3E63DD` | — | Deep blue |
| purple | `#8E4EC6` | violet, lavender | Purple |
| pink | `#E93D82` | rose, crimson | Vibrant pink |
| brown | `#AD7F58` | bronze | Warm brown |
| gray | `#8B8D98` | grey, slate | Neutral gray |

### Usage

```typescript
// By name
umbra({ accents: ['blue', 'tomato', 'green'] })

// By alias
umbra({ accents: ['sky', 'red', 'emerald'] })

// Mixed with hex
umbra({ accents: ['blue', '#FF00FF'] })

// With custom config
umbra({
  accents: [{
    color: 'blue',
    name: 'primary',
    // Preset tints/shades used automatically
  }]
})

// Override preset
umbra({
  accents: [{
    color: 'blue',
    tints: [/* custom values */]  // Replaces preset tints
  }]
})
```

### Why Presets?

Each preset includes hand-tuned color progressions that:
- Look great in both light and dark mode
- Maintain optimal contrast at every shade
- Follow design best practices
- Save you hours of manual tuning

**Without presets:** ~30 lines of configuration per color  
**With presets:** 1 word

---

## Complete Examples

### Multi-Theme App

```typescript
import { umbra } from '@umbrajs/core'

// Theme configurations
const themes = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    accents: [
      { name: 'primary', color: 'blue' },
      { name: 'success', color: 'green' },
      { name: 'danger', color: 'tomato' },
      { name: 'warning', color: 'yellow' }
    ]
  },
  
  dark: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    accents: [
      { name: 'primary', color: 'blue' },
      { name: 'success', color: 'green' },
      { name: 'danger', color: 'tomato' },
      { name: 'warning', color: 'yellow' }
    ]
  },
  
  brand: {
    background: '#ffffff',
    foreground: '#1a1a1a',
    accents: [
      { name: 'primary', color: 'purple' },
      { name: 'secondary', color: 'pink' }
    ]
  }
}

// Apply theme
function applyTheme(themeName) {
  umbra(themes[themeName]).apply()
}

// Initialize
applyTheme('light')

// Toggle dark mode
function toggleDark() {
  const current = document.body.classList.contains('dark') ? 'light' : 'dark'
  applyTheme(current)
  document.body.classList.toggle('dark')
}
```

### Component Library

```typescript
import { umbra } from '@umbrajs/core'

// Create semantic color system
const designSystem = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    // UI States
    { name: 'primary', color: 'blue' },
    { name: 'secondary', color: 'purple' },
    
    // Feedback
    { name: 'success', color: 'green' },
    { name: 'warning', color: 'yellow' },
    { name: 'danger', color: 'tomato' },
    { name: 'info', color: 'cyan' },
    
    // Neutrals are handled by base range automatically
  ]
}).apply()

// CSS using the system
const styles = `
  .btn-primary {
    background: var(--primary);
    color: var(--primary-text);
  }
  
  .btn-primary:hover {
    background: var(--primary-90);
  }
  
  .alert-success {
    background: var(--success-20);
    border: 1px solid var(--success-60);
    color: var(--success-110);
  }
  
  .badge-warning {
    background: var(--warning-30);
    color: var(--warning-100);
  }
`
```

### Dynamic Brand Colors

```typescript
import { umbra } from '@umbrajs/core'

function applyBrandTheme(brandColor) {
  umbra({
    background: '#ffffff',
    foreground: '#000000',
    accents: [
      { name: 'brand', color: brandColor },
      { name: 'success', color: 'green' },
      { name: 'danger', color: 'tomato' }
    ]
  }).apply()
}

// User selects their brand color
applyBrandTheme('#FF6B6B')  // Coral brand
applyBrandTheme('#4ECDC4')  // Teal brand
applyBrandTheme('#95E1D3')  // Mint brand
```

---

## Troubleshooting

### Colors look washed out

Increase the readability setting:

```typescript
umbra({
  settings: {
    readability: 85  // Higher = more contrast
  }
})
```

### Dark mode is too harsh

Lower the readability for dark themes:

```typescript
const dark = umbra({
  background: '#0a0a0a',
  foreground: '#ffffff',
  settings: {
    readability: 65  // Softer contrast
  }
})
```

### Accent colors don't pop

Use saturation adjustments:

```typescript
umbra({
  accents: [{
    color: 'blue',
    tints: [
      { mix: 1, saturation: "+=50" },  // Boost early shades
      { mix: 5, saturation: "+=30" },
      10, 20, 30, 40, 50, 60, 70, 80, 90, 95
    ]
  }]
})
```

### Variables not updating

Make sure to call `.apply()`:

```typescript
const theme = umbra({ accents: ['blue'] })
theme.apply()  // ← Don't forget this!
```

### TypeScript errors

Import types explicitly:

```typescript
import type { UmbraInput, Accent } from '@umbrajs/core'

const config: UmbraInput = {
  accents: ['blue'] as const
}
```

---

## Performance Tips

### Minimize re-renders

Cache theme instances:

```typescript
const themeCache = new Map()

function getTheme(key, config) {
  if (!themeCache.has(key)) {
    themeCache.set(key, umbra(config))
  }
  return themeCache.get(key)
}
```

### Debounce theme changes

```typescript
import { debounce } from 'lodash'

const applyTheme = debounce((config) => {
  umbra(config).apply()
}, 150)
```

### Scope CSS variables

Only apply to affected elements:

```typescript
// Instead of global
umbra(config).apply()

// Scope to component
umbra(config).apply({ target: '.my-component' })
```

---

## Migration Guides

### From Styled Components

**Before:**
```typescript
const theme = {
  primary: '#0090ff',
  primaryLight: '#66b3ff',
  primaryDark: '#0066cc',
  // ... manually define 20+ colors
}
```

**After:**
```typescript
umbra({
  accents: [{ name: 'primary', color: '#0090ff' }]
}).apply()

// Use: var(--primary-20), var(--primary), var(--primary-110), etc.
```

### From Tailwind

Keep using Tailwind classes, but with Umbra variables:

```typescript
// Generate theme
umbra({ accents: ['blue'] }).apply()
```

```html
<!-- Use in Tailwind -->
<div class="bg-[var(--base-10)] text-[var(--base-text)]">
  <button class="bg-[var(--accent)] hover:bg-[var(--accent-90)]">
    Click me
  </button>
</div>
```

### From CSS Variables

**Before:**
```css
:root {
  --color-bg: white;
  --color-text: black;
  --color-primary: blue;
  /* ... manually manage all shades */
}
```

**After:**
```typescript
umbra({
  background: 'white',
  foreground: 'black',
  accents: ['blue']
}).apply()

// Automatically get: --base, --base-10...120, --accent, --accent-10...120
```

---

## Best Practices

### ✅ Do

- Use color presets for common colors
- Name semantic accents (`primary`, `success`, `danger`)
- Let Umbra handle contrast ratios
- Use `.inverse()` for dark mode
- Scope themes to components when needed

### ❌ Don't

- Manually tune every shade (use presets!)
- Hardcode contrast ratios (trust APCA)
- Mix WCAG 2.x and APCA calculations
- Apply themes repeatedly without caching
- Override preset progressions unless necessary

### 🎯 Recommended Pattern

```typescript
// Define theme configs
const themes = {
  light: { /* config */ },
  dark: { /* config */ }
}

// Create instances
const instances = {
  light: umbra(themes.light),
  dark: umbra(themes.dark)
}

// Apply based on preference
function setTheme(mode) {
  instances[mode].apply()
}

// Initialize
setTheme(getPreferredMode())
```
---

## Learn More

### Documentation

- **[Color Presets Guide](COLOR_PRESETS.md)** - Complete guide to using color presets
- **[Range Mapping Guide](RANGE_MAPPING.md)** - Component style remapping with `.base-*` classes
- **[Implementation Details](PRESET_IMPLEMENTATION.md)** - Technical documentation for contributors

### Examples

- **[Live Demo](https://umbrax.netlify.app/)** - Interactive playground
- **[GitHub Repository](https://github.com/UmbraJS/core)** - Source code and examples

### Community

- **[Discussions](https://github.com/UmbraJS/core/discussions)** - Ask questions, share themes
- **[Issues](https://github.com/UmbraJS/core/issues)** - Report bugs, request features

---

## Contributing

We welcome contributions! Whether it's:

- 🐛 Bug reports and fixes
- ✨ New features and presets
- 📖 Documentation improvements
- 💡 Ideas and discussions

Please see our [Contributing Guide](https://github.com/UmbraJS/core/blob/main/CONTRIBUTING.md) for details.

---

## License

MIT © [Samuel M. Bednarz](https://github.com/CarelessCourage)

---

## Credits

- **Radix UI** - Inspiration for the 12-shade system and color methodology
- **APCA** - Advanced Perceptual Contrast Algorithm for true accessibility
- **The web community** - For continuous feedback and support

---

<div align="center">

**Made with ❤️ for developers who care about color**

[Documentation](https://umbrajs.org) • [Examples](https://umbrax.netlify.app/) • [GitHub](https://github.com/UmbraJS/core)

</div>
