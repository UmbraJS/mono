import { colord, Colord } from 'colord'

import { Shade } from './types'
import { getReadability } from './primitives/color'

interface NewRange {
  range: Shade[]
  shades: Colord[]
  color: Colord
}

function getReadable(shade: Colord, color: Colord, index: number) {
  const readability = Math.abs(getReadability(shade, color))
  return { readability, index }
}

export function normalizeRange({ range, shades, color }: NewRange) {
  const leastReadable = shades
    .map((shade, index) => getReadable(shade, color, index))
    .reduce((a, b) => (a.readability < b.readability ? a : b))

  const rangeInstance = [...range]
  rangeInstance[leastReadable.index] = color.toRgbString()
  return rangeInstance
}

export function nextAccent(accents: string[], foreground: Colord) {
  return accents.length > 0 ? colord(accents[0] as string) : foreground
}

export function getStrings(range: (number | string)[]) {
  return range.reduce((acc, val) => {
    if (typeof val === 'string') acc.push(val)
    return acc
  }, [] as string[])
}
