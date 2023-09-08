import tinycolor from 'tinycolor2'
import { pickContrast, colorMix, getReadability } from './primitives/color'

import { UmbraAdjusted, Shade, CustomColor, UmbraInput, RawRange, AccentRange } from './types'

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
//TODO: Enable hex shades
//TODO: Enable function shades
//TODO: Switch from tinycolor2 to colord

//60% of 100% is x% of 50%
function calculateX({ percentage = 60, of = 50 }): number {
  const leftSide = (percentage / 100) * 1.0
  const rightSide = of / 100
  return (leftSide / rightSide) * 100
}

type Range = (number | string)[]
type Stop = {
  value: number
  index: number
}

function adjustPercentage(range: Range, stop: Stop) {
  return range.map((percentage, i) => {
    if (!isNumber(percentage)) return percentage
    if (percentage === stop.value) return percentage
    if (i > stop.index) return percentage - stop.value
    return calculateX({
      percentage,
      of: stop.value
    })
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
  const newRange = adjustPercentage(range, {
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

const shadeReadability = (
  shade: tinycolor.Instance,
  accent: tinycolor.Instance,
  index: number
) => ({
  value: Math.abs(getReadability(shade, accent)),
  index
})

function getLeastReadable({ shades, accent }: LeastReadable) {
  return shades
    .map((shade, index) => shadeReadability(shade, accent, index))
    .reduce((a, b) => (a.value < b.value ? a : b))
}

function accentRange(adjusted: UmbraAdjusted, c: AccentRange) {
  const isString = typeof c === 'string'
  const accent = tinycolor(isString ? c : firstShade(c))

  //if c is a string do the below. If its an array, find the hex in the array and use the numbers as the shaders and the placement of the hex to form the range around it
  //if the array has multiple hexes find a way to chain multiple ranges between them

  const { background, foreground } = adjusted
  const range = adjusted.input.settings.shades || []
  const shades = getRange({ from: background, to: foreground, range })

  const normalizedRange = normalizeRange({ range, shades, accent })

  const left = getRange({ from: background, to: accent, range: normalizedRange.left })
  const right = getRange({ from: accent, to: foreground, range: normalizedRange.right })

  return [...left, accent, ...right]
}

function firstShade(value: (string | number)[]) {
  const f = value.find((x) => typeof x === 'string') as string | undefined
  return f ? f : '#000000'
}

function accents(adjusted: UmbraAdjusted) {
  return adjusted.accents.map((accent) => {
    const isString = typeof accent === 'string'

    let string = null

    if (isString) {
      string = {
        name: 'accent',
        background: tinycolor(accent),
        shades: accentRange(adjusted, accent),
        foreground: pickContrast(tinycolor(accent), adjusted)
      }
    } else {
      const v = accent.value
      const isString = typeof v === 'string'

      if (isString) {
        const c = tinycolor(v)
        string = {
          name: accent.name ? accent.name : `accent`,
          background: tinycolor(c),
          shades: accentRange(adjusted, v),
          foreground: pickContrast(c, adjusted)
        }
      } else {
        const value = firstShade(v)
        string = {
          name: accent.name ? accent.name : `accent`,
          background: tinycolor(value),
          shades: accentRange(adjusted, v),
          foreground: pickContrast(tinycolor(value), adjusted)
        }
      }
    }

    return string
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
