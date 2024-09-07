import { colord, extend } from 'colord'
import type { Colord } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import type { UmbraAdjusted } from '../types'
import { defaultSettings } from '../defaults'
import { fallback } from './utils'

extend([mixPlugin])

type ColorRawRange = {
  foreground: string | Colord
  background: string | Colord
  readability?: number
}

interface IncreaseContrastUntil {
  color: Colord
  contrast: Colord
  condition: (newColor: Colord, iterations?: number) => boolean
}

interface IncreaseContrast {
  color: Colord
  contrast: Colord
  power: number
}

const stored = {
  readability: defaultSettings.readability || 11
}

function apcaContrast(fg: string | Colord, bg: string | Colord) {
  const fgc = colord(fg).toRgb()
  const bgc = colord(bg).toRgb()
  return APCAcontrast(sRGBtoY([fgc.r, fgc.g, fgc.b]), sRGBtoY([bgc.r, bgc.g, bgc.b]))
}

export const getReadability = (fg: string | Colord, bg: string | Colord) => {
  return Math.abs(apcaContrast(fg, bg))
}

export const getReadable = (props: ColorRawRange) => {
  const foreground = colord(props.foreground)
  const background = colord(props.background)

  return increaseContrastUntil({
    color: foreground,
    contrast: background,
    condition: (color) => {
      const current = getReadability(color, background)
      const readability = fallback({
        fallback: stored.readability,
        number: props.readability
      })
      return current >= readability
    }
  })
}

export function increaseContrastUntil({ color, contrast, condition }: IncreaseContrastUntil) {
  const iterations = 120 // Number of time it will try to reach the condition
  const power = 0.01 // How much it will increase the contrast each time
  let newColor = color
  let count = 0
  if (condition(newColor, count)) return newColor
  while (!condition(newColor, count) && count < iterations) {
    count += 1
    newColor = increaseContrast({
      power,
      color: newColor,
      contrast
    })
  }

  return newColor
}

const increaseContrast = ({ color, contrast, power }: IncreaseContrast) => {
  const sameLightness = color.isDark() === contrast.isDark()

  function onSameLightness() {
    return color.isDark() ? color.lighten(power) : color.darken(power)
  }

  function onDiffLightness() {
    return contrast.isDark() ? color.lighten(power) : color.darken(power)
  }

  return sameLightness ? onSameLightness() : onDiffLightness()
}

export function mostReadable(color: Colord, colors: Colord[]) {
  const readable = colors.map((c) => Math.abs(getReadability(color, c)))
  const index = readable.indexOf(Math.max(...readable))
  return colors[index]
}

export const pickContrast = (color: Colord, scheme: UmbraAdjusted) => {
  return mostReadable(color, [
    scheme.background || colord('white'),
    scheme.foreground || colord('black')
  ])
}

export function colorMix(from: string | Colord, to: string | Colord, percent = 50) {
  const tinyFrom = colord(from)
  const tinyTo = colord(to)
  return colord(tinyFrom).mix(tinyTo, percent / 100)
}
