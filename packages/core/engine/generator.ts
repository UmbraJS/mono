import tinycolor from 'tinycolor2'
import { pickContrast, colorMix } from './primitives/color'

import { UmbraAdjusted, Shade, CustomColor, UmbraInput, RawRange } from './types'

function findContrast(color: tinycolor.Instance, adjusted: UmbraAdjusted) {
  return tinycolor.mostReadable(color, [adjusted.background || color, adjusted.foreground || color])
}

interface GetRawRange {
  from: tinycolor.Instance
  to: tinycolor.Instance
  range: Shade[]
}

function getRange({ from, to, range }: GetRawRange) {
  const foreground = tinycolor(from)
  const background = tinycolor(to)

  const r = range.map((val) => {
    const isNumber = Boolean(typeof val === 'number')
    if (!isNumber) return tinycolor(val as string)
    return colorMix(foreground, background, val as number)
  })

  return r
}

function accents(adjusted: UmbraAdjusted) {
  const range = adjusted.input.settings.accents?.shade || []
  return adjusted.accents.map((accent, index) => {
    const background = adjusted.background
    const name = index === 0 ? 'accent' : `accent${index + 1}`
    return {
      name: name,
      background: accent,
      shades: getRange({ from: accent, to: background, range }),
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

interface GeneratedObject {
  base: RawRange
  accents: RawRange[]
}

interface GeneratedOutput {
  input: UmbraInput
  adjusted: UmbraAdjusted
  generated: GeneratedObject
}

export function generate(adjusted: UmbraAdjusted) {
  const input = adjusted.input
  return {
    input,
    adjusted,
    ranges: [base(adjusted), ...accents(adjusted)]
  }
}
