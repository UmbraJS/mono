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

// Type for flexible tints/shades input
export type TintsInput =
  | (number | string)[]  // Original array format
  | EasingType           // Simple easing string
  | EasingOptions        // Full easing options object// Convert any TintsInput to (number | string) array with fallback support
export function resolveTints(input?: TintsInput, fallback?: TintsInput, defaultValue?: TintsInput): (number | string)[] {
  // Priority: input -> fallback -> defaultValue
  const actualInput = input ?? fallback ?? defaultValue

  if (!actualInput) return []

  if (Array.isArray(actualInput)) {
    // Original array format - keep strings as-is, convert numeric strings to numbers
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

  // EasingOptions object
  return generateTints(actualInput)
}
