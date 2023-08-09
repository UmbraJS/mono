import tinycolor from 'tinycolor2'
import { pickContrast, colorMix, getReadability } from './primitives/color'

import { UmbraAdjusted, Shade, CustomColor, UmbraInput, RawRange } from './types'

interface GetRawRange {
  from: tinycolor.Instance
  to: tinycolor.Instance
  range: Shade[]
}

function getRange({ from, to, range }: GetRawRange) {
  const foreground = tinycolor(from)
  const background = tinycolor(to)
  return range.map((val) => {
    const isNumber = Boolean(typeof val === 'number')
    if (!isNumber) return tinycolor(val as string)
    return colorMix(foreground, background, val as number)
  })
}

function accentRange(adjusted: UmbraAdjusted, accent: tinycolor.Instance) {
  const background = adjusted.background
  const foreground = adjusted.foreground
  const range = adjusted.input.settings.accents?.shade || []
  const shades = getRange({ from: background, to: foreground, range })
  const length = shades.length

  const readability = shades.map((shade, index) => ({
    value: Math.abs(getReadability(shade, accent)),
    index
  }))

  const leastReadable = readability.reduce((prev, curr) => (prev.value < curr.value ? prev : curr))

  const leftRange = range.slice(0, leastReadable.index)
  const rightRange = range.slice(leastReadable.index + 1, length)

  const left = getRange({ from: background, to: accent, range: leftRange })
  const right = getRange({ from: accent, to: foreground, range: rightRange })

  return [...left, accent, ...right]
}

function accents(adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent, index) => {
    const name = index === 0 ? 'accent' : `accent${index + 1}`
    return {
      name: name,
      background: accent,
      shades: accentRange(adjusted, accent),
      foreground: pickContrast(accent, adjusted)
    }
  })
}

function base(adjusted: UmbraAdjusted) {
  const range = adjusted.input.settings.background?.shade || []
  const background = adjusted.background
  const foreground = adjusted.foreground
  return {
    name: 'base',
    background,
    shades: getRange({ from: background, to: foreground, range }),
    foreground
  }
}

function getColor(value: CustomColor, obj: GeneratedOutput) {
  let color = value
  const origin = obj.input
  const isFunc = typeof value === 'function'
  if (isFunc) color = value(origin)
  return tinycolor(color as string)
}

interface GeneratedOutput {
  input: UmbraInput
  adjusted: UmbraAdjusted
  generated: {
    base: RawRange
    accents: RawRange[]
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
