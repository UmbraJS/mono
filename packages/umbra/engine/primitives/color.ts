import { swatch, extend } from '../../swatch'
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
  const fgc = swatch(fg).toRgb()
  const bgc = swatch(bg).toRgb()
  return APCAcontrast(sRGBtoY([fgc.r, fgc.g, fgc.b]), sRGBtoY([bgc.r, bgc.g, bgc.b]))
}

export const getReadability = (fg: string | UmbraSwatch, bg: string | UmbraSwatch) => {
  const foreground = swatch(fg);
  const background = swatch(bg);
  const contrast = apcaContrast(foreground, background);
  return Math.abs(Number(contrast));
}

export const getReadable = (props: ColorRawRange) => {
  const foreground = swatch(props.foreground)
  const background = swatch(props.background)

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
    scheme.background || swatch('white'),
    scheme.foreground || swatch('black')
  ])
}

export function colorMix(from: string | UmbraSwatch, to: string | UmbraSwatch, percent = 50) {
  const tinyFrom = swatch(from)
  const tinyTo = swatch(to)
  return swatch(tinyFrom).mix(tinyTo, percent / 100)
}

export interface HSLMixOptions {
  mix: number           // Base mix percentage
  hue?: number         // Independent hue mix percentage (overrides mix if provided)
  saturation?: number  // Independent saturation mix percentage (overrides mix if provided)
  lightness?: number   // Independent lightness mix percentage (overrides mix if provided)
}

/**
 * Mix two colors with independent control over HSL channel interpolation
 */
export function colorMixHSL(
  from: string | UmbraSwatch,
  to: string | UmbraSwatch,
  options: number | HSLMixOptions
): UmbraSwatch {
  // If just a number, use standard mix
  if (typeof options === 'number') {
    return colorMix(from, to, options)
  }

  const fromColor = swatch(from)
  const toColor = swatch(to)

  const fromHsl = fromColor.toHsl()
  const toHsl = toColor.toHsl()

  // Get mix percentages for each channel (default to base mix if not specified)
  const hueMix = (options.hue ?? options.mix) / 100
  const satMix = (options.saturation ?? options.mix) / 100
  const lightMix = (options.lightness ?? options.mix) / 100

  // Interpolate each channel independently
  // For hue, handle circular interpolation (0-360 degrees)
  let interpolatedHue: number
  const hueDiff = toHsl.h - fromHsl.h

  // Take the shorter path around the color wheel
  if (Math.abs(hueDiff) <= 180) {
    interpolatedHue = fromHsl.h + (hueDiff * hueMix)
  } else {
    // Wrap around the other direction
    const adjustedDiff = hueDiff > 0 ? hueDiff - 360 : hueDiff + 360
    interpolatedHue = (fromHsl.h + (adjustedDiff * hueMix) + 360) % 360
  }

  const interpolatedSat = fromHsl.s + ((toHsl.s - fromHsl.s) * satMix)
  const interpolatedLight = fromHsl.l + ((toHsl.l - fromHsl.l) * lightMix)

  return swatch({
    h: interpolatedHue,
    s: interpolatedSat,
    l: interpolatedLight,
    a: fromHsl.a + ((toHsl.a - fromHsl.a) * hueMix) // Use hue mix for alpha
  })
}
