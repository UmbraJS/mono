import { AdjustedScheme, Myriad } from '../config'
import tinycolor from "tinycolor2"
export type Color = tinycolor.Instance
export type Colour = string | Color

export const getHSLA = (col: string, a = 0.6) => {
  const color = tinycolor(col);
  const alpha = color.setAlpha(a);
  const HSL = alpha.toHsl();
  const string = alpha.toHslString();
  return { string, HSL }
}


const checkReadability = (col: Colour, bg: Colour, mult = 1) => {
  return tinycolor.readability(col, bg) * mult
}

export const isDark = (col: Color) => {
  return tinycolor(col).isDark()
}


export const makeReadable = (color: string, Myriad: Myriad, readability = 1) => {
  let { background, foreground } = Myriad
  if(!background) background = tinycolor('white').toHexString()
  return contrastToMix({
    col: color,
    antithesis: foreground || background,
    catalyst: background
  }, readability)
}


export const converse = (col: Color, val = 100) => {
  return col.isDark() ? col.lighten(val) : col.darken(val)
}

export const pickContrast = (c: Color, scheme: AdjustedScheme) => {
  //returns either the background or the foreground
  //based on which is more readable against the accent
  const color = c.clone()
  var mostReadable = tinycolor.mostReadable(color, [
    scheme.background || tinycolor('white'),
    scheme.foreground || tinycolor('black'),
  ])
  return mostReadable
}

type ColorRange = {
  col: string, 
  antithesis: Colour, 
  catalyst: Colour
}

const contrastToMix = (props: ColorRange, readability = 0.01) => {
  const { col, antithesis, catalyst } = props
  let newColor = tinycolor(col)
  //mix in some catalyst until it contrasts antithesis enough for readability threshold

  let iterations = 0
  while (checkReadability(newColor, antithesis, 5) < readability && iterations < 50) {
    newColor = tinycolor.mix(newColor, catalyst, iterations)
    iterations++
  }

  return getReadable(newColor, catalyst, 5)
}


export const mixToShade = (color: Color, mixer: Color, readability = 1.5) => {
  let newColor = tinycolor.mix(color, mixer, 1)

  //mix mixer color into new color untill new color contrasts old color enough for readability threshold

  let iterations = 0
  while (checkReadability(newColor, color) < readability && iterations < 20) {
    newColor = tinycolor.mix(color, mixer, iterations)
    iterations++
  }
  
  return newColor.toHexString()
}


export const getReadable = (color: Colour, background: Colour, readability = 5) => {
  let newColor = tinycolor(color)

  //Change lightness value until color contrasts bg

  let iterations = 0
  while (checkReadability(newColor, background) < readability && iterations < 100) {
    newColor = converse(newColor, iterations)
    iterations++
  }
  return newColor.toHexString()
}


export const converseLuminance = (c: Color) => {
  let color = tinycolor(c)
  let prevColor = tinycolor(c)

  let iterations = 0
  while (isDark(color) === isDark(prevColor) && iterations < 100) {
    color = converse(color, iterations)
    iterations += 30
  }

  return color.toHexString()
}
