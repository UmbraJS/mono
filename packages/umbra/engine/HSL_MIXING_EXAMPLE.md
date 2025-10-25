# Independent HSL Channel Interpolation

## Overview

The Umbra color scale generator now supports independent control over hue, saturation, and lightness interpolation. This allows you to create non-linear progressions for each color channel separately.

## Usage

Instead of using a simple number for the mix value, you can now use an object with independent channel controls:

### Basic Example

```typescript
// Old way - single mix percentage
const shade = { mix: 50 }

// New way - independent channel control
const shade = {
  mix: 50,           // Base mix (used as fallback if channel not specified)
  saturation: 70,    // Saturation mixes at 70% while other channels use 50%
  lightness: 30,     // Lightness mixes at 30%
  hue: 50            // Hue mixes at 50% (explicitly set)
}
```

### Real-World Example

```typescript
// Create a color scale where:
// - Saturation ramps up quickly early on (to show more color hints)
// - Lightness progresses steadily
// - Hue stays closer to the starting color initially

const shades = [
  0,    // Start color (0% mix)
  { mix: 20, saturation: 40 },  // At 20% mix, saturation is already at 40%
  { mix: 40, saturation: 60 },  // Non-linear saturation progression
  { mix: 60, saturation: 75 },
  { mix: 80, saturation: 90 },
  100   // End color (100% mix)
]
```

### Advanced Example - All Channels Independent

```typescript
const shades = [
  '#000000',  // Start with pure black
  {
    mix: 25,        // Default fallback
    hue: 10,        // Hue changes slowly
    saturation: 50, // Saturation ramps up quickly
    lightness: 25   // Lightness matches the base mix
  },
  {
    mix: 50,
    hue: 30,
    saturation: 80,
    lightness: 50
  },
  {
    mix: 75,
    hue: 60,
    saturation: 95,
    lightness: 75
  },
  '#0066ff'   // End with a vibrant blue
]
```

## How It Works

The system interpolates between colors in HSL color space:

1. **Hue (0-360°)**: Handles circular interpolation, taking the shorter path around the color wheel
2. **Saturation (0-100%)**: Linear interpolation between saturation values
3. **Lightness (0-100%)**: Linear interpolation between lightness values

Each channel can have its own interpolation percentage, allowing for complete control over the color progression.

## Migration from Old System

If you were using `{ mix: number, saturation: number }` format, the new system is slightly different:

**Old approach** (trying to modify after mixing):
```typescript
// ❌ This didn't work - colors were already saturated
{ mix: 50, saturation: 400 }  // Attempted to saturate the mixed color
```

**New approach** (independent interpolation):
```typescript
// ✅ This works - controls how saturation interpolates
{ mix: 50, saturation: 80 }  // At 50% mix overall, saturation is 80% to target
```

## Benefits

1. **More Perceptual Control**: HSL is more intuitive for designers
2. **Independent Curves**: Each channel can have its own easing
3. **Better Color Progression**: Create scales that better match human perception
4. **Flexible**: Use simple numbers for basic mixing, objects for advanced control

## Example Use Case

Creating a blue accent scale where you want:
- Subtle blue hints early (fast saturation ramp)
- Smooth lightness progression
- Controlled hue shift

```typescript
const blueAccentShades = [
  0,
  { mix: 15, saturation: 35, lightness: 15 },  // Quick saturation, slow lightness
  { mix: 30, saturation: 55, lightness: 30 },
  { mix: 50, saturation: 75, lightness: 50 },
  { mix: 70, saturation: 90, lightness: 70 },
  100
]
```

This gives you a scale where the blue color becomes visible earlier in the progression while maintaining smooth lightness transitions.
