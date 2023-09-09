import tinycolor from 'tinycolor2'
import { pickContrast, colorMix, getReadability } from './primitives/color'

import {
  UmbraAdjusted,
  Shade,
  CustomColor,
  UmbraInput,
  RawRange,
  AccentRange,
  Accent
} from './types'

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
  color: tinycolor.Instance
}

function normalizeRange({ range, shades, color }: NewRange) {
  const length = shades.length
  const leastReadable = getLeastReadable({ shades, color })
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
  color: tinycolor.Instance
}

const shadeReadability = (
  shade: tinycolor.Instance,
  accent: tinycolor.Instance,
  index: number
) => ({
  value: Math.abs(getReadability(shade, accent)),
  index
})

function getLeastReadable({ shades, color }: LeastReadable) {
  return shades
    .map((shade, index) => shadeReadability(shade, color, index))
    .reduce((a, b) => (a.value < b.value ? a : b))
}

function accentRange(adjusted: UmbraAdjusted, c: AccentRange) {
  const isString = typeof c === 'string'
  const color = tinycolor(isString ? c : firstShade(c))

  //if c is a string do the below. If its an array, find the hex in the array and use the numbers as the shaders and the placement of the hex to form the range around it
  //if the array has multiple hexes find a way to chain multiple ranges between them

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

function firstShade(value: (string | number)[]) {
  const f = value.find((x) => typeof x === 'string') as string | undefined
  return tinycolor(f ? f : '#000000')
}

function objectAccentShades(v: (number | string)[], adjusted: UmbraAdjusted, name?: string) {
  const value = firstShade(v)
  return {
    name: name ? name : `accent`,
    background: value,
    shades: accentRange(adjusted, v),
    foreground: pickContrast(value, adjusted)
  }
}

function objectAccent(accent: Accent, adjusted: UmbraAdjusted) {
  const v = accent.value
  const isString = typeof v === 'string'
  if (!isString) return objectAccentShades(v, adjusted, accent.name)
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
    if (!isString) return objectAccent(accent, adjusted)
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
