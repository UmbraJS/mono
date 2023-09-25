import tinycolor from 'tinycolor2'
import { pickContrast, colorMix } from './primitives/color'
import { UmbraAdjusted, Shade, AccentRange } from './types'
import { isNumber, normalizeRange, nextAccent, getStrings } from './utils'

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

function accentRange(adjusted: UmbraAdjusted, c: AccentRange) {
  const isString = typeof c === 'string'
  if (!isString) return chainedRange(adjusted, c)
  const color = tinycolor(isString ? c : getStrings(c)[0])

  const { background, foreground } = adjusted
  const range = adjusted.input.settings.shades || []
  const shades = getRange({ from: background, to: foreground, range })
  const normalizedRange = normalizeRange({ range, shades, color })

  return chainedRange(adjusted, normalizedRange)
}

function chainedRange(adjusted: UmbraAdjusted, range: (number | string)[]) {
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

function accentShape(
  accent: string,
  range: (number | string)[] | string,
  adjusted: UmbraAdjusted,
  name?: string
) {
  const isString = typeof range === 'string'
  const color = tinycolor(accent)
  return {
    name: name ? name : `accent`,
    background: color,
    foreground: pickContrast(color, adjusted),
    shades: isString ? accentRange(adjusted, range) : chainedRange(adjusted, range)
  }
}

function accents(adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent) => {
    if (typeof accent === 'string') return accentShape(accent, accent, adjusted)
    const range = accent.value
    const name = accent.name

    const defaultShades = adjusted.input.settings.shades || []
    const isString = typeof range === 'string'

    const color = isString ? range : getStrings(range)[0]
    const shades = isString ? defaultShades : range

    return accentShape(color, shades, adjusted, name)
  })
}

function base(adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted
  const range = adjusted.input.settings.shades || []
  return {
    name: 'base',
    background,
    foreground,
    shades: chainedRange(adjusted, range)
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
