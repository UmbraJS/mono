import tinycolor from 'tinycolor2'
import { pickContrast, colorMix } from './primitives/color'
import { UmbraAdjusted, Shade, AccentRange, Accent } from './types'
import { isNumber, normalizeRange, firstShade, nextAccent, getStrings } from './utils'

interface GetRawRange {
  from: tinycolor.Instance
  to: tinycolor.Instance
  range: Shade[]
}

function getRange({ from, to, range }: GetRawRange) {
  const foreground = tinycolor(from)
  const background = tinycolor(to)
  return range.map((val) => {
    if (!isNumber(val)) return tinycolor(val as string)
    return colorMix(foreground, background, val as number)
  })
}

//TODO: Switch from tinycolor2 to colord

function accentRange(adjusted: UmbraAdjusted, c: AccentRange) {
  const isString = typeof c === 'string'
  if (isString) return singleAccentRange(adjusted, c)
  return chainedAccentRange(adjusted, c)
}

function chainedAccentRange(adjusted: UmbraAdjusted, range: (number | string)[]) {
  const foreground = tinycolor(adjusted.foreground)
  const background = tinycolor(adjusted.background)

  const accents = getStrings(range)
  let lastColor = background
  let nextColor = accents.length > 0 ? tinycolor(accents[0] as string) : foreground

  return range.map((val) => {
    if (typeof val === 'string') {
      const color = tinycolor(val)
      lastColor = color
      accents.shift()
      return color
    } else {
      nextColor = nextAccent(accents, adjusted)
      const newColor = colorMix(lastColor, nextColor, val as number)
      lastColor = newColor
      return newColor
    }
  })
}

function singleAccentRange(adjusted: UmbraAdjusted, c: AccentRange) {
  const isString = typeof c === 'string'
  const color = tinycolor(isString ? c : firstShade(c))

  const { background, foreground } = adjusted
  const range = adjusted.input.settings.shades || []
  const shades = getRange({ from: background, to: foreground, range })
  const normalizedRange = normalizeRange({ range, shades, color })

  return makeRange({
    color,
    adjusted,
    range: normalizedRange
  })
}

interface MakeRange {
  adjusted: UmbraAdjusted
  color: tinycolor.Instance
  range: {
    left: (string | number)[]
    right: (string | number)[]
  }
}

function makeRange({ adjusted, color, range }: MakeRange) {
  const { background, foreground } = adjusted
  const left = getRange({ from: background, to: color, range: range.left })
  const right = getRange({ from: color, to: foreground, range: range.right })
  return [...left, color, ...right]
}

function accentObjectShades(v: (number | string)[], adjusted: UmbraAdjusted, name?: string) {
  const value = firstShade(v)
  return {
    name: name ? name : `accent`,
    background: value,
    shades: accentRange(adjusted, v),
    foreground: pickContrast(value, adjusted)
  }
}

function accentObject(accent: Accent, adjusted: UmbraAdjusted) {
  const v = accent.value
  const isString = typeof v === 'string'
  if (!isString) return accentObjectShades(v, adjusted, accent.name)
  const c = tinycolor(v)
  return {
    name: accent.name ? accent.name : `accent`,
    background: c,
    shades: accentRange(adjusted, v),
    foreground: pickContrast(c, adjusted)
  }
}

function accents(adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent) => {
    const isString = typeof accent === 'string'
    if (!isString) return accentObject(accent, adjusted)
    return {
      name: 'accent',
      background: tinycolor(accent),
      shades: accentRange(adjusted, accent),
      foreground: pickContrast(tinycolor(accent), adjusted)
    }
  })
}

function base(adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted
  const range = adjusted.input.settings.shades || []
  return {
    name: 'base',
    background,
    shades: getRange({ from: background, to: foreground, range }),
    foreground
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
