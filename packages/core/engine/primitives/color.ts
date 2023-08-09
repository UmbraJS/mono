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

interface increaseContrastUntil {
  color: Color
  contrast?: Color
  max?: number
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

export const getReadability = (fg: Colour, bg: Colour, wcag = true) => {
  return wcag ? tinycolor.readability(fg, bg) : apcaContrast(fg, bg)
}

export const getReadable = ({ foreground, background, readability, iterations }: ColorRawRange) => {
  const color = tinycolor(foreground)
  const contrast = tinycolor(background)
  const safeReadability = readability || stored.readability
  const max = iterations || stored.iterations
  return increaseContrastUntil({
    color,
    contrast,
    max,
    condition: (c) => {
      const current = getReadability(c, background)
      return current > safeReadability
    }
  })
}

export function increaseContrastUntil({
  color,
  contrast,
  condition,
  max = 15
}: increaseContrastUntil) {
  let newColor = color
  let iterations = 0
  while (!condition(newColor, iterations) && iterations < max) {
    iterations += 1
    newColor = increaseContrast({
      val: iterations,
      color: newColor,
      contrast
    })
  }
  return newColor
}

// function lightReverse(color: Color, val: number) {
//   return color?.isDark() ? color.lighten(val) : color.darken(val)
// }

// const increaseContrast = ({ color, contrast, val = 100 }: MoveAwayFrom) => {
//   const same = contrast ? color.isDark() === contrast.isDark() : true
//   return same ? lightReverse(color, val) : lightReverse(contrast || color, val)
// }

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
