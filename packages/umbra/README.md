# UmbraJS Core

> **Modern theme management for the web**

A flexible, type-safe theme management library that creates semantic color systems based on the Umbra pattern - focusing on color relationships rather than specific element styling.

## ✨ Features

- **🎯 Simple** - Single function call to generate complete theme systems
- **🎨 Color Presets** - Built-in optimized presets for common colors (use 'tomato' instead of '#E54D2E')
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

// Or use color names with optimized presets
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['tomato', 'blue', 'green']  // Use preset names instead of hex
}).apply();
```

**🎨 New: Color Presets** - UmbraJS now includes optimized presets for common colors. Just use color names like `'tomato'`, `'blue'`, or `'green'` instead of hex values to get perfectly tuned color scales. [Learn more about color presets →](COLOR_PRESETS.md)

Generated CSS variables:
```css
:root {
  // The base range logic for the whole theme
  --base: #0c0915; // Base background color stop
  --base-10: #201c26; 
  --base-20: #484349; 
  --base-30: #524f56; 
  --base-40: #615e64; 
  --base-50: #6e6c70; 
  --base-60: #8d8d8d; 
  --base-70: #ababa8; 
  --base-80: #bdbdb8; 
  --base-90: #cacbc4; 
  --base-100: #d4d6cd; 
  --base-110: #e1e3da; 
  --base-120: #eef0e7; 
  --base-text: #d5c9c1; // Base foreground color stop

  // The accent range logic based on the base range
  --accent: #9999ff; // Original accent color - maintained to be exactly what the user provided
  // base background stop -> accent color stop -> base foreground stop
  // The real accent starting color is the background stop for the base range not the accent
  --accent-10: #1b1828;
  --accent-20: #201d31;
  --accent-30: #25223a;
  --accent-40: #2a2743; 
  --accent-50: #39365c;
  --accent-60: #423f6b; 
  --accent-70: #4a4779;
  --accent-80: #5d5a99; 
  --accent-90: #6e6cb7; 
  --accent-100: #9999ff; // Original accent color fit best into this part of the range so we put the accent here as a color stop
  --accent-110: #b2affb; 
  --accent-120: #c3c0f7; 
  --accent-text: #d5c9c1; // the same as the base foreground color stop
}
```

Use in your CSS:
```css
.card {
  background: var(--base-10);
  color: var(--base-text);
  border: 1px solid var(--accent-20);
}
```
> **💡 Tailwind CSS v4 Users:** CSS variables work directly in Tailwind v4! [See Tailwind setup guide →](#tailwind-css-integration)


## 🌟 Why UmbraJS?
Let me take you through the same journey i went through - that lead me to make UmbraJS. 

## 📖 API Reference

### Core Function

The `umbra()` function returns a theme object with these methods:

#### Understanding the Pipeline

UmbraJS theme generation follows a 3-step pipeline:

1. **🎨 Generate**: Create color ranges and calculate optimal shades
2. **📝 Format**: Convert colors to your preferred format (hex, rgb, hsl, etc.)
3. **🔗 Attach**: Attach the formatted colors to the DOM as CSS variables

```typescript
const theme = umbra({ background: '#0c0915' }) // Create theme

// Manual pipeline control
const formatted = theme.format('hex')     // Step 2: Format colors
const applied = formatted.attach()             // Step 3: Attach to DOM

// Or use the shortcut (recommended)
theme.apply() // Combines format() + attach() automatically
```

The best way to get a quick sense of how these steps work together and what they provide you is to just log put each step and inspect the output:

```typescript
  const theme = umbra()
  console.log('Umbra:', {
    generated: theme,
    formated: theme.format(),
    attached: theme.format().attach({}),
  })
```


#### `theme.apply(options?)`
Applies the theme to the DOM by setting CSS variables.

```typescript
const theme = umbra({ background: '#0c0915' }) // Create dark theme

// Apply to document root (default)
theme.apply()

// Apply to specific element
theme.apply({ target: document.querySelector('.my-component') })

// Use custom formatter for CSS variables
theme.apply({ 
  formatter: (color) => color.toHex() // Control output format
})
```

#### `theme.inverse()`
Creates an inverted version of the theme (useful for dark/light mode toggling).

```typescript
const darkTheme = theme.inverse()
darkTheme.apply({ target: '.dark-mode' })
```

**How inversion works:** UmbraJS switches the background and foreground color stops and changes from the shade color mixing range to the tint color mixing range. It remembers the original theme for consistent reverting.

**Custom inversion control:** You can define exactly what the inversed theme should be:

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

#### `theme.format(formatter?)`
The format function decides what the final format of the colors should be, rgb, hex, hsl, etc. 

```typescript
const formatted = theme.format('hex')
console.log(formatted.colors) // Array of formatted color ranges

// Custom formatter function
const customFormatted = theme.format((color) => color.toRgb())
console.log(customFormatted.colors) // RGB formatted ranges
```

The format function also returns a few usefull arrays and objects though. Lets have a quick look.



```typescript
const formatted = theme.format()

console.log(formatted.colors) // Array of FormatedRange objects

// logs
{
  input: {} // Original input theme
  output: [] // This is what the generator itself passed to the formatter - which is a list of all the ranges and their colors but every color is a UmbraSwatch object - not a string
  formated: [], // This is the same exact list as the output except the colors are formatted as strings according to the formatter picked
  flattened: [] // This is a flattened list of all colors across all ranges, umbra uses this list in the attach step to easily iterate over all the colors and apply them. But you can also easily use this list to iterate over all the colors regardless of the range they belong to.
  attach: [Function: attach], // the final step, to attach the colors to the DOM as CSS variables
}

// Example of the formated output
[
    {
        "name": "base",
        "background": "#090233",
        "shades": [
            "#140f39",
            "#20163f",
            "#2b1c44",
            "#352249",
            "#513558",
            "#614061",
            "#704a69",
            "#92627b",
            "#b2798b",
            "#c58794",
            "#d3919b",
            "#de99a0"
        ],
        "foreground": "#ffb1b1"
    },
    {
        "name": "accent",
        "background": "#ffffff",
        "shades": [
            "#12123c",
            "#1e1b45",
            "#28244d",
            "#322d55",
            "#4e486d",
            "#5e587b",
            "#6d6787",
            "#908ba4",
            "#b0acbf",
            "#ffffff",
            "#ffeceb",
            "#ffdddc"
        ],
        "foreground": "#ffb1b1"
    },
]

// Example of the flattened output: 

[
    {
        "name": "--base",
        "color": "#090233"
    },
    {
        "name": "--base-10",
        "color": "#140f39"
    },
    {
        "name": "--base-20",
        "color": "#20163f"
    },
    {
        "name": "--base-30",
        "color": "#2b1c44"
    },
    {
        "name": "--base-40",
        "color": "#352249"
    },
    {
        "name": "--base-50",
        "color": "#513558"
    },
    {
        "name": "--base-60",
        "color": "#614061"
    },
    {
        "name": "--base-70",
        "color": "#704a69"
    },
    {
        "name": "--base-80",
        "color": "#92627b"
    },
    {
        "name": "--base-90",
        "color": "#b2798b"
    },
    {
        "name": "--base-100",
        "color": "#c58794"
    },
    {
        "name": "--base-110",
        "color": "#d3919b"
    },
    {
        "name": "--base-120",
        "color": "#de99a0"
    },
    {
        "name": "--base-text",
        "color": "#ffb1b1"
    },
    {
        "name": "--accent",
        "color": "#ffffff"
    },
    {
        "name": "--accent-10",
        "color": "#12123c"
    },
    {
        "name": "--accent-20",
        "color": "#1e1b45"
    },
    {
        "name": "--accent-30",
        "color": "#28244d"
    },
    {
        "name": "--accent-40",
        "color": "#322d55"
    },
    {
        "name": "--accent-50",
        "color": "#4e486d"
    },
    {
        "name": "--accent-60",
        "color": "#5e587b"
    },
    {
        "name": "--accent-70",
        "color": "#6d6787"
    },
    {
        "name": "--accent-80",
        "color": "#908ba4"
    },
    {
        "name": "--accent-90",
        "color": "#b0acbf"
    },
    {
        "name": "--accent-100",
        "color": "#ffffff"
    },
    {
        "name": "--accent-110",
        "color": "#ffeceb"
    },
    {
        "name": "--accent-120",
        "color": "#ffdddc"
    },
    {
        "name": "--accent-text",
        "color": "#ffb1b1"
    },
]
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

**Example of providing multiple theme options to the user:**
These themes could be used in a theme switcher component, allowing users to choose their preferred style.
```typescript
const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

const linearTheme: UmbraInput = {
  foreground: '#f3f6ea',
  background: '#16121f',
  accents: ['#9999ff', warningAccent, successAccent],
}

const retro60sTheme: UmbraInput = {
  foreground: '#16121f',
  background: '#eaeef6ff',
  accents: ['#a77a1aff', warningAccent, successAccent],
}

const vintageTheme: UmbraInput = {
  foreground: '#16121f',
  background: '#f3f6ea',
  accents: ['#99ffb3ff', warningAccent, successAccent],
}

<button onClick={() => umbra(linearTheme).apply()}>Linear Theme</button>
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
    // Therefore shades and tints are separated out. Tints to describe the colors moving from a light stop towards a dark stop (light mode). 
    // And shades to describe the colors moving from a dark stop towards a light stop (dark mode).
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25], 
    tints: [5, 10, 10, 10, 15, 15, 25, 15, 15, 15, 15, 25]
  }
})
```

**Example 2: Manual accent placement**

This example shows how you can control exactly where the accent color appears in the range. This demonstrates why the base range has 2 color stops and 12 shades, while accent ranges have 3 color stops (the same 2 from the base range, plus the accent color placed between them).

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primer',
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, '#007acc', 25, 25],
  }],
})
```

**Example 3: Automatic accent placement**

When you don't specify the exact placement, UmbraJS finds the optimal position between the two color stops that best aligns with your accent color, maximizing the available shade space.

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primer',
    color: '#007acc',
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25],
  }],
})
```

**Example 4: Multiple color stops**

You can add as many color stops as needed within your shade array:

```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    name: 'primer',
    shades: [5, 5, 5, 5, 15, '#007acc', 10, 25, 30, '#0066aa', 25, 25],
  }],
})
```

### Settings

```typescript
interface UmbraSettings {
  readability?: number     // Target APCA readability score (default: 70)
  iterations?: number      // Color adjustment iterations (default: 20)
  shades?: (number | string)[]  // Darker shade percentages (default: 12 shades)
  tints?: (number | string)[]   // Lighter tint percentages (default: 12 tints)
  formatter?: Formatter      // Output format ('hex', 'rgb', 'hsl')
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
    readability: 75  // Higher score = better contrast (APCA Lc value)
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

## 🎨 Understanding Color Ranges

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
- `--success-text` (optimal contrast color)

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
    // It's recommended to name your accents if you have multiple
    { name: 'primer', color: '#3b82f6' },
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


# 📚 Methodology

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
| 11 | Low-text text | `--base-110` |
| 12 | High-text text | `--base-120` |

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

**🎯 Consistency**: Whether you generate colors automatically or use predefined Radix scales, you get the same API and variable naming

**🔄 Flexibility**: Mix and match generated colors with carefully crafted Radix colors as needed

**📐 Standards-based**: Built on proven color theory and extensive usability testing

**♿ Accessibility**: Both generated and Radix colors maintain proper contrast relationships

**🛠️ Developer Experience**: Single system to learn, consistent tooling across your entire project

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
| **Lc 90** | Body text, reading content | High-text text variables |
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

**Learn more:** [APCA Documentation](https://git.apcacontrast.com/documentation/APCAeasyIntro) | [The Realities And Myths Of Contrast And Color](https://www.smashingmagazine.com/2022/09/realities-myths-text-color/)

## 🌈 Advanced Usage

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
        contrast: 'var(--base-text)',
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
        contrast: 'var(--accent-text)',
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
  formatter: (color) => color.toHex() // Custom formatter function
})

// Available format options
const theme = umbra({ background: '#fff', foreground: '#000' })

theme.format('hex')    // #ffffff, #000000
theme.format('rgb')    // rgb(255,255,255), rgb(0,0,0)
theme.format('hsl')    // hsl(0,0%,100%), hsl(0,0%,0%)

// Custom formatter functions
theme.format((color) => color.toOklch()) // Modern OKLCH format
theme.format((color) => `hsl(${color.hue} ${color.saturation}% ${color.lightness}%)`) // Custom string
```

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

### Framework Integration Examples

#### React Hook Example

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

// Usage in component
function App() {
  const { theme, updateTheme, toggleDarkMode, isDark } = useTheme({
    background: '#ffffff',
    foreground: '#000000',
    accents: ['#3b82f6']
  })
  
  return (
    <div>
      <button onClick={toggleDarkMode}>
        Switch to {isDark ? 'light' : 'dark'} mode
      </button>
      <button onClick={() => updateTheme({ 
        background: '#1a1a1a', 
        foreground: '#ffffff',
        accents: ['#ef4444'] 
      })}>
        Apply red accent theme
      </button>
    </div>
  )
}
```

#### Vue Composable Example

```typescript
import { umbra } from '@umbrajs/core'
import { ref, watch, computed } from 'vue'

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

// Usage in component
export default {
  setup() {
    const { theme, setTheme, toggleDarkMode, isDark } = useUmbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: ['#3b82f6']
    })
    
    return {
      theme,
      setTheme,
      toggleDarkMode,
      isDark
    }
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

# Color Presets Quick Reference

## Available Colors

```
tomato  #E54D2E  (red)
blue    #0090FF  (azure, sky)
green   #30A46C  (emerald, grass)
purple  #8E4EC6  (violet, lavender)
orange  #F76B15  (amber)
yellow  #FFE629  (gold)
pink    #E93D82  (rose, crimson)
cyan    #00A2C7  (teal, aqua)
indigo  #3E63DD
lime    #BDEE63
brown   #AD7F58  (bronze)
gray    #8B8D98  (grey, slate)
```

## Basic Usage

```typescript
import { umbra } from '@umbrajs/core'

// Use color names
umbra({
  accents: ['tomato', 'blue', 'green']
}).apply()

// Use aliases
umbra({
  accents: ['red', 'sky', 'emerald']
}).apply()

// Mix names and hex
umbra({
  accents: ['blue', '#FF00FF']
}).apply()
```

## API Functions

```typescript
import { 
  colorPresets,        // Array of all presets
  getPresetByName,     // Get by name/alias
  findClosestPreset,   // Match hex to preset
  resolveColorPreset   // Resolve any color
} from '@umbrajs/core'

// Get preset
const blue = getPresetByName('blue')
// → { name: 'blue', hex: '#0090FF', ... }

// Find closest
const closest = findClosestPreset('#0095FF')
// → blue preset

// Resolve
const { hex, preset } = resolveColorPreset('tomato')
// → { hex: '#E54D2E', preset: tomato }
```

## Override Presets

```typescript
umbra({
  accents: [
    'blue',              // Use preset
    {
      color: 'tomato',   // Use preset color
      tints: [...]       // Custom tints
    }
  ]
})
```

## Benefits

- ✅ **1 line** instead of 20+
- ✅ **Optimized** for each color
- ✅ **Readable** code
- ✅ **Consistent** quality
- ✅ **Flexible** overrides

# Independent HSL Channel Interpolation with Absolute & Relative Values

## Overview

The Umbra color scale generator now supports:
1. **Independent control over hue, saturation, and lightness** interpolation
2. **Absolute values** (like keyframes): `40` = 40% from start to target
3. **Relative values** (incremental): `"+=40"` = add 40% from current position, `"-=40"` = subtract 40%

This allows you to create complex, non-linear color progressions with precise control.

## Basic Concepts

### Absolute Mode (Default)
Numbers represent the absolute position from start (0%) to target (100%):

```typescript
const shades = [0, 25, 50, 75, 100]
// Each value is the exact percentage from start to end
```

### Relative Mode
Strings with `+=` or `-=` modify the current position:

```typescript
const shades = [20, "+=20", "+=20", "+=20"]
// 20%, then 40%, then 60%, then 80%
```

### Uniform Spacing with Relative Values
```typescript
const shades = [10, "+=10", "+=10", "+=10", "+=10"]
// Creates evenly spaced steps: 10%, 20%, 30%, 40%, 50%
```

## Usage

### Simple Number Values (Absolute)

```typescript
// Creates a scale at specific positions
const shades = [10, 20, 30, 40, 50]
```

### Relative Values

```typescript
// Incremental progression
const shades = [20, "+=20", "+=20", "+=20", "+=20"]
// Results in: 20%, 40%, 60%, 80%, 100%

// Going backwards
const shades = [40, "+=30", "-=20", "+=40"]
// Results in: 40%, 70%, 50%, 90%
```

### Mixed Absolute and Relative

```typescript
const shades = [
  10,        // Absolute: 10%
  "+=15",    // Relative: 10 + 15 = 25%
  "+=15",    // Relative: 25 + 15 = 40%
  70,        // Absolute: jump to 70%
  "+=10"     // Relative: 70 + 10 = 80%
]
```

### Object Syntax with Independent Channels

```typescript
const shades = [
  0,
  { mix: 20, saturation: 40 },  // mix at 20%, saturation at 40%
  { mix: 40, saturation: 60 },  // non-linear saturation
  { mix: 60, saturation: 80 },
  100
]
```

### Relative Values in Object Syntax

```typescript
const shades = [
  { mix: 20 },                        // Absolute: 20%
  { mix: "+=20", saturation: "+=30" }, // mix to 40%, saturation boosted by 30%
  { mix: "+=20", saturation: "+=20" }, // mix to 60%, saturation to 90%
  { mix: 50, hue: 70 },               // mix absolute to 50%, hue absolute to 70%
  100
]
```

## Real-World Examples

### Example 1: Early Color Hints with Boosted Saturation

```typescript
// Make colors visible early by ramping saturation faster than lightness
const shades = [
  0,
  { mix: 15, saturation: 35 },  // Quick saturation boost
  { mix: 30, saturation: 55 },  // Continues faster
  { mix: 50, saturation: 75 },  // Leveling off
  { mix: 70 },                  // Back to linear
  100
]
```

### Example 2: Smooth Gradient with Relative Steps

```typescript
// Create uniform spacing without calculating percentages
const shades = [
  5,
  "+=8",
  "+=8", 
  "+=8",
  "+=8",
  "+=8",
  "+=8",
  "+=8",
  "+=8"
]
// Results in: 5%, 13%, 21%, 29%, 37%, 45%, 53%, 61%, 69%
```

### Example 3: Complex Multi-Channel Control

```typescript
const shades = [
  '#1a1a1a',  // Dark start
  {
    mix: 20,
    hue: 10,         // Hue shifts slowly (10% to target)
    saturation: 40,  // Saturation ramps quickly (40% to target)
    lightness: 20    // Lightness steady with mix
  },
  {
    mix: "+=20",      // Relative: now at 40%
    saturation: "+=25" // Saturation gets extra boost to 65%
  },
  {
    mix: 70,          // Jump to 70%
    hue: "+=20",      // Hue catches up
    saturation: 90    // Saturation near complete
  },
  '#3b82f6'   // Vibrant blue end
]
```

### Example 4: Backwards Movement for Color Variation

```typescript
const shades = [
  30,
  "+=25",    // 55%
  "+=20",    // 75%
  "-=15",    // 60% - go back for variation
  "+=30",    // 90%
  100
]
```

## How It Works

### Position Tracking
The generator tracks the current absolute position (0-100%) as it processes each shade:

- **Numbers** set the position directly
- **Relative strings** (`"+=X"`, `"-=X"`) modify the current position
- **Objects** can use either absolute or relative values for `mix` and individual channels

### Channel Interpolation
Each HSL channel interpolates independently from start to target:

1. **Hue (0-360°)**: Circular interpolation (shortest path around color wheel)
2. **Saturation (0-100%)**: Linear interpolation with clamping
3. **Lightness (0-100%)**: Linear interpolation with clamping

### Relative Calculations

For the base `mix`:
```typescript
// Absolute
{ mix: 50 }  // Position = 50%

// Relative
{ mix: "+=20" }  // Position = currentPosition + 20
{ mix: "-=10" }  // Position = currentPosition - 10
```

For individual channels (when using objects):
```typescript
{
  mix: 30,           // Base at 30%
  saturation: "+=20" // Saturation at 50% (30 + 20)
}
```

## Benefits

1. **Expressive**: Describe exactly how you want colors to progress
2. **Flexible**: Mix absolute and relative values as needed
3. **Intuitive**: Relative values are great for uniform spacing
4. **Powerful**: Independent channel control for perceptual tuning
5. **Concise**: `[10, "+=10", "+=10", "+=10"]` vs `[10, 20, 30, 40]`

## Migration Notes

### Old Approach
```typescript
// This never worked properly:
{ mix: 50, saturation: 400 }  // Tried to saturate after mixing
```

### New Approach
```typescript
// Independent channel interpolation:
{ mix: 50, saturation: 80 }  // Saturation at 80% to target

// Or with relative values:
{ mix: "+=20", saturation: "+=30" }  // Both relative to current
```

# Umbra Color System - Design Guide

This document explains the key concepts, patterns, and best practices for working with Umbra's color generation system.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Tints vs Shades (Light vs Dark Themes)](#tints-vs-shades-light-vs-dark-themes)
3. [Color Architecture](#color-architecture)
4. [HSL Interpolation System](#hsl-interpolation-system)
5. [Value Types & Syntax](#value-types--syntax)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)
8. [Reverse-Engineering Radix UI](#reverse-engineering-radix-ui)

---

## Core Concepts

### Background and Foreground

- **Background**: The lightest color in the scale (typically white `#ffffff`)
- **Foreground**: The darkest color in the scale (typically black `#000000`)
- **Important**: These are NOT part of the generated `tints` array
- They are separate endpoints shared across all accents
- Think of them as the canvas boundaries

```typescript
{
  background: '#ffffff',  // Pure white (shared)
  foreground: '#000000',  // Pure black (shared)
  accents: [/* your color configs */]
}
```

### Tints Array Structure

The `tints` array generates 12 colors between background and foreground:

```
Background (#ffffff)
  ↓
[0] ← First generated color (tints[0])
[1]
[2]
...
[11] ← Last generated color (tints[11])
  ↓
Foreground (#000000)
```

**Total colors visible**: 14 (background + 12 generated + foreground)

---

## Tints vs Shades (Light vs Dark Themes)

### Theme Detection

Umbra automatically detects whether you're using a light or dark theme based on the **background color**:

- **Light theme**: Background is light (e.g., `#ffffff`)
- **Dark theme**: Background is dark (e.g., `#000000`)

### Why Two Separate Configurations?

The color progression might need to be **different** for light vs dark themes, even for the same accent color.

```typescript
{
  name: 'primary',
  tints: [/* Config for light themes */],
  shades: [/* Config for dark themes */]
}
```

**Both properties use the same types** (numbers, color stops, HSL objects, etc.)

### How Umbra Chooses

```
If background is light:
  → Use `tints` configuration
  
If background is dark:
  → Use `shades` configuration
```

### Real-World Example

```typescript
{
  name: 'primary',
  
  // Light theme (white background)
  tints: [
    { mix: 1, hue: "next", saturation: "+=99" },
    { mix: 2, hue: "next", saturation: "+=99" },
    5, 8, 12, 17, 24, 35,
    "#0090ff",  // Accent
    { mix: "+=5", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=25", hue: 0, saturation: "-=29" }
  ],
  
  // Dark theme (black background)
  shades: [
    { mix: 1, hue: "prev", saturation: "+=80" },
    { mix: 3, hue: "prev", saturation: "+=70" },
    8, 15, 22, 30, 40, 50,
    "#0090ff",  // Same accent
    { mix: "+=8", hue: 0, saturation: "-=10" },
    { mix: "+=15", hue: 0, saturation: "-=20" },
    { mix: "+=30", hue: 0, saturation: "-=35" }
  ]
}
```

### Why Different Progressions?

1. **Perceptual differences**: Colors appear different on dark vs light backgrounds
2. **Contrast needs**: Dark themes might need stronger contrast steps
3. **Saturation behavior**: Saturation shifts look different against dark vs light
4. **Design intent**: You might want different "feel" in dark mode

### Global Settings

You can also define default tints/shades in `settings`:

```typescript
{
  background: '#ffffff',
  foreground: '#000000',
  accents: [/* your accents */],
  settings: {
    tints: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70],   // Light theme default
    shades: [0.5, 2, 5, 8, 12, 18, 25, 35, 50, 65, 80, 92] // Dark theme default
  }
}
```

These are used by accents that don't specify their own `tints`/`shades`.

### Switching Themes

When you change the background color, Umbra automatically switches:

```typescript
// Light theme
{ background: '#ffffff', foreground: '#000000' }  // Uses `tints`

// Dark theme  
{ background: '#000000', foreground: '#ffffff' }  // Uses `shades`
```

**Note**: The foreground typically inverts too (black→white or white→black)

---

## Color Architecture

### Accent vs Settings

```typescript
// Accent-specific colors (like primary blue)
accents: [
  {
    name: 'primary',
    tints: [/* blue-specific config for light theme */],
    shades: [/* blue-specific config for dark theme */]
  }
]

// Global default colors (used when accent doesn't specify tints/shades)
settings: {
  tints: [/* default light theme config */],
  shades: [/* default dark theme config */]
}
```

### Neutral Colors Should Be Shared

For neutral grays, use pure white/black endpoints:

```typescript
{
  background: '#ffffff',  // ✅ Pure white (not tinted)
  foreground: '#000000',  // ✅ Pure black (not tinted)
}
```

**NOT** Radix's tinted endpoints:
```typescript
{
  background: '#fcfcfc',  // ❌ Slightly tinted (Radix-specific)
  foreground: '#111111',  // ❌ Slightly gray (Radix-specific)
}
```

**Why**: Neutral grays should work across all color accents (blue, red, green, etc.)

---

## HSL Interpolation System

### Independent Channel Control

Umbra uses `colorMixHSL()` which allows **independent non-linear progression** for each HSL channel:

```typescript
{
  mix: 50,           // Base interpolation position (0-100%)
  hue: 10,           // Hue adjustment (0-360°)
  saturation: 80,    // Saturation override (0-100%)
  lightness: 45      // Lightness override (0-100%)
}
```

### Why This Matters

Standard color mixing interpolates all channels together. Umbra lets you:
- Change lightness smoothly while keeping hue constant
- Boost saturation independently
- Shift hue without affecting lightness

**Example**: Darkening a blue while preserving its "blueness"
```typescript
"#0090ff",  // Bright blue
{ mix: "+=5", hue: 0, saturation: "-=4" }  // Darker, but still blue (hue stays at ~206°)
```

---

## Value Types & Syntax

### 1. Numeric Values (0-100)

Represents **mix percentage** between current position and target:

```typescript
[1, 2, 5, 8, 12]  // Simple progression
```

- `1` = 1% of the way from background → foreground
- `50` = halfway
- `100` = at the foreground

### 2. Color Stops (Hex Strings)

Explicit color values that become fixed points:

```typescript
["#fbfdff", 5, 8, "#0090ff", 60]
//   ↑ Stop 1      ↑ Stop 2
```

**Color stop behavior**:
- Interpolation happens **between consecutive stops**
- Previous example: `5` mixes between `#fbfdff` → `#0090ff`
- NOT between background → foreground globally

### 3. Relative Values (Strings)

Adjust from current position:

```typescript
{ mix: "+=10" }   // Move 10% forward from current position
{ mix: "-=5" }    // Move 5% backward
```

```typescript
{ saturation: "+=20" }  // Boost saturation by 20%
{ hue: "-=10" }         // Shift hue 10° backward
```

### 4. Absolute Overrides (Numbers in Objects)

Set exact channel values:

```typescript
{ hue: 0 }           // Preserve current hue (no change)
{ saturation: 100 }  // Force saturation to 100%
{ lightness: 50 }    // Set lightness to exactly 50%
```

### 5. Hue References (NEW)

Dynamically reference other color stops:

```typescript
{ mix: 2, hue: "next" }   // Use hue from next color stop
{ mix: 60, hue: "prev" }  // Use hue from previous color stop
```

**How it works**:
1. Pre-scans the array to find all color stops
2. Calculates hue difference between current position and referenced stop
3. Applies that hue while mixing

**Example**:
```typescript
[
  { mix: 1, hue: "next" },  // Inherits hue from #0090ff
  { mix: 2, hue: "next" },  // Also uses #0090ff's hue
  5, 8, 12,
  "#0090ff",                 // The referenced color (h:206°)
  { mix: "+=5", hue: 0 }
]
```

---

## Best Practices

### 1. Use `hue: 0` to Preserve Color Character

When darkening/lightening colors, prevent hue shift:

```typescript
"#0090ff",  // Blue at h:206°
{ mix: "+=10", hue: 0 }  // ✅ Stays at 206° (still blue)
{ mix: "+=10" }          // ❌ Might shift toward purple
```

### 2. Don't Hardcode What Can Be Dynamic

**Before** (hardcoded):
```typescript
["#fbfdff", "#f4faff", 5, 8, "#0090ff"]
```

**After** (dynamic):
```typescript
[
  { mix: 1, hue: "next", saturation: "+=99" },
  { mix: 2, hue: "next", saturation: "+=99" },
  5, 8, "#0090ff"
]
```

### 3. Manual Tuning for Exact Matches

When reverse-engineering existing scales (like Radix UI):

**Don't**: Try to find a smooth mathematical curve
```typescript
[0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]  // ❌ 17.83% avg error
```

**Do**: Manually tune each value individually
```typescript
[0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]  // ✅ 0.08% avg error
```

**Why**: Handpicked color scales (like Radix) have irregular jumps based on design intent, not smooth progressions.

### 4. Testing Workflow

Create test files to validate configurations:

```typescript
// engine/test-my-feature.ts
import { umbraGenerate } from './generator'
import { swatch } from '../swatch'

const scheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: { tints: [/* test config */] }
}

const result = umbraGenerate(scheme, createAdjusted(scheme))[0].range
result.forEach((color, i) => {
  console.log(`${i}: ${color.toHex()} - ${color.toHsl().l.toFixed(1)}%`)
})
```

Run with: `pnpm tsx engine/test-my-feature.ts`

---

## Common Patterns

### Pattern 1: Pure Neutral Gray

No color stops, just smooth progression. Same config can work for both themes:

```typescript
{
  name: 'gray',
  tints: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70],   // Light theme
  shades: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]   // Dark theme (same)
}
```

Or rely on settings:
```typescript
settings: {
  tints: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70],
  shades: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]
}
```

### Pattern 2: Colored Scale with Dynamic Hue

Early colors inherit hue from main accent. May differ between light/dark:

```typescript
{
  name: 'primary',
  
  // Light theme (white → black)
  tints: [
    { mix: 1, hue: "next", saturation: "+=99" },  // Light blue
    { mix: 2, hue: "next", saturation: "+=99" },  // Still blue
    5, 8, 12, 17, 24, 35,
    "#0090ff",  // Main accent (h:206°)
    { mix: "+=5", hue: 0, saturation: "-=4" },    // Dark blue
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=25", hue: 0, saturation: "-=29" }
  ],
  
  // Dark theme (black → white)
  shades: [
    { mix: 2, hue: "next", saturation: "+=80" },
    { mix: 4, hue: "next", saturation: "+=70" },
    8, 15, 22, 30, 40, 50,
    "#0090ff",  // Same accent
    { mix: "+=8", hue: 0, saturation: "-=10" },
    { mix: "+=18", hue: 0, saturation: "-=25" },
    { mix: "+=35", hue: 0, saturation: "-=40" }
  ]
}
```

### Pattern 3: Multi-Stop Gradient

Multiple color stops for complex transitions:

```typescript
{
  tints: [
    "#e0f2ff",  // Light blue
    5, 10, 15,
    "#0090ff",  // Mid blue
    20, 25,
    "#003d82",  // Dark blue
    10
  ]
}
```

---

## Reverse-Engineering Radix UI

### Understanding Radix Color Scales

Radix UI uses **handpicked** color scales with specific design intent:

```
Radix Blue Lightness Progression:
99% → 98% → 94% → 91% → 88% → 85% → 81% → 73% → 50% → 45% → 32% → 23%
  1%    4%    3%    3%    3%    4%    8%   23%   5%   13%   9%
```

**Key insight**: The jumps are irregular (1%, 4%, 8%, 23%!) - this is intentional, not a smooth curve.

### Approach

1. **Analyze the target scale** first
   ```typescript
   const radixColors = ['#fbfdff', '#f4faff', /* ... */]
   radixColors.forEach(c => {
     const { h, s, l } = swatch(c).toHsl()
     console.log(`h:${h}° s:${s}% l:${l}%`)
   })
   ```

2. **Try algorithmic matching** (for initial approximation)
   ```typescript
   [0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]  // ~17% error
   ```

3. **Manual fine-tuning** (for exact match)
   - Adjust each value individually
   - Check lightness difference after each change
   - Focus on the values with largest errors first

4. **Validate with tests**
   ```typescript
   const diff = Math.abs(generated.l - radix.l)
   console.log(`Diff: ${diff.toFixed(2)}%`)
   ```

### Example: Radix Gray Match

**Initial attempt** (smooth curve): 17.83% avg error
```typescript
[0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]
```

**Manual tuning**: 0.08% avg error ✅
```typescript
[0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]
```

Notice:
- Multiple consecutive `3` values (positions 3-6)
- Large jump `23` at position 8
- Smaller jump `7` at position 9
- Another `23` at position 10
- These match Radix's design decisions

---

## Implementation Notes

### Type Definitions

Located in `engine/easing.ts`:

```typescript
export type RelativeValue = `+=${number}` | `-=${number}`
export type HueReference = 'next' | 'prev'

export interface HSLInterpolation {
  mix: number | RelativeValue
  hue?: number | RelativeValue | HueReference
  saturation?: number | RelativeValue
  lightness?: number | RelativeValue
}

export type UmbraShade = 
  | number 
  | string 
  | HSLInterpolation
```

### Generator Logic

Located in `engine/generator.ts`:

1. **Pre-scans** the array to find color stops
2. **Resolves** hue references (`"next"`, `"prev"`)
3. **Interpolates** between consecutive stops
4. **Applies** HSL overrides per-channel

### Color Mixing

Located in `engine/primitives/color.ts`:

```typescript
colorMixHSL(from, to, {
  mix: 50,
  hue: 0,           // Preserve current hue
  saturation: 80,   // Override saturation
  lightness: 45     // Override lightness
})
```

---

## Common Confusion Points

### ❌ "Tints are just for light colors"

**Wrong**: "Tints" refers to the light theme configuration, not light colors specifically.

**Correct**: 
- `tints` = configuration used when background is light
- `shades` = configuration used when background is dark
- Both can contain any color values

### ❌ "Foreground and background are part of tints"

**Wrong**: They are separate endpoints
```typescript
tints: ["#ffffff", 1, 2, /* ... */, "#000000"]  // ❌
```

**Correct**: They're in the schema root
```typescript
{
  background: '#ffffff',
  foreground: '#000000',
  accents: [{ tints: [1, 2, /* ... */] }]
}
```

### ❌ "saturate() should boost saturation"

If a color is already at 100% saturation, `saturate(400)` does nothing.

**Solution**: Use independent HSL control:
```typescript
{ saturation: "+=20" }  // Relative boost
{ saturation: 100 }     // Absolute override
```

### ❌ "hue: 10 means preserve hue"

**Wrong**: `hue: 10` sets hue to 10° (greenish)

**Correct**: Use `hue: 0` to mean "no change from current stop"
```typescript
{ mix: 50, hue: 0 }  // ✅ Keep current hue
```

### ❌ "Smooth curves work for all color scales"

Only works if the scale was mathematically generated. Radix UI and other design systems use handpicked values with irregular jumps.

**Solution**: Manual per-value tuning for exact matches.

---

## Quick Reference

| Goal | Solution |
|------|----------|
| Light theme config | Use `tints` property |
| Dark theme config | Use `shades` property |
| Preserve hue when darkening | `{ mix: X, hue: 0 }` |
| Inherit hue from accent color | `{ mix: X, hue: "next" }` |
| Boost saturation | `{ saturation: "+=20" }` |
| Set exact saturation | `{ saturation: 100 }` |
| Move forward from current position | `{ mix: "+=10" }` |
| Pure neutral gray | Numeric values only, no color stops |
| Colored scale | Use color stops + `hue: 0` or `hue: "next"` |
| Exact Radix match | Manual tuning of each value |
| Same config for both themes | Set both `tints` and `shades` to same array |

---

## Testing Commands

```bash
# Run a test file
pnpm tsx engine/test-my-feature.ts

# Build the package
pnpm build

# Run all tests
pnpm test
```

---

## Version History

- **v0.0.456**: Added `hue: "next"` and `hue: "prev"` support
- **Earlier**: HSL interpolation, relative values, color stops

---

*Last updated: October 26, 2025*

# 🎨 Color Presets Feature - Complete Summary

## What Was Implemented

A comprehensive color preset system for the Umbra library that makes it dramatically easier to create beautiful, optimized color themes.

## The Problem You Had

Before this implementation:
1. You had to manually define 12 tints and 12 shades values for each accent color
2. Finding the optimal values required lots of trial and error
3. Each color needed different tuning for best results
4. Code was verbose and hard to maintain
5. No easy way to reuse configurations across projects

## The Solution

Now you can:
1. **Use color names** instead of hex values: `'tomato'` instead of `'#E54D2E'`
2. **Get optimized results automatically** - each preset has hand-tuned tints/shades
3. **Use intuitive aliases** - `'red'` for `'tomato'`, `'sky'` for `'blue'`, etc.
4. **Auto-match custom colors** - any hex color finds its closest preset
5. **Write less code** - 1 word instead of 20+ lines of configuration

## Quick Examples

### Before (Manual)
```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    color: '#0090FF',
    tints: [
      { mix: 1, hue: "next", saturation: "+=99" },
      { mix: 2, hue: "next", saturation: "+=99" },
      5, 8, 12, 17, 24, 35,
      'primer',
      { mix: "+=5", hue: 0, saturation: "-=4" },
      { mix: "+=7", hue: 0, saturation: "-=8" },
      { mix: "+=9", hue: 0, saturation: "-=12" }
    ]
  }]
})
```

### After (Presets)
```typescript
const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue']
})
```

## Available Presets

12 carefully optimized presets:

| Color | Hex | Aliases |
|-------|-----|---------|
| tomato | #E54D2E | red |
| blue | #0090FF | azure, sky |
| green | #30A46C | emerald, grass |
| purple | #8E4EC6 | violet, lavender |
| orange | #F76B15 | amber |
| yellow | #FFE629 | gold |
| pink | #E93D82 | rose, crimson |
| cyan | #00A2C7 | teal, aqua |
| indigo | #3E63DD | - |
| lime | #BDEE63 | - |
| brown | #AD7F58 | bronze |
| gray | #8B8D98 | grey, slate |

## Key Features

### 1. Color Names
```typescript
umbra({ accents: ['tomato', 'blue', 'green'] })
```

### 2. Aliases
```typescript
umbra({ accents: ['red', 'sky', 'emerald'] })
```

### 3. Auto-Matching
```typescript
umbra({ accents: ['#E64D2E'] })  // Matches tomato preset
```

### 4. Override Support
```typescript
umbra({
  accents: [{
    color: 'blue',
    tints: [/* custom */]  // Override when needed
  }]
})
```

### 5. Theme-Aware
- Light background → uses `tints`
- Dark background → uses `shades`

## API

### Functions

```typescript
// Get preset by name or alias
getPresetByName('tomato') → ColorPreset

// Find closest matching preset
findClosestPreset('#E64D2E') → ColorPreset

// Resolve color (name or hex) to preset
resolveColorPreset('blue') → { hex, preset }
resolveColorPreset('#0090FF') → { hex, preset }

// Access all presets
colorPresets → ColorPreset[]
```

### Types

```typescript
interface ColorPreset {
  name: string
  hex: string
  tints: TintsInput
  shades: TintsInput
  aliases?: string[]
}
```

## Files Created

1. **`engine/presets.ts`** - Core implementation (360 lines)
2. **`COLOR_PRESETS.md`** - User documentation
3. **`PRESET_IMPLEMENTATION.md`** - Technical documentation
4. **`engine/test-presets.ts`** - Comprehensive test suite
5. **`engine/example-presets.ts`** - Usage examples
6. **`engine/comparison-presets.ts`** - Before/after comparison

## Files Modified

1. **`engine/generator.ts`** - Auto-apply presets when no custom tints/shades
2. **`index.ts`** - Export preset functions and types
3. **`README.md`** - Updated with preset feature

## How It Works Internally

### Color Resolution Flow

```
User Input: 'tomato' or '#E64D2E'
    ↓
Is it a preset name/alias?
    ↓
    Yes → Use exact preset
    No  → Calculate RGB distance to all presets
    ↓
Found closest preset
    ↓
Is background dark?
    ↓
    Yes → Use preset.shades
    No  → Use preset.tints
    ↓
Generate color range
```

### Distance Algorithm

Uses weighted RGB distance for perceptual accuracy:
```typescript
distance = √(2×ΔR² + 4×ΔG² + 3×ΔB²)
```

## Benefits

✅ **95% less code** for common colors
✅ **Zero tuning required** for standard use cases
✅ **Consistent quality** across all colors
✅ **Faster development** - just pick a name
✅ **Better readability** - `'tomato'` vs `'#E54D2E'`
✅ **Backward compatible** - all existing code works
✅ **Type-safe** - full TypeScript support
✅ **Flexible** - can still override when needed

## Testing

All tests pass successfully:

```bash
# Run preset tests
npx tsx packages/umbra/engine/test-presets.ts

# Run examples
npx tsx packages/umbra/engine/example-presets.ts

# Run comparison
npx tsx packages/umbra/engine/comparison-presets.ts
```

## Real-World Impact

**Before:** Creating a 3-color theme = ~100 lines of configuration
**After:** Creating a 3-color theme = 1 line

**Before:** Tuning a new color = hours of trial and error
**After:** Using a preset = instant, optimal results

**Before:** Maintaining themes = updating dozens of values
**After:** Maintaining themes = changing color names

## Next Steps

Now you can:

1. ✅ Use color names in your themes
2. ✅ Create themes faster with less code
3. ✅ Get consistent, optimized results
4. ✅ Share color configurations easily
5. ✅ Build on top of proven presets

## Documentation

- **User Guide:** [COLOR_PRESETS.md](COLOR_PRESETS.md)
- **Implementation:** [PRESET_IMPLEMENTATION.md](PRESET_IMPLEMENTATION.md)
- **Main README:** [README.md](README.md)

## Usage in Your Projects

Import and use immediately:

```typescript
import { umbra, colorPresets } from '@umbrajs/core'

// Simple usage
const theme = umbra({
  accents: ['tomato', 'blue', 'green']
}).apply()

// List available presets
console.log(colorPresets.map(p => p.name))

// Get preset info
import { getPresetByName } from '@umbrajs/core'
const blue = getPresetByName('blue')
```

---

**🎉 The feature is complete and ready to use!**

You now have a powerful, flexible color preset system that makes theme creation dramatically easier while maintaining full control when you need it.


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/UmbraJS/core/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT © [Samuel M. Bednarz](https://github.com/CarelessCourage)

---

**[Documentation](https://umbrajs.org)** • **[Examples](https://umbrax.netlify.app/)** • **[GitHub](https://github.com/UmbraJS/core)**
