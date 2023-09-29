import tinycolor from 'tinycolor2'
import { UmbraAdjusted, Shade } from './types'

interface NewRange {
  range: Shade[]
  shades: tinycolor.Instance[]
  color: tinycolor.Instance
}

export function normalizeRange({ range, shades, color }: NewRange) {
  const rangeInstance = [...range]
  const leastReadable = shades.map((shade, index) => index).reduce((a, b) => (a < b ? a : b))
  rangeInstance[leastReadable] = color.toHexString()
  return rangeInstance
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

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}
