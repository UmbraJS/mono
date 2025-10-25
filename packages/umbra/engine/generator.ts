import { swatch } from '../swatch'
import type { UmbraSwatch } from '../swatch'
import type { UmbraAdjusted, UmbraScheme, Accent } from './types'
import { pickContrast, colorMix, colorMixHSL } from './primitives/color'
import { insertColorIntoRange, getStrings } from './primitives/utils'
import { resolveTints, type TintsInput, type UmbraShade } from './easing'
import { defaultSettings } from './defaults'

interface GetRange {
  from: UmbraSwatch
  to: UmbraSwatch
  range: UmbraShade[]
}

function getRange({ from, to, range }: GetRange): UmbraSwatch[] {
  const colorStops = getStrings(range)

  // Track current absolute position (0-100%) for relative calculations
  let currentPosition = 0

  // Track the last color we generated (starts at 'from')
  let lastColor = from

  // Determine the next color stop (starts with first stop or 'to' if no stops)
  let nextColor = colorStops.length > 0 ? swatch(colorStops[0]) : to

  return range.map((val) => {
    // Check if it's a relative value string (+=X or -=X)
    if (typeof val === 'string' && /^[+-]=\d+(?:\.\d+)?$/.test(val)) {
      // Relative value as a simple string (not in an object)
      const match = val.match(/^([+-])=(\d+(?:\.\d+)?)$/)
      if (match) {
        const [, operator, amount] = match
        const delta = parseFloat(amount)
        if (operator === '+') {
          currentPosition = Math.min(100, currentPosition + delta)
        } else {
          currentPosition = Math.max(0, currentPosition - delta)
        }
      }
      // Mix between lastColor and nextColor
      const newColor = colorMix(lastColor, nextColor, currentPosition)
      lastColor = newColor
      return newColor
    } else if (typeof val === 'string') {
      // Color stop (hex, named color, etc.)
      const color = swatch(val)
      lastColor = color
      colorStops.shift()
      // Update nextColor to the next stop or 'to' if no more stops
      nextColor = colorStops.length > 0 ? swatch(colorStops[0]) : to
      // Reset position for the next segment
      currentPosition = 0
      return color
    } else if (typeof val === 'object') {

      // Parse the mix value to update current position
      const mixValue = val.mix
      if (typeof mixValue === 'number') {
        // Absolute: set position directly
        currentPosition = mixValue
      } else if (typeof mixValue === 'string') {
        // Relative: calculate from current position
        const match = mixValue.match(/^([+-])=(\d+(?:\.\d+)?)$/)
        if (match) {
          const [, operator, amount] = match
          const delta = parseFloat(amount)
          if (operator === '+') {
            currentPosition = Math.min(100, currentPosition + delta)
          } else {
            currentPosition = Math.max(0, currentPosition - delta)
          }
        }
      }

      // Create options with potentially relative values for each channel
      const options = {
        mix: currentPosition, // Use absolute position for the actual interpolation
        hue: val.hue !== undefined
          ? (typeof val.hue === 'string' ? val.hue : val.hue)
          : undefined,
        saturation: val.saturation !== undefined
          ? (typeof val.saturation === 'string' ? val.saturation : val.saturation)
          : undefined,
        lightness: val.lightness !== undefined
          ? (typeof val.lightness === 'string' ? val.lightness : val.lightness)
          : undefined,
      }

      // Mix between lastColor and nextColor using HSL
      const mixedColor = colorMixHSL(lastColor, nextColor, options)
      lastColor = mixedColor
      return mixedColor
    } else {
      // Simple number - absolute position
      currentPosition = val as number
      const newColor = colorMix(lastColor, nextColor, currentPosition)
      lastColor = newColor
      return newColor
    }
  })
}

interface RangeProps {
  input: UmbraScheme
  adjusted: UmbraAdjusted
  range: UmbraShade[]
  color?: string
}

function autoPlacedRange({ input, adjusted, range, color }: RangeProps) {
  if (!color) return range
  const baseRange = getRange({
    from: adjusted.background,
    to: adjusted.foreground,
    range: rangeValues(adjusted, input.settings)
  })
  return insertColorIntoRange({ range, shades: baseRange, color: swatch(color) })
}

function replaceAtIndex(array: UmbraShade[], index: number, value: string) {
  const newArray = array.slice()
  newArray[index] = value
  return newArray
}

function putAccentInRange(adjusted: UmbraAdjusted, accent: Accent | string, input: UmbraScheme) {
  const isString = typeof accent === 'string'
  const color = isString ? accent : accent.color
  const insertion = input.settings?.insertion

  const fallback = accentRangeValues(adjusted, input.settings, true) // Filter strings for settings fallback
  const range = isString ? fallback : accentRangeValues(adjusted, accent, false) || fallback // Don't filter for accent's own properties

  if (insertion && color) return replaceAtIndex(range, insertion, color)
  if (!insertion && color) return autoPlacedRange({ input, adjusted, range, color })
  return range
}

function accents(input: UmbraScheme, adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent) => {
    const isString = typeof accent === 'string'
    const name = isString ? undefined : accent.name
    const range = putAccentInRange(adjusted, accent, input)
    return {
      name: name || `accent`,
      background: pickContrast(adjusted.foreground, adjusted),
      foreground: pickContrast(adjusted.background, adjusted),
      range: getRange({ from: adjusted.background, to: adjusted.foreground, range })
    }
  })
}

interface RangeValues {
  range?: TintsInput     // Fallback for both shades and tints
  shades?: TintsInput
  tints?: TintsInput
}

function rangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues): UmbraShade[] {
  const isDark = adjusted.background.isDark()
  const tintsInput = isDark ? scheme?.shades : scheme?.tints
  const rangeInput = scheme?.range  // Fallback to range property
  const defaultInput = isDark ? defaultSettings.shades : defaultSettings.tints
  return resolveTints(tintsInput, rangeInput, defaultInput)
}

function containsStrings(input?: TintsInput): boolean {
  if (!input) return false
  if (!Array.isArray(input)) return false
  return input.some(v => typeof v === 'string')
}

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

export function umbraGenerate(input: UmbraScheme, adjusted: UmbraAdjusted) {
  return [base(input, adjusted), ...accents(input, adjusted)]
}
