import { swatch } from '../swatch'
import type { UmbraSwatch } from '../swatch'
import type { UmbraAdjusted, UmbraScheme, Accent } from './types'
import { pickContrast, colorMix, colorMixHSL } from './primitives/color'
import { insertColorIntoRange, nextAccent, getStrings } from './primitives/utils'
import { resolveTints, type TintsInput, type UmbraShade } from './easing'
import { defaultSettings } from './defaults'

interface GetRange {
  from: UmbraSwatch
  to: UmbraSwatch
  range: UmbraShade[]
}

function getRange({ from, to, range }: GetRange): UmbraSwatch[] {
  const accents = getStrings(range)
  let lastColor = from
  let nextColor = accents.length > 0 ? swatch(accents[0] as string) : to

  return range.map((val) => {
    if (typeof val === 'string') {
      const color = swatch(val)
      lastColor = color
      accents.shift()
      return color
    } else if (typeof val === 'object') {
      nextColor = nextAccent(accents, to)
      // Use HSL mixing for independent channel control
      const mixedColor = colorMixHSL(lastColor, nextColor, val)
      lastColor = mixedColor
      return mixedColor
    } else {
      nextColor = nextAccent(accents, to)
      const newColor = colorMix(lastColor, nextColor, val as number)
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
