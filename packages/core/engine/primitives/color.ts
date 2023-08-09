import tinycolor from 'tinycolor2'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { UmbraAdjusted } from '../types'
import { settings } from '../store'

export type Color = tinycolor.Instance
export type Colour = string | Color

type ColorRawRange = {
  foreground: Colour
  background: Colour
  readability?: number
  iterations?: number
}

interface IncreaseContrastUntil {
  color: Color
  contrast?: Color
  iterations?: number
  condition: (newColor: tinycolor.Instance, iterations?: number) => boolean
}

interface MoveAwayFrom {
  color: Color
  contrast?: Color
  val: number
}

const stored = {
  readability: settings.readability || 11,
  iterations: settings.iterations || 15
}

function apcaContrast(fg: Colour, bg: Colour) {
  const fgc = tinycolor(fg).toRgb()
  const bgc = tinycolor(bg).toRgb()
  return APCAcontrast(sRGBtoY([fgc.r, fgc.g, fgc.b]), sRGBtoY([bgc.r, bgc.g, bgc.b]))
}

export const getReadability = (fg: Colour, bg: Colour, wcag = false) => {
  return wcag ? tinycolor.readability(fg, bg) : apcaContrast(fg, bg)
}

export const getReadable = ({ foreground, background, readability, iterations }: ColorRawRange) => {
  const color = tinycolor(foreground)
  const contrast = tinycolor(background)
  return increaseContrastUntil({
    color,
    contrast,
    iterations: iterations || stored.iterations,
    condition: (c) => {
      const current = Math.abs(getReadability(c, background))
      return current > (readability || stored.readability)
    }
  })
}

export function increaseContrastUntil({
  color,
  contrast,
  condition,
  iterations = 15
}: IncreaseContrastUntil) {
  let newColor = color
  let count = 0
  while (!condition(newColor, count) && count < iterations) {
    count += 1
    newColor = increaseContrast({
      val: iterations,
      color: newColor,
      contrast
    })
  }
  return newColor
}

const increaseContrast = ({ color, contrast, val = 100 }: MoveAwayFrom) => {
  const same = contrast ? color.isDark() === contrast.isDark() : true
  return same
    ? color.isDark()
      ? color.lighten(val)
      : color.darken(val)
    : contrast?.isDark()
    ? color.lighten(val)
    : color.darken(val)
}

export const pickContrast = (c: Color, scheme: UmbraAdjusted) => {
  const color = c.clone()
  return tinycolor.mostReadable(color, [
    scheme.background || tinycolor('white'),
    scheme.foreground || tinycolor('black')
  ])
}

export function colorMix(from: Colour, to: Colour, percent = 50) {
  const tinyFrom = tinycolor(from)
  const tinyTo = tinycolor(to)
  return tinycolor.mix(tinyFrom, tinyTo, percent)
}
