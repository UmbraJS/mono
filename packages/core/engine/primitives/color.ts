import { colord, extend } from '../../swatch'
import type { UmbraSwatch } from '../../swatch'
import mixPlugin from '../../swatch/plugins/mix'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import type { UmbraAdjusted } from '../types'
import { defaultSettings } from '../defaults'
import { fallback } from './utils'

extend([mixPlugin])

type ColorRawRange = {
  foreground: string | UmbraSwatch
  background: string | UmbraSwatch
  readability?: number
}

interface IncreaseContrastUntil {
  color: UmbraSwatch
  contrast: UmbraSwatch
  condition: (newColor: UmbraSwatch, iterations?: number) => boolean
}

interface IncreaseContrast {
  color: UmbraSwatch
  contrast: UmbraSwatch
  power: number
}

const stored = {
  readability: defaultSettings.readability || 11
}

function apcaContrast(fg: string | UmbraSwatch, bg: string | UmbraSwatch) {
  const fgc = colord(fg).toRgb()
  const bgc = colord(bg).toRgb()
  return APCAcontrast(sRGBtoY([fgc.r, fgc.g, fgc.b]), sRGBtoY([bgc.r, bgc.g, bgc.b]))
}

export const getReadability = (fg: string | UmbraSwatch, bg: string | UmbraSwatch) => {
  const foreground = colord(fg);
  const background = colord(bg);
  const contrast = apcaContrast(foreground, background);
  return Math.abs(Number(contrast));
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

export function mostReadable(color: UmbraSwatch, colors: UmbraSwatch[]) {
  const readable = colors.map((c) => Math.abs(getReadability(color, c)))
  const index = readable.indexOf(Math.max(...readable))
  return colors[index]
}

export const pickContrast = (color: UmbraSwatch, scheme: UmbraAdjusted) => {
  return mostReadable(color, [
    scheme.background || colord('white'),
    scheme.foreground || colord('black')
  ])
}

export function colorMix(from: string | UmbraSwatch, to: string | UmbraSwatch, percent = 50) {
  const tinyFrom = colord(from)
  const tinyTo = colord(to)
  return colord(tinyFrom).mix(tinyTo, percent / 100)
}
