import tinycolor from 'tinycolor2'
import { getReadability } from './primitives/color'

import { UmbraAdjusted, Shade } from './types'

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

interface NewRange {
  range: Shade[]
  shades: tinycolor.Instance[]
  color: tinycolor.Instance
}

export function normalizeRange({ range, shades, color }: NewRange) {
  const leastReadable = getLeastReadable({ shades, color })
  const aaw = [...range]
  aaw[leastReadable.index] = color.toHexString()
  return aaw
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
