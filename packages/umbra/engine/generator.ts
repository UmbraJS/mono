import { swatch } from '../swatch'
import type { UmbraSwatch } from '../swatch'
import type { UmbraAdjusted, UmbraScheme, Accent } from './types'
import { pickContrast, colorMix, colorMixHSL } from './primitives/color'
import { insertColorIntoRange, getStrings } from './primitives/utils'
import { resolveTints, type TintsInput, type UmbraShade } from './easing'
import { defaultSettings } from './defaults'
import { resolveColorPreset } from './presets'

// Constants
const RELATIVE_VALUE_PATTERN = /^[+-]=\d+(?:\.\d+)?$/
const MIN_POSITION = 0
const MAX_POSITION = 100
const DEFAULT_ACCENT_NAME = 'accent'

// Type guards
function isRelativeValueString(shade: UmbraShade): shade is string {
  return typeof shade === 'string' && RELATIVE_VALUE_PATTERN.test(shade)
}

function isColorString(shade: UmbraShade): shade is string {
  return typeof shade === 'string' && !RELATIVE_VALUE_PATTERN.test(shade) && shade !== 'primer'
}

/**
 * Parses a relative value string (e.g., "+=10" or "-=5") and updates the position
 * @param relativeValue - String in format "+=X" or "-=X"
 * @param currentPosition - Current position (0-100)
 * @returns Updated position clamped between MIN_POSITION and MAX_POSITION
 */
function parseRelativePosition(relativeValue: string, currentPosition: number): number {
  const match = relativeValue.match(/^([+-])=(\d+(?:\.\d+)?)$/)
  if (!match) return currentPosition

  const [, operator, amount] = match
  const delta = parseFloat(amount)

  if (operator === '+') {
    return Math.min(MAX_POSITION, currentPosition + delta)
  } else {
    return Math.max(MIN_POSITION, currentPosition - delta)
  }
}

/**
 * Resolves hue references ('next' or 'prev') to actual hue mix percentages
 * Supports relative adjustments like 'next+=12' or 'prev-=10'
 * @param hueValue - Hue value which can be a number, string, 'next', 'prev', or 'next±X'/'prev±X'
 * @param index - Current index in the range
 * @param colorStopIndices - Array of indices where color stops occur
 * @param colorStopColors - Array of color swatches at those indices
 * @param fromColor - The starting color for this mix
 * @param toColor - The ending color for this mix
 * @param from - The background color (global start)
 * @param to - The foreground color (global end)
 * @returns Resolved hue value (percentage 0-100 or relative string)
 */
function resolveHueReference(
  hueValue: number | string | 'next' | 'prev' | undefined,
  index: number,
  colorStopIndices: number[],
  colorStopColors: UmbraSwatch[],
  fromColor: UmbraSwatch,
  toColor: UmbraSwatch,
  globalFrom: UmbraSwatch,
  globalTo: UmbraSwatch
): number | string | undefined {
  // Handle relative adjustments to hue references like 'next+=12' or 'prev-=10'
  if (typeof hueValue === 'string') {
    const relativeMatch = hueValue.match(/^(next|prev)([+-]=)(\d+(?:\.\d+)?)$/)
    if (relativeMatch) {
      const [, reference, operator, amount] = relativeMatch
      const adjustment = parseFloat(amount)
      const delta = operator === '+=' ? adjustment : -adjustment

      // Get the base hue from next or prev
      let baseHue: number
      if (reference === 'next') {
        const nextStopIndex = colorStopIndices.find(i => i > index)
        if (nextStopIndex !== undefined) {
          const nextStopColor = colorStopColors[colorStopIndices.indexOf(nextStopIndex)]
          baseHue = nextStopColor.toHsl().h
        } else {
          baseHue = globalTo.toHsl().h
        }
      } else { // 'prev'
        const prevStopIndices = colorStopIndices.filter(i => i < index)
        if (prevStopIndices.length > 0) {
          const prevStopIndex = prevStopIndices[prevStopIndices.length - 1]
          const prevStopColor = colorStopColors[colorStopIndices.indexOf(prevStopIndex)]
          baseHue = prevStopColor.toHsl().h
        } else {
          baseHue = globalFrom.toHsl().h
        }
      }

      // Calculate the target hue (base + adjustment)
      let targetHue = (baseHue + delta) % 360
      if (targetHue < 0) targetHue += 360

      // Calculate what percentage would produce this hue
      const fromHsl = fromColor.toHsl()
      const toHsl = toColor.toHsl()

      // If there's no significant hue difference between from and to,
      // we need to treat it specially - use the target hue as the destination
      if (Math.abs(toHsl.h - fromHsl.h) < 1) {
        // Replace the destination hue with our target
        toHsl.h = targetHue
      }

      // Use the same circular interpolation logic as colorMixHSL
      let hueDiff = toHsl.h - fromHsl.h
      let adjustedTarget = targetHue

      // colorMixHSL takes the shorter path
      if (Math.abs(hueDiff) > 180) {
        // Will wrap around
        const adjustedDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360
        hueDiff = adjustedDiff

        // Adjust target to match the same circular direction
        // Find the equivalent angle on the wrapped path
        if (targetHue > fromHsl.h + 180) {
          adjustedTarget = targetHue - 360
        } else if (targetHue < fromHsl.h - 180) {
          adjustedTarget = targetHue + 360
        }
      }

      // Now calculate the percentage
      const hueMixPercent = ((adjustedTarget - fromHsl.h) / hueDiff) * 100

      // Return the percentage (can be outside 0-100 for extrapolation)
      return hueMixPercent
    }
  }

  if (hueValue === 'next') {
    const nextStopIndex = colorStopIndices.find(i => i > index)
    let targetHue: number
    if (nextStopIndex !== undefined) {
      const nextStopColor = colorStopColors[colorStopIndices.indexOf(nextStopIndex)]
      targetHue = nextStopColor.toHsl().h
    } else {
      targetHue = globalTo.toHsl().h
    }

    const fromHsl = fromColor.toHsl()
    const toHsl = toColor.toHsl()

    if (Math.abs(toHsl.h - fromHsl.h) < 1) {
      toHsl.h = targetHue
    }

    // Use the same circular interpolation logic as colorMixHSL
    let hueDiff = toHsl.h - fromHsl.h
    let adjustedTarget = targetHue

    if (Math.abs(hueDiff) > 180) {
      const adjustedDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360
      hueDiff = adjustedDiff

      if (targetHue > fromHsl.h + 180) {
        adjustedTarget = targetHue - 360
      } else if (targetHue < fromHsl.h - 180) {
        adjustedTarget = targetHue + 360
      }
    }

    const hueMixPercent = ((adjustedTarget - fromHsl.h) / hueDiff) * 100
    return hueMixPercent
  }

  if (hueValue === 'prev') {
    const prevStopIndices = colorStopIndices.filter(i => i < index)
    let targetHue: number
    if (prevStopIndices.length > 0) {
      const prevStopIndex = prevStopIndices[prevStopIndices.length - 1]
      const prevStopColor = colorStopColors[colorStopIndices.indexOf(prevStopIndex)]
      targetHue = prevStopColor.toHsl().h
    } else {
      targetHue = globalFrom.toHsl().h
    }

    const fromHsl = fromColor.toHsl()
    const toHsl = toColor.toHsl()

    if (Math.abs(toHsl.h - fromHsl.h) < 1) {
      toHsl.h = targetHue
    }

    // Use the same circular interpolation logic as colorMixHSL
    let hueDiff = toHsl.h - fromHsl.h
    let adjustedTarget = targetHue

    if (Math.abs(hueDiff) > 180) {
      const adjustedDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360
      hueDiff = adjustedDiff

      if (targetHue > fromHsl.h + 180) {
        adjustedTarget = targetHue - 360
      } else if (targetHue < fromHsl.h - 180) {
        adjustedTarget = targetHue + 360
      }
    }

    const hueMixPercent = ((adjustedTarget - fromHsl.h) / hueDiff) * 100
    return hueMixPercent
  }

  return hueValue
}

interface GetRange {
  from: UmbraSwatch
  to: UmbraSwatch
  range: UmbraShade[]
  accentColor?: string  // Optional accent color to replace "primer" keyword
}

/**
 * Generates a color range by interpolating between start and end colors
 * Supports color stops, relative positioning, and HSL adjustments
 * @param params - Configuration object containing from/to colors, range definition, and optional accent color
 * @returns Array of interpolated color swatches
 */
function getRange({ from, to, range, accentColor }: GetRange): UmbraSwatch[] {
  // Replace "primer" keyword with accent color if provided
  const processedRange = range.map(shade => {
    if (shade === 'primer' && accentColor) {
      return accentColor
    }
    return shade
  })

  const stringColorStops = getStrings(processedRange)

  // Pre-scan to find all color stop indices and their colors
  const colorStopIndices: number[] = []
  const colorStopColors: UmbraSwatch[] = []
  processedRange.forEach((shade, index) => {
    if (isColorString(shade)) {
      colorStopIndices.push(index)
      colorStopColors.push(swatch(shade))
    }
  })

  // Track current absolute position (0-100%) for relative calculations
  let currentPosition = 0

  // Track the last color we generated (starts at 'from')
  let lastColor = from

  // Track the last color STOP (for absolute mixing)
  let lastColorStop = from

  // Determine the next color stop (starts with first stop or 'to' if no stops)
  let nextColor = stringColorStops.length > 0 ? swatch(stringColorStops[0]) : to

  return processedRange.map((shade, index) => {
    // Handle relative value strings (+=X or -=X)
    if (isRelativeValueString(shade)) {
      currentPosition = parseRelativePosition(shade, currentPosition)
      const interpolatedColor = colorMix(lastColor, nextColor, currentPosition)
      lastColor = interpolatedColor
      return interpolatedColor
    }

    // Handle color stop strings (hex, named color, etc.)
    if (isColorString(shade)) {
      const color = swatch(shade)
      lastColor = color
      lastColorStop = color  // Update the last color stop
      stringColorStops.shift()
      // Update nextColor to the next stop or 'to' if no more stops
      nextColor = stringColorStops.length > 0 ? swatch(stringColorStops[0]) : to
      // Reset position for the next segment
      currentPosition = 0
      return color
    }

    // Handle HSL interpolation objects
    if (typeof shade === 'object') {
      // Update current position based on mix value
      const mixValue = shade.mix
      const isRelative = typeof mixValue === 'string'

      if (typeof mixValue === 'number') {
        currentPosition = mixValue
      } else if (typeof mixValue === 'string') {
        currentPosition = parseRelativePosition(mixValue, currentPosition)
      }

      // For absolute values, use last color STOP; for relative, use last color
      const fromColor = isRelative ? lastColor : lastColorStop

      // Resolve hue references ('next' or 'prev') - use the same reference as mixing
      const resolvedHue = resolveHueReference(
        shade.hue,
        index,
        colorStopIndices,
        colorStopColors,
        fromColor,
        nextColor,
        from,
        to
      )

      // Build interpolation options
      const options = {
        mix: currentPosition,
        hue: resolvedHue,
        saturation: shade.saturation,
        lightness: shade.lightness,
      }

      const interpolatedColor = colorMixHSL(fromColor, nextColor, options)
      lastColor = interpolatedColor
      return interpolatedColor
    }

    // Handle simple numeric values (absolute position)
    currentPosition = shade as number
    const interpolatedColor = colorMix(lastColorStop, nextColor, currentPosition)
    lastColor = interpolatedColor
    return interpolatedColor
  })
}

interface RangeProps {
  input: UmbraScheme
  adjusted: UmbraAdjusted
  range: UmbraShade[]
  color?: string
}

/**
 * Automatically places a color in the optimal position within a range
 * Uses contrast analysis to find the best insertion point
 * @param params - Configuration object with input scheme, adjusted colors, range, and color to insert
 * @returns Updated range with color inserted at optimal position, or original range if no color provided
 */
function autoPlacedRange({ input, adjusted, range, color }: RangeProps) {
  if (!color) return range
  const baseRange = getRange({
    from: adjusted.background,
    to: adjusted.foreground,
    range: rangeValues(adjusted, input.settings)
  })
  return insertColorIntoRange({ range, shades: baseRange, color: swatch(color) })
}

/**
 * Creates a new array with a value replaced at a specific index
 * @param array - Source array
 * @param index - Index to replace at
 * @param value - New value to insert
 * @returns New array with replaced value
 */
function replaceAtIndex(array: UmbraShade[], index: number, value: string) {
  const newArray = array.slice()
  newArray[index] = value
  return newArray
}

/**
 * Determines the appropriate range for an accent color
 * Handles both string and object accent definitions
 * Supports manual positioning via "primary" keyword or automatic insertion
 * Uses color presets when available for optimal tints/shades
 * @param adjusted - Adjusted color values
 * @param accent - Accent color definition (string or object with properties)
 * @param input - Input scheme with settings
 * @returns Range array with accent color appropriately positioned
 */
function putAccentInRange(adjusted: UmbraAdjusted, accent: Accent | string, input: UmbraScheme) {
  const isString = typeof accent === 'string'
  const color = isString ? accent : accent.color
  const insertion = input.settings?.insertion

  // If accent has explicit tints/shades, use those
  const hasExplicitRange = !isString && (accent.tints || accent.shades || accent.range)

  // If no explicit range and we have a color, try to use preset
  let range: UmbraShade[]
  if (!hasExplicitRange && color) {
    const { preset } = resolveColorPreset(color)
    const isDark = adjusted.background.isDark()
    const presetRange = isDark ? preset.shades : preset.tints

    // Use preset range as the base
    range = resolveTints(presetRange)
  } else {
    // Use explicit range or fallback to settings
    const fallback = accentRangeValues(adjusted, input.settings, true) // Filter strings for settings fallback
    range = isString ? fallback : accentRangeValues(adjusted, accent, false) || fallback // Don't filter for accent's own properties
  }

  // If range contains "primer" keyword, skip auto-insertion since user explicitly positioned it
  const hasPrimerKeyword = range.some(shade => shade === 'primer')
  if (hasPrimerKeyword) return range

  if (insertion && color) return replaceAtIndex(range, insertion, color)
  if (!insertion && color) return autoPlacedRange({ input, adjusted, range, color })
  return range
}

/**
 * Generates accent color palettes
 * Each accent gets its own range interpolated between background and foreground
 * Resolves color preset names to their hex values
 * @param input - Input color scheme
 * @param adjusted - Adjusted color values
 * @returns Array of accent palette objects with name, colors, and ranges
 */
function accents(input: UmbraScheme, adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent) => {
    const isString = typeof accent === 'string'
    const name = isString ? undefined : accent.name
    let color = isString ? accent : accent.color

    // Resolve color preset names to hex values
    if (color) {
      const { hex } = resolveColorPreset(color)
      color = hex
    }

    const range = putAccentInRange(adjusted, accent, input)
    return {
      name: name || DEFAULT_ACCENT_NAME,
      background: pickContrast(adjusted.foreground, adjusted),
      foreground: pickContrast(adjusted.background, adjusted),
      range: getRange({
        from: adjusted.background,
        to: adjusted.foreground,
        range,
        accentColor: color  // Pass accent color to replace "primer" keyword
      })
    }
  })
}

interface RangeValues {
  range?: TintsInput     // Fallback for both shades and tints
  shades?: TintsInput
  tints?: TintsInput
}

/**
 * Resolves the appropriate range values based on theme mode (dark/light)
 * Uses shades for dark themes and tints for light themes
 * @param adjusted - Adjusted color values (determines if theme is dark)
 * @param scheme - Optional scheme with range/shades/tints configuration
 * @returns Resolved shade array
 */
function rangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues): UmbraShade[] {
  const isDark = adjusted.background.isDark()
  const tintsInput = isDark ? scheme?.shades : scheme?.tints
  const rangeInput = scheme?.range  // Fallback to range property
  const defaultInput = isDark ? defaultSettings.shades : defaultSettings.tints
  return resolveTints(tintsInput, rangeInput, defaultInput)
}

/**
 * Checks if a TintsInput contains color string values
 * Excludes "primer" keyword and relative value patterns
 * @param input - Tints input to check
 * @returns True if input contains color strings
 */
function containsStrings(input?: TintsInput): boolean {
  if (!input) return false
  if (!Array.isArray(input)) return false
  // Check for color strings, but exclude "primer" keyword which is allowed
  return input.some(v => typeof v === 'string' && v !== 'primer' && !RELATIVE_VALUE_PATTERN.test(v))
}

/**
 * Resolves range values for accent colors with optional string filtering
 * Similar to rangeValues but can filter out color strings for fallback safety
 * @param adjusted - Adjusted color values
 * @param scheme - Optional scheme with range/shades/tints configuration
 * @param filterStrings - If true, exclude ranges containing color strings
 * @returns Resolved shade array
 */
function accentRangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues, filterStrings: boolean = false): UmbraShade[] {
  const isDark = adjusted.background.isDark()
  const tintsInput = isDark ? scheme?.shades : scheme?.tints
  const rangeInput = scheme?.range  // Fallback to range property
  const defaultInput = isDark ? defaultSettings.shades : defaultSettings.tints

  if (filterStrings) {
    // Only use tintsInput and rangeInput as fallbacks if they don't contain strings
    const safeTintsInput = containsStrings(tintsInput) ? undefined : tintsInput
    const safeRangeInput = containsStrings(rangeInput) ? undefined : rangeInput
    return resolveTints(safeTintsInput, safeRangeInput, defaultInput)
  }

  return resolveTints(tintsInput, rangeInput, defaultInput)
}

/**
 * Generates the base color palette
 * Creates the fundamental color range between background and foreground
 * @param input - Input color scheme
 * @param adjusted - Adjusted color values
 * @returns Base palette object with name, background, foreground, and range
 */
function base(input: UmbraScheme, adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted
  const range = rangeValues(adjusted, input.settings)
  return {
    name: 'base',
    background,
    foreground,
    range: getRange({ from: background, to: foreground, range })
  }
}

/**
 * Generates a complete Umbra color scheme
 * Creates base palette plus all accent palettes
 * @param input - Input color scheme configuration
 * @param adjusted - Adjusted and normalized color values
 * @returns Array of palette objects (base + accents)
 */
export function umbraGenerate(input: UmbraScheme, adjusted: UmbraAdjusted) {
  return [base(input, adjusted), ...accents(input, adjusted)]
}
