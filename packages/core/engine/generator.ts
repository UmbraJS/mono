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
    if (!isNumber(val)) return tinycolor(val as string)
    return colorMix(foreground, background, val as number)
  })
}

//TODO: Enable multiple range stops
//TODO: Add support for custom accent colors

//60% of 100% is x% of 50%
function calculateX({ percentage = 60, of = 50 }): number {
  const leftSide = (percentage / 100) * 1.0
  const rightSide = of / 100
  return (leftSide / rightSide) * 100
}

function adjustPercentagesxx(
  percentages: (number | string)[],
  newShade: { value: number; index: number }
) {
  return percentages.map((percentage, i) => {
    if (!isNumber(percentage)) return percentage
    if (percentage === newShade.value) return percentage
    if (i < newShade.index) {
      return calculateX({
        percentage,
        of: newShade.value
      })
    } else {
      return percentage - newShade.value
    }
  })
}

function isNumber(value: any): value is number {
  return typeof value === 'number'
}

interface NewRange {
  range: Shade[]
  shades: tinycolor.Instance[]
  accent: tinycolor.Instance
}

function normalizeRange({ range, shades, accent }: NewRange) {
  const length = shades.length
  const leastReadable = getLeastReadable({ shades, accent })
  const selectedPercent = range[leastReadable.index]
  //what about hex values?
  const newRange = adjustPercentagesxx(range, {
    value: selectedPercent as number,
    index: leastReadable.index
  })

  return {
    left: newRange.slice(0, leastReadable.index),
    right: newRange.slice(leastReadable.index + 1, length)
  }
}

interface LeastReadable {
  shades: tinycolor.Instance[]
  accent: tinycolor.Instance
}

function getLeastReadable({ shades, accent }: LeastReadable) {
  const readability = shades.map((shade, index) => ({
    value: Math.abs(getReadability(shade, accent)),
    index
  }))

  return readability.reduce((prev, curr) => (prev.value < curr.value ? prev : curr))
}

function accentRange(adjusted: UmbraAdjusted, accent: tinycolor.Instance) {
  const background = adjusted.background
  const foreground = adjusted.foreground
  const range = adjusted.input.settings.accents?.shade || []
  const shades = getRange({ from: background, to: foreground, range })

  const normalizedRange = normalizeRange({ range, shades, accent })

  console.log(normalizedRange.right)

  const left = getRange({ from: background, to: accent, range: normalizedRange.left })
  const right = getRange({ from: accent, to: foreground, range: normalizedRange.right })

  return [...left, accent, ...right]
}

function accents(adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent, index) => {
    return {
      name: index === 0 ? 'accent' : `accent${index + 1}`,
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
