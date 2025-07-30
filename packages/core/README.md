# UmbraJS Core

> **Modern theme management for the web**

A flexible, type-safe theme management library that creates semantic color systems based on the Umbra pattern - focusing on color relationships rather than specific element styling.

[![NPM Version](https://img.shields.io/npm/v/@umbrajs/core.svg)](https://www.npmjs.com/package/@umbrajs/coreIt's completely harmless and doesn't affect performance—just a little gift for curious developers who inspect their CSS! 🎉

## 🎨 The 12-Shade Color System

UmbraJS generates **12 intermediate shades** between your background and foreground colors, creating a total of **14 colors** per range (including the two stops). This 12-shade system is specifically designed to align with the **[Radix Colors](https://radix-ui.com/colors)** methodology, providing a scientifically-backed approach to color scale design.

### Why 12 Shades?

The 12-shade system isn't arbitrary—it's based on extensive research and testing by the Radix team to create optimal color scales for user interfaces. Each of the 12 steps serves specific use cases:

| Step | Use Case | CSS Variable |
|------|----------|--------------|
| 1 | App background | `--base-10` |
| 2 | Subtle background | `--base-20` |
| 3 | UI element background | `--base-30` |
| 4 | Hovered UI element background | `--base-40` |
| 5 | Active/Selected UI element background | `--base-50` |
| 6 | Subtle borders and separators | `--base-60` |
| 7 | UI element border and focus rings | `--base-70` |
| 8 | Hovered UI element border | `--base-80` |
| 9 | Solid backgrounds | `--base-90` |
| 10 | Hovered solid backgrounds | `--base-100` |
| 11 | Low-contrast text | `--base-110` |
| 12 | High-contrast text | `--base-120` |

> **Note:** The background and foreground colors become `--base-background` and `--base-foreground` respectively, with the 12 shades bridging between them.

### Radix Colors Integration

You can seamlessly integrate predefined Radix color scales with UmbraJS by importing them directly into your shade arrays:

```typescript
import { umbra } from '@umbrajs/core'
// Import your preferred Radix color scale
import { slate } from '@radix-ui/colors'

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  settings: {
    // Use Radix color values in your shades
    shades: slate
  }
})
```

### Benefits of the Unified System

This approach provides several advantages:

**🎯 **Consistency**: Whether you generate colors automatically or use predefined Radix scales, you get the same API and variable naming

**🔄 **Flexibility**: Mix and match generated colors with carefully crafted Radix colors as needed

**📐 **Standards-based**: Built on proven color theory and extensive usability testing

**♿ **Accessibility**: Both generated and Radix colors maintain proper contrast relationships

**🛠️ **Developer Experience**: Single system to learn, consistent tooling across your entire project

### Credit to Radix Colors

The 12-shade methodology is based on the excellent work by the [Radix UI team](https://radix-ui.com/). Their research into optimal color scales for user interfaces has informed UmbraJS's default configuration, ensuring that automatically generated themes follow the same scientific principles as their carefully crafted color palettes.

**Learn more:** [Radix Colors Documentation](https://radix-ui.com/colors/docs/palette-composition/understanding-the-scale)

## 🔬 Advanced Perceptual Contrast Algorithm (APCA)

UmbraJS uses the **Accessible Perceptual Contrast Algorithm (APCA)** instead of the traditional WCAG 2.x contrast ratios. This makes UmbraJS ahead of its time—APCA will become the new standard in **WCAG 3.0** due to its superior accuracy in matching human visual perception.

### Why APCA Over WCAG 2.x?

Traditional WCAG 2.x contrast is **mathematically correct but perceptually wrong**. Here's why:

**🧮 WCAG 2.x Problems:**
- **Linear math vs. curved perception**: Uses simple mathematical ratios that don't match how humans actually see
- **Dark mode failures**: Becomes functionally unreadable with dark colors
- **Binary pass/fail**: Oversimplified thresholds that don't serve the range of human vision
- **Context-blind**: Ignores font size, weight, and spatial characteristics

**🧠 APCA Advantages:**
- **Perceptually uniform**: Matches the curve of human visual perception
- **Context-aware**: Considers font size, weight, and spatial characteristics  
- **Dark mode optimized**: Works accurately across all color combinations
- **Range-based**: Provides nuanced guidance instead of binary pass/fail

### How UmbraJS Uses APCA

UmbraJS leverages APCA throughout its color generation process:

```typescript
import { umbra } from '@umbrajs/core'

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  settings: {
    readability: 70  // APCA Lc value, not WCAG ratio
  }
})
```

**APCA Integration Points:**

1. **Intelligent Color Adjustment**: When generating shades, UmbraJS uses APCA to ensure each step maintains proper perceptual contrast
2. **Adaptive Readability**: The `readability` setting uses APCA's Lc (lightness contrast) values for precise control
3. **Dark Mode Accuracy**: Unlike WCAG 2.x, APCA ensures dark themes remain readable
4. **Contextual Optimization**: APCA's spatial awareness helps optimize contrast based on expected usage

### APCA Readability Scale

UmbraJS uses APCA's Lc (lightness contrast) values, which range from 0 to ±106:

| Lc Value | Use Case | UmbraJS Application |
|----------|----------|-------------------|
| **Lc 90** | Body text, reading content | High-contrast text variables |
| **Lc 75** | Important text, minimum readability | Primary text elements |
| **Lc 60** | Content text, headlines | Secondary text, larger elements |
| **Lc 45** | Large headings, pictograms | UI accents, interactive elements |
| **Lc 30** | Placeholder text, disabled elements | Subtle UI elements |
| **Lc 15** | Minimal visibility threshold | Borders, dividers |

### The Future of Contrast

By using APCA, UmbraJS themes are **future-ready** for WCAG 3.0 while providing **better accessibility today**:

```typescript
// Traditional approach (WCAG 2.x)
// ❌ May pass ratios that are actually unreadable in dark mode
// ❌ May fail ratios that are perfectly readable

// UmbraJS with APCA
// ✅ Perceptually accurate across all color combinations
// ✅ Consistent readability in light and dark modes
// ✅ Context-aware contrast optimization
const theme = umbra({
  background: '#1a1a1a',  // Dark background
  foreground: '#ffffff',  // Light text
  settings: {
    readability: 75  // APCA ensures this is truly readable
  }
})
```

### Visual Comparison

The difference is dramatic, especially in dark mode:

```css
/* WCAG 2.x "passing" colors that are actually hard to read */
background: #2a2a2a;
color: #757575; /* Passes WCAG 2.x but hard to read */

/* APCA-optimized colors from UmbraJS */
background: var(--base-background); /* #1a1a1a */
color: var(--base-foreground);      /* Truly readable */
```

**The science is clear**: Human perception follows curves, not linear math. APCA's perceptual uniformity means that Lc 60 represents the same perceived contrast whether you're using light or dark colors—something impossible with WCAG 2.x ratios.

**Learn more:** [APCA Documentation](https://git.apcacontrast.com/documentation/APCAeasyIntro) | [The Realities And Myths Of Contrast And Color](https://www.smashingmagazine.com/2022/09/realities-myths-contrast-color/)

## 🌈 Advanced Usage![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎯 Simple** - Single function call to generate complete theme systems
- **💪 Flexible** - Extensible primitives for building custom theming logic
- **🔒 Type-safe** - Full TypeScript support with intelligent autocompletion
- **♿ Accessible** - Built-in APCA color contrast compliance and readability scoring
- **🎨 Semantic** - Color relationships that work across light/dark themes automatically
- **⚡ Performant** - Optimized color generation and CSS variable management
- **🌊 Tailwind Ready** - CSS variables work directly with Tailwind CSS v4
- **🔬 Future-ready** - Uses APCA contrast algorithm (the future WCAG 3.0 standard)

UmbraJS creates semantic color themes by defining relationships between background, foreground, and accent colors. This approach ensures consistent readability and enables easy theme switching, automatic dark/light mode generation, and scalable color systems that grow with your application.

**What makes UmbraJS unique:** Uses the advanced **APCA contrast algorithm** (future WCAG 3.0 standard) instead of outdated WCAG 2.x ratios, providing perceptually accurate contrast that actually matches human vision.

**[Try it live →](https://umbrax.netlify.app/)**

## 🚀 Quick Start

### Installation

```bash
npm install @umbrajs/core
```

### Basic Usage

```typescript
import { umbra } from '@umbrajs/core'

// Simple theme with automatic color generation
const theme = umbra({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074']
}).apply();
```

Generated CSS variables:
```css
:root {
  // The base range logic for the whole theme
  --base: #0c0915; // Base background color stop
  --base-10: #201c26; // Base background color stop
  --base-20: #484349; // Base background color stop
  --base-30: #524f56; // Base background color stop
  --base-40: #615e64; // Base background color stop
  --base-50: #6e6c70; // Base background color stop
  --base-60: #8d8d8d; // Base background color stop
  --base-70: #ababa8; // Base background color stop
  --base-80: #bdbdb8; // Base background color stop
  --base-90: #cacbc4; // Base background color stop
  --base-100: #d4d6cd; // Base background color stop
  --base-110: #e1e3da; // Base background color stop
  --base-120: #eef0e7; // Base background color stop
  --base-contrast: #d5c9c1; // Base foreground color stop

  // The accent range logic based on the base range
  --accent: #9999ff; // Original accent color - maintained to be exactly what the user provided
  // The real accent starting color is the background stop for the base range not the accent
  --accent-10: #1b1828; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-20: #201d31; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-30: #25223a; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-40: #2a2743; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-50: #39365c; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-60: #423f6b; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-70: #4a4779; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-80: #5d5a99; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-90: #6e6cb7; // accent color shade - mixed from base background stop towards the accent color stop
  --accent-100: #9999ff; // Original accent color fit best into this part of the range so we put the accent here as a color stop
  --accent-110: #b2affb; // accent color shade - mixed from the accent color stop towards the base foreground stop
  --accent-120: #c3c0f7; // accent color shade - mixed from the accent color stop towards the base foreground stop
  --accent-contrast: #d5c9c1; // the same as the base foreground color stop
}
```

Use in your CSS:
```css
.card {
  background: var(--base-10);
  color: var(--base-contrast);
  border: 1px solid var(--accent-20);
}
```

> **💡 Tailwind CSS v4 Users:** CSS variables work directly in Tailwind v4! [See Tailwind setup guide →](#tailwind-css-integration)

## 📖 API Reference

### Core Function

```typescript
function umbra(input?: UmbraInput): Umbra
```

The main function that creates a theme system. All parameters are optional with intelligent defaults.

**Example:**
```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#007acc'],
  settings: {
    readability: 70, // Target readability score (APCA Lc value). Defines how far it will push the foreground color stop away from the background color stop to create the range if the two stops are too close.
    // Default: 12 shades between stops (14 total colors)
    // The amount of change between each shade as they move from the background to the foreground does not have to be linear. 
    // And the dark theme and the light theme might require different non-linear curves through the range to their target.
    // Therefore shades and tints are separated out. Shades to describe the colors moving from a light stop towards a dark stop ergo light mode. 
    // And tints to describe the colors moving from a dark stop towards a light stop ergo dark mode.
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25], 
    tints: [5, 10, 10, 10, 15, 15, 25, 15, 15, 15, 15, 25]
  }
})
```

**Example 2:**

  This example highlights how you can take control of where in the base range to drop the accent stop. Its also a good visual for how it works. This is why the base range has 2 color stops and 12 shades - while the accept range has 3 color stops. the same 2 the base range has - and a third one placed inbetween them.

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primary',
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, '#007acc', 25, 25],
  }],
})
```

In this example we dont tell the accent explicitly where to put the color so umbra will find the place between the two color stops that best aligns with the given color - this ensures that the amount of space the shades have to work with in between the stops is maximised.

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primary',
    color: '#007acc',
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25],
  }],
})
```

You can also add as many color stops as you want.

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primary',
    shades: [5, 5, 5, 5, 15, "#007acc", 10, 25, 30, '#007acc', 25, 25],
  }],
})
```

### Theme Object Methods

The `umbra()` function returns a theme object with these methods:

The umbra theme generation pipeline has 3 steps. 1: generate the ranges and prepare them. 2: format the colors. 3: attach the colors to the DOM.

```typescript
const theme = umbra({ background: '#0c0915' }) // super quick dark theme

// Apply css variables to a generated stylesheet
const formated = theme.format((color) => color.toHex()) // Custom formatter to control output format
const appliedOutput = theme.attach(document.querySelector('.my-component'))

// .apply() is actually just a shortcut for .format().apply()
theme.apply() // Applies the theme to the DOM
```


#### `theme.apply(options?)`
Applies the theme to the DOM by setting CSS variables.

```typescript
const theme = umbra({ background: '#0c0915' }) // super quick dark theme

// Apply css variables to a generated stylesheet
theme.apply()

// Apply css variables to a specific element
theme.apply({ target: document.querySelector('.my-component') })

// Use custom CSS variable formatter to control output format
theme.apply({ 
  formater: (color) => color.toHex(),
})
```

#### `theme.inverse()`
Creates an inverted version of the theme (useful for dark/light mode toggling).

```typescript
const darkTheme = theme.inverse()
darkTheme.apply({ target: '.dark-mode' })
```

The way theme.inverse works is by simply taking the background and foreground colorstops, switching them, and switching from the shader color mix range to the tint color mix range. It will then remember the original theme so it can consistently revert back.
But you can take full control of this by providing the `inversed` property in the input object. This lets you tell umbra exactly what the inversed theme should be.

```typescript
const themeInput: UmbraInput = {
  foreground: '#16121f',
  background: '#f3f6ea',
  accents: ['#9999ff'],
  inversed: {
    foreground: '#f3f6ea',
    background: '#16121f',
    accents: ['#9999ff'],
  },
}
```

#### `theme.format(formater?)`
Returns formatted color data without applying to DOM.

```typescript
const formatted = theme.format('hex')
console.log(formatted.colors) // Array of formatted color ranges
```

#### `theme.isDark()`
Returns `true` if the theme has a dark background.

```typescript
if (theme.isDark()) {
  console.log('This is a dark theme')
}
```

## ⚙️ Configuration

### Color Input

```typescript
interface UmbraInput {
  background?: string      // Base background color
  foreground?: string      // Base foreground color  
  accents?: string | (string | Accent)[]  // Accent colors
  settings?: UmbraSettings // Theme generation settings
  inversed?: UmbraInput    // Inverse theme colors
}
```

**Basic colors:**
```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#007acc', '#ff6b6b']
})
```

**More complex theme with multiple named accents:**
```typescript
const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const infoAccent: Accent = {
  name: 'info',
  color: '#2bb8e6',
}

const yellowAccent: Accent = {
  name: 'yellow',
  color: '#ffff00',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

const themeInput: UmbraInput = {
  foreground: '#16121f',
  background: '#f3f6ea',
  // unnamed accent colors will simply show up as --accent-* variables
  accents: ['#9999ff', warningAccent, successAccent, infoAccent, yellowAccent],
}
```

**Advanced accent configuration:**
```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    '#007acc',
    {
      name: 'danger',
      color: '#ff6b6b',
      readability: 7,
      // Custom shades for this accent (uses 12-shade default if omitted)
      shades: [10, 20],
      tints: [90, 80]
    }
  ]
})
```

### Settings

```typescript
interface UmbraSettings {
  readability?: number     // Target APCA readability score (default: 70)
  iterations?: number      // Color adjustment iterations (default: 20)
  shades?: (number | string)[]  // Darker shade percentages (default: 12 shades)
  tints?: (number | string)[]   // Lighter tint percentages (default: 12 tints)
  formater?: Formater      // Output format ('hex', 'rgb', 'hsl')
  aliases?: Alias | true   // CSS variable aliases
  callback?: (output: UmbraOutputs) => void  // Apply callback
}
```

**Accessibility with APCA:**
```typescript
umbra({
  background: '#ffffff',
  foreground: '#333333',
  settings: {
    readability: 12  // Higher score = better contrast
  }
})
```

**Custom shade generation:**
```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  settings: {
    // Custom example with fewer shades (not recommended)
    shades: [5, 10, 20, 40],  // 4 darker variations
    tints: [95, 90, 80, 60]   // 4 lighter variations
    // Default uses 12 shades for optimal UI design
  }
})
```

## � Understanding Color Ranges

### The Umbra Philosophy

UmbraJS doesn't just generate colors—it creates **color ranges**. This fundamental concept is what makes UmbraJS themes so powerful and consistent.

#### Base Range: The Foundation

Every theme starts with a **base range** defined by your foreground and background colors:

```typescript
umbra({
  background: '#ffffff', // Range start
  foreground: '#000000'  // Range end
})

// Creates a base range from white to black
// All shades are calculated as steps along this range
```

The base range becomes your theme's foundation:
- `--base-background` (start of range)
- `--base-10`, `--base-20` (darker steps toward foreground)
- `--base-90`, `--base-80` (lighter steps toward background)  
- `--base-foreground` (end of range)

#### Accent Ranges: Semantic Color Systems

**Accents aren't just colors—they're entire color ranges** built in relationship to your base range:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    '#3b82f6',              // Creates: --accent-* range
    {
      name: 'success',      // Creates: --success-* range
      color: '#10b981'
    },
    {
      name: 'warning',      // Creates: --warning-* range  
      color: '#f59e0b'
    }
  ]
})
```

Each accent creates its own complete range:
- `--success-background` (the accent color)
- `--success-10`, `--success-20` (darker variations)
- `--success-90`, `--success-80` (lighter variations)
- `--success-contrast` (optimal contrast color)

#### Smart Range Relationships

UmbraJS calculates each accent range **in relationship to your base range**:

1. **Takes your accent color** as a point of reference
2. **Finds its position** relative to the base range's contrast spectrum
3. **Builds a complete range** with proper contrast relationships
4. **Ensures readability** across all generated shades

```typescript
// This creates ranges that work harmoniously together
const theme = umbra({
  background: '#1a1a1a', // Dark theme base
  foreground: '#ffffff',
  accents: [
    // it's recommended to name your accents if you have multiple
    { name: 'primary', color: '#3b82f6' },
    { name: 'success', color: '#10b981' },
    { name: 'danger', color: '#ef4444' }
  ]
})

// Each accent range maintains proper contrast with the base
// All colors work together semantically
```

#### Multiple Accents with Same Names

When you create multiple accents with the same name, UmbraJS intelligently increments naming:

```typescript
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    { name: 'brand', color: '#3b82f6' },  // --brand-*
    { name: 'brand', color: '#8b5cf6' },  // --brand-2-*
    { name: 'brand', color: '#ec4899' }   // --brand-3-*
  ]
})

// more typically this might happen when you just insert multiple accent colors without naming them
umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    '#3b82f6', // --accent-*
    '#8b5cf6', // --accent-2-*
    '#ec4899'  // --accent-3-*
  ]
})
```

### Why Ranges Matter

This range-based approach provides several key benefits:

**🎯 Consistency**: All colors are mathematically related, ensuring visual harmony

**♿ Accessibility**: Every shade maintains proper contrast relationships

**🔄 Flexibility**: Change your base colors and all accents adapt automatically

**🎨 Semantics**: Named ranges (`success`, `warning`, `info`) provide clear meaning

**📱 Scalability**: Add new accent ranges without breaking existing relationships

### 🥚 Easter Egg: Generation Counter

Here's a fun secret! UmbraJS includes a hidden counter in the generated CSS that tracks how many times themes have been applied to your page. Look for it in your browser's DevTools:

```css
/* Each time you apply a theme, UmbraJS creates a selector like this: */
theme-2-15, :root { 
  --base-background: #ffffff;
  /* ... your variables ... */
}
```

The numbers mean:
- **First number**: How many times this specific selector has been updated  
- **Second number**: Total theme applications across your entire page

It's completely harmless and doesn't affect performance—just a little gift for curious developers who inspect their CSS! 🎉

## �🌈 Advanced Usage

### Dark/Light Mode

```typescript
// Create base theme
const lightTheme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#007acc']
})

// Apply light theme
lightTheme.apply()

// Create and apply dark theme
const darkTheme = lightTheme.inverse()
darkTheme.apply({ target: '.dark' })
```

### Scoped Themes

Apply different themes to different parts of your application:

```typescript
// Global theme
umbra({
  background: '#ffffff',
  foreground: '#000000'
}).apply()

// Component-specific theme
umbra({
  background: '#f8f9fa',
  foreground: '#212529'
}).apply({ target: '.sidebar' })
```

### Custom Formatters

```typescript
// Different output formats
const theme = umbra({ background: '#fff', foreground: '#000' })

theme.format('hex')    // #ffffff, #000000
theme.format('rgb')    // rgb(255,255,255), rgb(0,0,0)
theme.format('hsl')    // hsl(0,0%,100%), hsl(0,0%,0%)
```

### Tailwind CSS Integration

UmbraJS works seamlessly with Tailwind CSS v4's simplified color system. No special formatters needed!

```typescript
import { umbra } from '@umbrajs/core'

// Create theme
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#3b82f6', '#ef4444']
})

// Apply as CSS variables (works directly with Tailwind v4)
theme.apply()
```

**Tailwind v4 Config Setup:**

```javascript
// tailwind.config.js
export default {
  theme: {
    colors: {
      // UmbraJS CSS variables work directly in Tailwind v4
      base: {
        background: 'var(--base)',
        10: 'var(--base-10)',
        20: 'var(--base-20)',
        30: 'var(--base-30)',
        40: 'var(--base-40)',
        50: 'var(--base-50)',
        60: 'var(--base-60)',
        70: 'var(--base-70)',
        80: 'var(--base-80)',
        90: 'var(--base-90)',
        100: 'var(--base-100)',
        110: 'var(--base-110)',
        120: 'var(--base-120)',
        contrast: 'var(--base-contrast)',
      },
      accent: {
        background: 'var(--accent)',
        10: 'var(--accent-10)',
        20: 'var(--accent-20)',
        30: 'var(--accent-30)',
        40: 'var(--accent-40)',
        50: 'var(--accent-50)',
        60: 'var(--accent-60)',
        70: 'var(--accent-70)',
        80: 'var(--accent-80)',
        90: 'var(--accent-90)',
        100: 'var(--accent-100)',
        110: 'var(--accent-110)',
        120: 'var(--accent-120)',
        contrast: 'var(--accent-contrast)',
      }
    }
  }
}
```

**Usage in Templates:**

```html
<!-- Direct usage with Tailwind v4 -->
<div class="bg-base-10 text-base-foreground">
  <button class="bg-accent text-accent-foreground hover:bg-accent-10">
    Click me
  </button>
</div>

<!-- Opacity utilities work automatically -->
<div class="bg-base/90 text-accent/80">
  Semi-transparent elements
</div>
```

**Dynamic Theme Switching:**

```typescript
// Light theme
const lightTheme = umbra({
  background: '#ffffff',
  foreground: '#1f2937',
  accents: ['#3b82f6']
})

// Dark theme  
const darkTheme = lightTheme.inverse()

// Apply themes to different scopes
lightTheme.apply() // Global light theme
darkTheme.apply({ target: '.dark' }) // Dark theme for .dark elements
```

> **Note for Tailwind v3 users:** If you're still using Tailwind CSS v3, you'll need to configure your colors to reference the CSS variables manually. Tailwind v4 handles this automatically.

### Programmatic Access

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#007acc']
})

// Access generated colors
const formatted = theme.format()
console.log(formatted.colors) // Array of FormatedRange objects

// Check if theme is dark
if (theme.isDark()) {
  console.log('Dark theme detected')
}

// Get raw color data
console.log(theme.output) // UmbraRange[] - raw color objects
console.log(theme.input)  // UmbraInput - original input
```

## 🧩 Utility Functions

UmbraJS exports additional utility functions for advanced use cases:

### Color Utilities

```typescript
import { 
  getReadability, 
  mostReadable, 
  colorMix,
  isDark,
  findContrast
} from '@umbrajs/core'

// Check APCA readability score
const score = getReadability('#ffffff', '#000000')
console.log(score) // 107

// Find most readable color from options
const readable = mostReadable('#ffffff', ['#ff0000', '#00ff00', '#0000ff'])
console.log(readable) // Best contrast color

// Mix two colors
const mixed = colorMix('#ff0000', '#0000ff', 0.5)
console.log(mixed) // Mid-point color

// Check if color is dark
console.log(isDark('#000000')) // true
console.log(isDark('#ffffff')) // false

// Find high contrast color
const contrast = findContrast('#888888')
console.log(contrast) // High contrast color
```

### Theme Generation

```typescript
import { umbraGenerate, randomScheme } from '@umbrajs/core'

// Generate random theme
const random = randomScheme()
console.log(random) // { background: '...', foreground: '...', accents: [...] }

// Low-level theme generation
const ranges = umbraGenerate(inputScheme, adjustedColors)
console.log(ranges) // UmbraRange[] - raw color ranges
```

### Custom Formatting

```typescript
import { format } from '@umbrajs/core'

// Format color ranges with custom formatter
const formatted = format({
  output: colorRanges,
  input: originalInput,
  formater: (color) => color.toHex() // Custom formatter function
})
```

```typescript
import { umbra } from '@umbrajs/core'
import { useEffect, useState } from 'react'

function useTheme(initialTheme) {
  const [theme, setTheme] = useState(() => umbra(initialTheme))
  
  useEffect(() => {
    theme.apply()
  }, [theme])
  
  const updateTheme = (newTheme) => {
    setTheme(umbra(newTheme))
  }
  
  const toggleDarkMode = () => {
    setTheme(current => current.inverse())
  }
  
  return {
    theme,
    updateTheme,
    toggleDarkMode,
    isDark: theme.isDark()
  }
}
```

### Vue Composable Example

```typescript
import { umbra } from '@umbrajs/core'
import { ref, watch } from 'vue'

export function useUmbra(initialTheme) {
  const currentTheme = ref(umbra(initialTheme))
  
  watch(currentTheme, (theme) => {
    theme.apply()
  }, { immediate: true })
  
  const setTheme = (newTheme) => {
    currentTheme.value = umbra(newTheme)
  }
  
  const toggleDarkMode = () => {
    currentTheme.value = currentTheme.value.inverse()
  }
  
  return {
    theme: currentTheme,
    setTheme,
    toggleDarkMode,
    isDark: computed(() => currentTheme.value.isDark())
  }
}
```

## 🔧 TypeScript Support

UmbraJS is written in TypeScript and provides full type safety:

```typescript
import type { 
  UmbraInput, 
  UmbraSettings, 
  Accent,
  UmbraOutputs,
  FormatedRange 
} from '@umbrajs/core'

// Fully typed configuration
const config: UmbraInput = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    '#007acc',
    {
      name: 'danger',
      color: '#ff6b6b',
      readability: 7
    }
  ] as Accent[],
  settings: {
    readability: 7,
    // Using default 12-shade system (can be customized)
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25]
  } as UmbraSettings
}

// Type-safe theme usage
const theme = umbra(config)
const output: UmbraOutputs = theme.apply()
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/UmbraJS/core/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT © [Samuel M. Bednarz](https://github.com/CarelessCourage)

---

**[Documentation](https://umbrajs.org)** • **[Examples](https://umbrax.netlify.app/)** • **[GitHub](https://github.com/UmbraJS/core)**
