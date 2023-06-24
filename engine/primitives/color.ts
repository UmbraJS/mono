import { MyriadAdjusted } from '../store/types'
import { settings } from '../store'
import tinycolor from "tinycolor2"
//import { calcAPCA  } from 'apca-w3';

export type Color = tinycolor.Instance
export type Colour = string | Color

type ColorRange = {
  color: Color
  contrast: Color
  readability?: number
  iterations?: number
}

interface increaseContrastUntil {
  color: Color
  contrast?: Color
  max?: number
  condition: (newColor: tinycolor.Instance, iterations?: number) => boolean,
}

interface MoveAwayFrom {
  color: Color
  contrast?: Color
  val: number
}

const stored = {
  readability: settings.readability || 11,
  iterations: settings.iterations || 15,
}

// type RGB = [number, number, number]

// function APCAcolor(color: Colour): RGB {
//   const rgba = tinycolor(color).toRgb()
//   return [rgba.r, rgba.g, rgba.b]
// }

export const getReadability = (col: Colour, bg: Colour) => {
  //TODO: use APCA to calculate contrast
  //let contrastLc = calcAPCA(APCAcolor(col), APCAcolor(bg));
  return tinycolor.readability(col, bg)
}

export const getReadable = ({color, contrast, readability, iterations}: ColorRange) => {
  const safeReadability = readability || stored.readability
  const max = iterations || stored.iterations
  return increaseContrastUntil({color, contrast, max, condition: (c) => {
    const current = getReadability(c, contrast)
    return current > safeReadability
  }})
}

export function increaseContrastUntil({ color, contrast, condition, max = 15 }: increaseContrastUntil) {
  let newColor = color
  let iterations = 0
  while (!condition(newColor, iterations) && iterations < max) {
    iterations += 1
    newColor = increaseContrast({
      val: iterations,
      color: newColor,
      contrast,
    })
  }
  return newColor
}

const increaseContrast = ({color, contrast, val = 100}: MoveAwayFrom) => {
  const same = contrast ? color.isDark() === contrast.isDark() : true
  return same
    ? color.isDark() ? color.lighten(val) : color.darken(val)
    : contrast?.isDark() ? color.lighten(val) : color.darken(val)
}

export const pickContrast = (c: Color, scheme: MyriadAdjusted) => {
  //returns either the background or the foreground
  //based on which is more readable against the accent
  const color = c.clone()
  var mostReadable = tinycolor.mostReadable(color, [
    scheme.background || tinycolor('white'),
    scheme.foreground || tinycolor('black'),
  ])
  return mostReadable
}

export function rangeShader(color: Color, mixer: Color, percent = 50) {
  return tinycolor.mix(color, mixer, percent)
}
