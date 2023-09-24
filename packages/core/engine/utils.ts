import tinycolor from 'tinycolor2'
import { getReadability } from './primitives/color'

import { UmbraAdjusted, Shade } from './types'

type Range = (number | string)[]
type Stop = {
  value: number
  index: number
}

//60% of 100% is x% of 50%
function calculateX({ percentage = 60, of = 50 }): number {
  const leftSide = (percentage / 100) * 1.0
  const rightSide = of / 100
  return (leftSide / rightSide) * 100
}

export function adjustPercentage(range: Range, stop: Stop) {
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

export function adjustPercentagex(range: Range, value: number) {
  return range.map((percentage) => {
    if (!isNumber(percentage)) return percentage
    return calculateX({
      percentage,
      of: value
    })
  })
}

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

interface NewRange {
  range: Shade[]
  shades: tinycolor.Instance[]
  color: tinycolor.Instance
}

export function normalizeRange({ range, shades, color }: NewRange) {
  const length = shades.length
  const leastReadable = getLeastReadable({ shades, color })
  const selectedPercent = range[leastReadable.index] as number

  const newRange = adjustPercentage(range, {
    value: selectedPercent,
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

//split array on each string, add start hex to the beginning of each subarray
export function splitAccentArray(AccentArray: (string | number)[], adjusted: UmbraAdjusted) {
  const result = []
  let array: (string | number)[] = []
  let lastHex = adjusted.background.toHexString()

  AccentArray.forEach((item) => {
    if (typeof item === 'number') {
      if (array.length === 0) array.push(lastHex)
      array.push(item)
    } else if (typeof item === 'string' && array.length > 0) {
      lastHex = item
      array.push(item)
      result.push(array)
      array = []
    }
  })

  // Add the last subarray if it ends with a number
  if (array.length > 0) {
    const bg = adjusted.foreground.toHexString()
    array.push(bg)
    result.push(array)
  }

  return result
}

export function firstShade(value: (string | number)[]) {
  const f = value.find((x) => typeof x === 'string') as string | undefined
  return tinycolor(f ? f : '#000000')
}

export function nextAccent(accents: string[], adjusted: UmbraAdjusted) {
  const foreground = tinycolor(adjusted.foreground)
  return accents.length > 0 ? tinycolor(accents[0] as string) : foreground
}

export function getStrings(range: (number | string)[]) {
  return range.reduce((acc, val) => {
    if (typeof val === 'string') acc.push(val)
    return acc
  }, [] as string[])
}
