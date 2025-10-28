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
  mix: number | string           // Base mix percentage or relative (e.g., "+=40")
  hue?: number | string         // Independent hue mix percentage
  saturation?: number | string  // Independent saturation mix percentage
  lightness?: number | string   // Independent lightness mix percentage
}

/**
 * Parse a value that can be absolute (number) or relative (string like "+=40" or "-=40")
 * @param value - The value to parse
 * @param currentPercent - The current percentage (0-100) for relative calculations
 * @param min - Minimum allowed value (default 0)
 * @param max - Maximum allowed value (default 100)
 * @returns Resolved absolute percentage
 */
function parseRelativeValue(
  value: number | string,
  currentPercent: number,
  min = 0,
  max = 100
): number {
  if (typeof value === 'number') {
    return Math.max(min, Math.min(max, value)) // Clamp absolute value
  }

  // Parse relative values like "+=40" or "-=40"
  const match = value.match(/^([+-])=(\d+(?:\.\d+)?)$/)
  if (!match) {
    console.warn(`Invalid relative value: ${value}, treating as current (${currentPercent})`)
    return currentPercent
  }

  const [, operator, amount] = match
  const delta = parseFloat(amount)

  if (operator === '+') {
    return Math.min(max, currentPercent + delta)
  } else {
    return Math.max(min, currentPercent - delta)
  }
}

/**
 * Mix two colors with independent control over HSL channel interpolation
 * Supports both absolute and relative values for each channel
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

  // Parse the base mix value (could be relative, but starts at 0)
  const baseMix = parseRelativeValue(options.mix, 0)

  // For each channel, determine if it's relative or absolute
  // Relative values are relative to the START color's channel value mapped to 0-100 scale
  let hueMix: number
  let satMix: number
  let lightMix: number

  if (options.hue !== undefined) {
    // If hue is specified, parse it (could be relative or absolute)
    // For hue, we allow values outside 0-100 range for extrapolation
    if (typeof options.hue === 'number') {
      hueMix = options.hue / 100 // Don't clamp for hue
    } else {
      hueMix = parseRelativeValue(options.hue, baseMix) / 100
    }
  } else {
    // Default to base mix
    hueMix = baseMix / 100
  }

  if (options.saturation !== undefined) {
    // If saturation is specified, parse it
    satMix = parseRelativeValue(options.saturation, baseMix) / 100
  } else {
    // Default to base mix
    satMix = baseMix / 100
  }

  if (options.lightness !== undefined) {
    // If lightness is specified, parse it
    lightMix = parseRelativeValue(options.lightness, baseMix) / 100
  } else {
    // Default to base mix
    lightMix = baseMix / 100
  }

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
    s: Math.max(0, Math.min(100, interpolatedSat)),
    l: Math.max(0, Math.min(100, interpolatedLight)),
    a: fromHsl.a + ((toHsl.a - fromHsl.a) * hueMix) // Use hue mix for alpha
  })
}
