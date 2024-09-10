import { colord } from 'colord'
import type { Colord } from 'colord'
import type { UmbraAdjusted, UmbraScheme, Accent } from './types'
import { pickContrast, colorMix } from './primitives/color'
import { insertColorIntoRange, nextAccent, getStrings } from './primitives/utils'

interface GetRange {
  from: Colord
  to: Colord
  range: (number | string)[]
}

function getRange({ from, to, range }: GetRange) {
  const accents = getStrings(range)
  let lastColor = from
  let nextColor = accents.length > 0 ? colord(accents[0] as string) : to

  return range.map((val) => {
    if (typeof val === 'string') {
      const color = colord(val)
      lastColor = color
      accents.shift()
      return color
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
  range: (number | string)[]
  color?: string
}

function autoPlacedRange({ input, adjusted, range, color }: RangeProps) {
  if (!color) return range
  const baseRange = getRange({
    from: adjusted.background,
    to: adjusted.foreground,
    range: rangeValues(adjusted, input.settings) || []
  })
  return insertColorIntoRange({ range, shades: baseRange, color: colord(color) })
}

function accentColor(fallback: Colord, accent?: string, range?: (number | string)[]) {
  const plainColor2 = accent ? accent : range ? getStrings(range)[0] : undefined
  return plainColor2 ? colord(plainColor2) : fallback
}

function replaceAtIndex(array: (number | string)[], index: number, value: string) {
  const newArray = array.slice()
  newArray[index] = value
  return newArray
}

function putAccentInRange(adjusted: UmbraAdjusted, accent: Accent | string, input: UmbraScheme) {
  const isString = typeof accent === 'string'
  const color = isString ? accent : accent.color
  const insertion = input.settings?.insertion

  const fallback = rangeValues(adjusted, input.settings) || []
  const range = isString ? fallback : rangeValues(adjusted, accent) || fallback

  if (insertion && color) return replaceAtIndex(range, insertion, color)
  if (!insertion && color) return autoPlacedRange({ input, adjusted, range, color })
  return range
}

function accents(input: UmbraScheme, adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted

  function gen(accent: string | Accent) {
    const isString = typeof accent === 'string'

    const name = isString ? undefined : accent.name
    const color = isString ? accent : accent.color
    const range = putAccentInRange(adjusted, accent, input)

    return {
      name: name || `accent`,
      background: accentColor(adjusted.foreground, color, range),
      foreground: pickContrast(background, adjusted),
      range: getRange({ from: background, to: foreground, range })
    }
  }

  return adjusted.accents.map((accent) => gen(accent))
}

interface RangeValues {
  shades?: (number | string)[]
  tints?: (number | string)[]
}

function rangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues) {
  return adjusted.background.isDark() ? scheme?.shades : scheme?.tints
}

function base(input: UmbraScheme, adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted
  const range = rangeValues(adjusted, input.settings) || []
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
