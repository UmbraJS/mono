import { swatch } from '../swatch'
import type { UmbraSwatch } from '../swatch'
import type { UmbraAdjusted, UmbraScheme, Accent, ValidationWarning, UmbraColour } from './types'
import { pickContrast, colorMix, colorMixHSL, getReadability } from './primitives/color'
import { insertColorIntoRange, getStrings } from './primitives/utils'
import { resolveTints, type TintsInput, type UmbraShade } from './easing'
import { defaultSettings } from './defaults'
import { resolveColorPreset } from './presets'

// Constants
const RELATIVE_VALUE_PATTERN = /^[+-]=\d+(?:\.\d+)?$/
const MIN_POSITION = 0
const MAX_POSITION = 100
const DEFAULT_ACCENT_NAME = 'accent'

/**
 * Determines which visual section a color belongs to based on its position
 * @param index - Position in the range (0-based)
 * @param totalLength - Total number of colors in the range
 * @returns Section classification
 */
function getColorSection(index: number, totalLength: number): 'background' | 'middleground' | 'foreground' {
  const position = index / (totalLength - 1)
  if (position < 0.33) return 'background'
  if (position > 0.67) return 'foreground'
  return 'middleground'
}

/**
 * Determines the type of color based on its input
 * @param input - The original input value
 * @returns Color type classification
 */
function getColorType(input: UmbraShade | 'background' | 'foreground'): 'foreground' | 'background' | 'primer' | 'shade' {
  if (input === 'foreground') return 'foreground'
  if (input === 'background') return 'background'

  // If input is a color string (not a number, not HSL object, not relative pattern, not "primer")
  if (typeof input === 'string' && input !== 'primer' && !RELATIVE_VALUE_PATTERN.test(input)) {
    return 'primer'
  }

  return 'shade'
}

/**
 * Creates an enriched color object with metadata
 * @param params - Configuration object
 * @returns UmbraColour with full metadata
 */
function createEnrichedColor(params: {
  swatch: UmbraSwatch
  input: UmbraShade | 'background' | 'foreground'
  index: number
  totalLength: number
  previousColor?: UmbraSwatch
  lastSectionColor?: UmbraSwatch
}): UmbraColour {
  const { swatch: colorSwatch, input, index, totalLength, previousColor, lastSectionColor } = params

  return {
    type: getColorType(input),
    index,
    input,
    section: getColorSection(index, totalLength),
    swatch: colorSwatch,
    contrasts: {
      previousColour: previousColor ? getReadability(colorSwatch, previousColor) : undefined,
      previousSection: lastSectionColor ? getReadability(colorSwatch, lastSectionColor) : undefined
    }
  }
}

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
 * Internal version that returns both swatches and their corresponding inputs
 */
function getRangeWithInputs({ from, to, range, accentColor }: GetRange): Array<{ swatch: UmbraSwatch, input: UmbraShade }> {
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
    // Store the original input for tracking
    const originalInput = range[index]

    // Handle relative value strings (+=X or -=X)
    if (isRelativeValueString(shade)) {
      currentPosition = parseRelativePosition(shade, currentPosition)
      const interpolatedColor = colorMix(lastColor, nextColor, currentPosition)
      lastColor = interpolatedColor
      return { swatch: interpolatedColor, input: originalInput }
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
      return { swatch: color, input: originalInput }
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
      return { swatch: interpolatedColor, input: originalInput }
    }

    // Handle simple numeric values (absolute position)
    currentPosition = shade as number
    const interpolatedColor = colorMix(lastColorStop, nextColor, currentPosition)
    lastColor = interpolatedColor
    return { swatch: interpolatedColor, input: originalInput }
  })
}

/**
 * Generates a color range by interpolating between start and end colors
 * Supports color stops, relative positioning, and HSL adjustments
 * @param params - Configuration object containing from/to colors, range definition, and optional accent color
 * @returns Array of interpolated color swatches
 */
function getRange(params: GetRange): UmbraSwatch[] {
  return getRangeWithInputs(params).map(item => item.swatch)
}

/**
 * Generates an enriched color range with full metadata
 * @param params - Configuration object containing from/to colors, range definition, and optional accent color
 * @returns Array of UmbraColour objects with metadata
 */
function getEnrichedRange(params: GetRange): UmbraColour[] {
  const rangeWithInputs = getRangeWithInputs(params)
  const totalLength = rangeWithInputs.length

  let previousColor: UmbraSwatch | undefined
  let lastSectionColor: UmbraSwatch | undefined
  let lastSection: 'background' | 'middleground' | 'foreground' | undefined

  return rangeWithInputs.map(({ swatch: colorSwatch, input }, index) => {
    const currentSection = getColorSection(index, totalLength)

    // Track section boundaries
    if (lastSection && lastSection !== currentSection) {
      lastSectionColor = previousColor
    }

    const enrichedColor = createEnrichedColor({
      swatch: colorSwatch,
      input,
      index,
      totalLength,
      previousColor,
      lastSectionColor
    })

    // Update for next iteration
    previousColor = colorSwatch
    lastSection = currentSection

    return enrichedColor
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

  // If accent has explicit range, use it
  const hasExplicitRange = !isString && accent.range

  // Get settings fallback first to check if it contains "primer"
  const fallback = accentRangeValues(adjusted, input.settings, true)
  const settingsHasPrimer = fallback.some(shade => shade === 'primer')

  // If no explicit range and we have a color, try to use preset
  // BUT: Don't use preset if settings contain "primer" keyword (user wants explicit control)
  let range: UmbraShade[]
  if (!hasExplicitRange && color && !settingsHasPrimer) {
    const { preset } = resolveColorPreset(color)
    const isDark = adjusted.background.isDark()
    const presetRange = isDark ? preset.range.dark : preset.range.light

    // Use preset range as the base
    range = resolveTints(presetRange)
  } else {
    // Use explicit range or fallback to settings
    range = isString ? fallback : accentRangeValues(adjusted, accent, false) || fallback // Don't filter for accent's own properties
  }

  // If range contains "primer" keyword, skip auto-insertion since user explicitly positioned it
  const hasPrimerKeyword = range.some(shade => shade === 'primer')
  if (hasPrimerKeyword) return range

  // If range contains only strings (stable schema), use it as-is without auto-placement
  const isStableRange = range.every(shade => typeof shade === 'string' && shade !== 'primer')
  if (isStableRange) return range

  if (insertion && color) return replaceAtIndex(range, insertion, color)
  if (!insertion && color) return autoPlacedRange({ input, adjusted, range, color })
  return range
}

/**
 * Validates accent primer contrast against background and foreground
 * Creates warning if contrast is below threshold
 * @param accentColor - The accent primer color
 * @param accentName - Name of the accent
 * @param background - Background color to check against
 * @param foreground - Foreground color to check against
 * @param minThreshold - Minimum acceptable contrast (default: 30)
 * @returns ValidationWarning if contrast is too low, undefined otherwise
 */
function validateAccentContrast(
  accentColor: string,
  accentName: string,
  background: UmbraSwatch,
  foreground: UmbraSwatch,
  minThreshold = 30
): ValidationWarning | undefined {
  const accentSwatch = swatch(accentColor)
  const bgContrast = getReadability(accentSwatch, background)
  const fgContrast = getReadability(accentSwatch, foreground)

  // Check if accent is too close to background
  if (bgContrast < minThreshold) {
    return {
      type: 'contrast',
      severity: 'warning',
      message: `Accent '${accentName}' primer has low contrast (${bgContrast.toFixed(1)}) with background. Consider using a different color.`,
      context: {
        accentName,
        accentColor,
        targetColor: background.toHex(),
        contrastValue: bgContrast,
        minContrast: minThreshold
      }
    }
  }

  // Check if accent is too close to foreground
  if (fgContrast < minThreshold) {
    return {
      type: 'contrast',
      severity: 'warning',
      message: `Accent '${accentName}' primer has low contrast (${fgContrast.toFixed(1)}) with foreground. Consider using a different color.`,
      context: {
        accentName,
        accentColor,
        targetColor: foreground.toHex(),
        contrastValue: fgContrast,
        minContrast: minThreshold
      }
    }
  }

  return undefined
}

/**
 * Generates accent color palettes
 * Each accent gets its own range interpolated between background and foreground
 * Resolves color preset names to their hex values
 * Also performs validation checks on accent primers
 * @param input - Input color scheme
 * @param adjusted - Adjusted color values
 * @returns Object containing accent palettes and validation warnings
 */
function accents(input: UmbraScheme, adjusted: UmbraAdjusted): {
  palettes: Array<{
    name: string
    background: UmbraColour
    foreground: UmbraColour
    range: UmbraColour[]
  }>
  warnings: ValidationWarning[]
} {
  const warnings: ValidationWarning[] = []
  const minContrastThreshold = input.settings?.minContrastThreshold ?? 30

  const palettes = adjusted.accents.map((accent) => {
    const isString = typeof accent === 'string'
    const name = isString ? undefined : accent.name
    let color = isString ? accent : accent.color

    // Resolve color preset names to hex values
    if (color) {
      const { hex } = resolveColorPreset(color)
      color = hex
    }

    // Validate accent primer contrast if we have a color
    if (color) {
      const warning = validateAccentContrast(
        color,
        name || DEFAULT_ACCENT_NAME,
        adjusted.background,
        adjusted.foreground,
        minContrastThreshold
      )
      if (warning) {
        warnings.push(warning)
      }
    }

    const range = putAccentInRange(adjusted, accent, input)
    const bgSwatch = pickContrast(adjusted.foreground, adjusted)
    const fgSwatch = pickContrast(adjusted.background, adjusted)
    const enrichedRange = getEnrichedRange({
      from: adjusted.background,
      to: adjusted.foreground,
      range,
      accentColor: color  // Pass accent color to replace "primer" keyword
    })

    return {
      name: name || DEFAULT_ACCENT_NAME,
      background: createEnrichedColor({
        swatch: bgSwatch,
        input: 'background',
        index: -1,
        totalLength: enrichedRange.length + 2,
        previousColor: undefined,
        lastSectionColor: undefined
      }),
      foreground: createEnrichedColor({
        swatch: fgSwatch,
        input: 'foreground',
        index: enrichedRange.length,
        totalLength: enrichedRange.length + 2,
        previousColor: enrichedRange[enrichedRange.length - 1]?.swatch,
        lastSectionColor: enrichedRange.length > 0 
          ? enrichedRange.find(c => c?.section === 'foreground')?.swatch 
          : undefined
      }),
      range: enrichedRange
    }
  })

  return { palettes, warnings }
}

interface RangeValues {
  range?: TintsInput | { light?: TintsInput; dark?: TintsInput }
}

/**
 * Resolves the appropriate range values based on theme mode (dark/light)
 * Uses the new range API: either an array or an object with light/dark properties
 * @param adjusted - Adjusted color values (determines if theme is dark)
 * @param scheme - Optional scheme with range configuration
 * @returns Resolved shade array
 */
function rangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues): UmbraShade[] {
  const isDark = adjusted.background.isDark()
  const rangeInput = scheme?.range
  const defaultRange = defaultSettings.range
  const defaultInput = defaultRange && typeof defaultRange === 'object' && !Array.isArray(defaultRange) && ('light' in defaultRange || 'dark' in defaultRange)
    ? (isDark ? defaultRange.dark : defaultRange.light)
    : undefined

  // Handle the new range API
  if (rangeInput && typeof rangeInput === 'object' && !Array.isArray(rangeInput) && ('light' in rangeInput || 'dark' in rangeInput)) {
    // It's an object with light/dark properties
    const resolvedRange = isDark ? rangeInput.dark : rangeInput.light
    return resolveTints(resolvedRange, undefined, defaultInput)
  }

  // It's an array or undefined
  return resolveTints(rangeInput as TintsInput | undefined, undefined, defaultInput)
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
 * Uses the new range API: either an array or an object with light/dark properties
 * @param adjusted - Adjusted color values
 * @param scheme - Optional scheme with range configuration
 * @param filterStrings - If true, exclude ranges containing color strings
 * @returns Resolved shade array
 */
function accentRangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues, filterStrings: boolean = false): UmbraShade[] {
  const isDark = adjusted.background.isDark()
  const rangeInput = scheme?.range
  const defaultRange = defaultSettings.range
  const defaultInput = defaultRange && typeof defaultRange === 'object' && !Array.isArray(defaultRange) && ('light' in defaultRange || 'dark' in defaultRange)
    ? (isDark ? defaultRange.dark : defaultRange.light)
    : undefined

  // Handle the new range API
  let resolvedRange: TintsInput | undefined
  if (rangeInput && typeof rangeInput === 'object' && !Array.isArray(rangeInput) && ('light' in rangeInput || 'dark' in rangeInput)) {
    // It's an object with light/dark properties
    resolvedRange = isDark ? rangeInput.dark : rangeInput.light
  } else {
    // It's an array or undefined
    resolvedRange = rangeInput as TintsInput | undefined
  }

  if (filterStrings) {
    // Only use resolvedRange as fallback if it doesn't contain strings
    const safeRangeInput = containsStrings(resolvedRange) ? undefined : resolvedRange
    return resolveTints(safeRangeInput, undefined, defaultInput)
  }

  return resolveTints(resolvedRange, undefined, defaultInput)
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
  // Use baseRange if provided, otherwise fall back to settings.range
  const range = input.baseRange
    ? rangeValues(adjusted, { range: input.baseRange })
    : rangeValues(adjusted, input.settings)

  const enrichedRange = getEnrichedRange({ from: background, to: foreground, range })

  return {
    name: 'base',
    background: createEnrichedColor({
      swatch: background,
      input: 'background',
      index: -1, // special index for background
      totalLength: enrichedRange.length + 2, // +2 for bg and fg
      previousColor: undefined,
      lastSectionColor: undefined
    }),
    foreground: createEnrichedColor({
      swatch: foreground,
      input: 'foreground',
      index: enrichedRange.length, // special index for foreground
      totalLength: enrichedRange.length + 2,
      previousColor: enrichedRange[enrichedRange.length - 1]?.swatch,
      lastSectionColor: enrichedRange.length > 0 
        ? enrichedRange.find(c => c?.section === 'foreground')?.swatch 
        : undefined
    }),
    range: enrichedRange
  }
}

/**
 * Generates a complete Umbra color scheme
 * Creates base palette plus all accent palettes with enriched color metadata
 * @param input - Input color scheme configuration
 * @param adjusted - Adjusted and normalized color values
 * @returns Object containing palette array with enriched colors and validation warnings
 */
export function umbraGenerate(input: UmbraScheme, adjusted: UmbraAdjusted): {
  output: Array<{
    name: string
    background: UmbraColour
    foreground: UmbraColour
    range: UmbraColour[]
  }>
  validationWarnings: ValidationWarning[]
} {
  const { palettes, warnings } = accents(input, adjusted)
  return {
    output: [base(input, adjusted), ...palettes],
    validationWarnings: warnings
  }
}
