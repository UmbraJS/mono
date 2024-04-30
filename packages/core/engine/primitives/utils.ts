import { colord } from 'colord'
import type { Colord } from 'colord'
import type { UmbraScheme, UmbraSettings } from '../types'
import { getReadability } from './color'
import { defaultSettings } from '../defaults'

interface RandomSettings extends UmbraSettings {
  amount: number
}

interface NewRange {
  range: (number | string)[]
  shades: Colord[]
  color: Colord
}

function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

export function randomScheme(randomSettings: RandomSettings = { amount: 1 }): UmbraScheme {
  return {
    background: randomHex(),
    foreground: randomHex(),
    accents: Array.from({ length: randomSettings.amount }, () => randomHex()),
    settings: { ...defaultSettings, ...randomSettings }
  }
}

function getReadable(shade: Colord, color: Colord, index: number) {
  const readability = Math.abs(getReadability(shade, color))
  return { readability, index }
}

export function insertColorIntoRange({ range, shades, color }: NewRange) {
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
