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
