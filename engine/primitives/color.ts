import { AdjustedScheme } from '../store/types'
import { settings } from '../store'
import tinycolor from "tinycolor2"
export type Color = tinycolor.Instance
export type Colour = string | Color

type ColorRange = {
  color: Color
  contrast: Color
  readability?: number
  iterations?: number
}

const stored = {
  readability: settings.readability || 11,
  iterations: settings.iterations || 15,
}

const checkReadability = (col: Colour, bg: Colour) => {
  return tinycolor.readability(col, bg)
}

export const getReadable = (props: ColorRange) => {
  const readability = props.readability || stored.readability
  const max = props.iterations || stored.iterations
  const { color, contrast } = props
  let newColor = tinycolor(color)

  function readable() {
    const current = checkReadability(newColor, contrast)
    return current > readability
  }

  let iterations = 0
  while (!readable() && iterations < max) {
    newColor = moveAwayFromContrast(newColor, contrast, iterations)
    iterations += 1
  }

  return newColor.toHexString()
}

export const moveAwayFromContrast = (color: Color, contrast: Color, val = 100) => {
  const colorDark = color.isDark()
  const contrastDark = contrast.isDark()
  const isSame = colorDark === contrastDark
  return isSame 
    ? colorDark ? color.lighten(val) : color.darken(val)
    : contrastDark ? color.lighten(val) : color.darken(val)
}

export const pickContrast = (c: Color, scheme: AdjustedScheme) => {
  //returns either the background or the foreground
  //based on which is more readable against the accent
  const color = c.clone()
  var mostReadable = tinycolor.mostReadable(color, [
    scheme.background || tinycolor('white'),
    scheme.foreground || tinycolor('black'),
  ])
  return mostReadable.toString()
}

export function rangeShader(color: Color, mixer: Color, percent = 50) {
  return tinycolor.mix(color, mixer, percent).toHexString()
}
