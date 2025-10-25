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
