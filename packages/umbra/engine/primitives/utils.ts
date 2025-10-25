import { swatch } from '../../swatch'
import type { UmbraSwatch } from '../../swatch'

import type { UmbraScheme, UmbraSettings } from '../types'
import { getReadability } from './color'
import { defaultSettings } from '../defaults'
import { UmbraShade } from '../easing'

interface RandomSettings extends UmbraSettings {
  amount: number
}

interface NewRange {
  range: UmbraShade[]
  shades: UmbraSwatch[]
  color: UmbraSwatch
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

function getReadable(shade: UmbraSwatch, color: UmbraSwatch, index: number) {
  const readability = getReadability(shade, color)
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

export function nextAccent(accents: string[], foreground: UmbraSwatch) {
  return accents.length > 0 ? swatch(accents[0] as string) : foreground
}

export function getStrings(range: UmbraShade[]) {
  return range.reduce((acc, val) => {
    // Only add actual color strings, not relative values like "+=10"
    if (typeof val === 'string' && !/^[+-]=\d+(?:\.\d+)?$/.test(val)) {
      acc.push(val)
    }
    return acc
  }, [] as string[])
}

interface Fallback {
  fallback: number
  number?: number
}

export function fallback({ number, fallback }: Fallback) {
  const isUndefined = typeof number === 'undefined'
  if (isUndefined) return fallback
  return number
}
