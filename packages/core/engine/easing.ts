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
  | EasingOptions        // Full easing options object

// Convert any TintsInput to number array
export function resolveTints(input?: TintsInput, defaultValue?: TintsInput): number[] {
  // If no input provided, use default value
  const actualInput = input ?? defaultValue

  if (!actualInput) return []

  if (Array.isArray(actualInput)) {
    // Original array format - convert strings to numbers
    return actualInput.map(v => typeof v === 'string' ? parseInt(v, 10) : v)
  }

  if (typeof actualInput === 'string') {
    // Simple easing string
    return generateTints({ easing: actualInput })
  }

  // EasingOptions object
  return generateTints(actualInput)
}
