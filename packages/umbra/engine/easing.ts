export type EasingFunction = (t: number) => number

export const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
} as const

export type EasingType = keyof typeof easingFunctions

export interface EasingOptions {
  easing?: EasingType
  count?: number
  min?: number
  max?: number
}

// Generate tints/shades array using easing function
export function generateTints(options: EasingOptions = {}): number[] {
  const {
    easing = 'linear',
    count = 12,
    min = 0,
    max = 100
  } = options

  const easingFn = easingFunctions[easing]
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1) // normalize to 0-1
    const easedValue = easingFn(t)
    // Map the eased value from 0-1 to min-max range
    const scaledValue = min + (easedValue * (max - min))
    return Math.round(scaledValue)
  })
}

// Relative value: "+=40" (add 40%) or "-=40" (subtract 40%)
export type RelativeValue = `+=${number}` | `-=${number}`

// Hue reference: "next" (use hue from next color stop) or "prev" (use hue from previous color stop)
// Can also include relative adjustments: "next+=20", "next-=10", "prev+=15", "prev-=5"
export type HueReference = 'next' | 'prev' | `next+=${number}` | `next-=${number}` | `prev+=${number}` | `prev-=${number}`

// Primer keyword: "primer" (placeholder for the accent color)
export type PrimerKeyword = 'primer'

export interface HSLInterpolation {
  mix: number | RelativeValue           // Base mix percentage (0-100) or relative
  hue?: number | RelativeValue | HueReference  // Independent hue mix percentage or reference
  saturation?: number | RelativeValue  // Independent saturation mix percentage
  lightness?: number | RelativeValue   // Independent lightness mix percentage
}

export type UmbraShade = number | string | HSLInterpolation | PrimerKeyword

// Type for flexible tints/shades input
export type TintsInput =
  | UmbraShade[]  // Original array format
  | readonly UmbraShade[]  // Readonly array format (for presets)
  | EasingType           // Simple easing string
  | EasingOptions        // Full easing options object

// Convert any TintsInput to (number | string) array with fallback support
export function resolveTints(input?: TintsInput, fallback?: TintsInput, defaultValue?: TintsInput): UmbraShade[] {
  // Priority: input -> fallback -> defaultValue
  const actualInput = input ?? fallback ?? defaultValue

  if (!actualInput) return []

  if (Array.isArray(actualInput)) {
    // Original array format (both mutable and readonly) - keep strings as-is, convert numeric strings to numbers
    return actualInput.map(v => {
      if (typeof v === 'string') {
        // If it looks like a color (starts with # or named color), keep as string
        if (v.startsWith('#') || isNaN(parseInt(v, 10))) {
          return v
        }
        // Otherwise convert to number
        return parseInt(v, 10)
      }
      return v
    })
  }

  if (typeof actualInput === 'string') {
    // Simple easing string
    return generateTints({ easing: actualInput })
  }

  // EasingOptions object (not an array, not a string)
  return generateTints(actualInput as EasingOptions)
}
