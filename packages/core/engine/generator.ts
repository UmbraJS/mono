import { colord, Colord } from 'colord'
import { UmbraAdjusted } from './types'
import { pickContrast, colorMix } from './primitives/color'
import { normalizeRange, nextAccent, getStrings } from './primitives/utils'

interface GetRange {
  from: Colord
  to: Colord
  range: (number | string)[]
}

function accentRange(adjusted: UmbraAdjusted, range: (number | string)[], c?: string) {
  const { background, foreground } = adjusted
  const color = c ? colord(c) : undefined

  if (!color) return getRange({ from: background, to: foreground, range })

  const defaultRange = adjusted.input.settings.shades || []
  const shades = getRange({ from: background, to: foreground, range: defaultRange })
  const normalizedRange = normalizeRange({ range: defaultRange, shades, color })
  return getRange({ from: background, to: foreground, range: normalizedRange })
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

interface AccentShape {
  adjusted: UmbraAdjusted
  name?: string
  color?: string
  range: (number | string)[]
}

function accentShape({ color, range, adjusted, name }: AccentShape) {
  const c = colord(color || '#ffffff')
  return {
    name: name ? name : `accent`,
    background: c,
    foreground: pickContrast(c, adjusted),
    shades: accentRange(adjusted, range, color)
  }
}

function accents(adjusted: UmbraAdjusted) {
  const defaultShades = adjusted.input.settings.shades || []
  return adjusted.accents.map((accent) => {
    const plainColor = typeof accent === 'string' ? accent : accent.color
    const plainRange = typeof accent === 'string' ? defaultShades : accent.shades
    const color = plainColor ? plainColor : plainRange ? getStrings(plainRange)[0] : undefined
    const range = plainRange ? plainRange : defaultShades
    const name = typeof accent === 'string' ? undefined : accent.name
    return accentShape({ adjusted, name, color, range })
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
    generated: [base(adjusted), ...accents(adjusted)]
  }
}
