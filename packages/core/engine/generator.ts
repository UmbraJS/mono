import tinycolor from 'tinycolor2'
import { pickContrast, colorMix } from './primitives/color'
import { UmbraAdjusted, AccentRange } from './types'
import { normalizeRange, nextAccent, getStrings } from './utils'

interface GetRange {
  from: tinycolor.Instance
  to: tinycolor.Instance
  range: (number | string)[]
}

function accentRange(adjusted: UmbraAdjusted, range: AccentRange) {
  const isString = typeof range === 'string'
  if (!isString) return getRange({ from: adjusted.background, to: adjusted.foreground, range })
  const color = tinycolor(isString ? range : getStrings(range)[0])

  const { background, foreground } = adjusted
  const defaultRange = adjusted.input.settings.shades || []
  const shades = getRange({ from: background, to: foreground, range: defaultRange })
  const normalizedRange = normalizeRange({ range: defaultRange, shades, color })

  return getRange({ from: background, to: foreground, range: normalizedRange })
}

function getRange({ from, to, range }: GetRange) {
  const accents = getStrings(range)
  let lastColor = from
  let nextColor = accents.length > 0 ? tinycolor(accents[0] as string) : to

  return range.map((val) => {
    if (typeof val === 'string') {
      const color = tinycolor(val)
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

interface AccentShape {
  adjusted: UmbraAdjusted
  name?: string
  accent: string
  range: (number | string)[] | string
}

function accentShape({ accent, range, adjusted, name }: AccentShape) {
  const isString = typeof range === 'string'
  const color = tinycolor(accent)
  return {
    name: name ? name : `accent`,
    background: color,
    foreground: pickContrast(color, adjusted),
    shades: isString
      ? accentRange(adjusted, range)
      : getRange({ from: adjusted.background, to: adjusted.foreground, range })
  }
}

function accents(adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent) => {
    if (typeof accent === 'string') return accentShape({ adjusted, accent, range: accent })
    const range = accent.value
    const defaultShades = adjusted.input.settings.shades || []
    const isString = typeof range === 'string'
    return accentShape({
      adjusted,
      name: accent.name,
      accent: isString ? range : getStrings(range)[0],
      range: isString ? defaultShades : range
    })
  })
}

function base(adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted
  const range = adjusted.input.settings.shades || []
  return {
    name: 'base',
    background,
    foreground,
    shades: getRange({ from: background, to: foreground, range })
  }
}

export function generate(adjusted: UmbraAdjusted) {
  const input = adjusted.input
  return {
    input,
    adjusted,
    ranges: [base(adjusted), ...accents(adjusted)]
  }
}
