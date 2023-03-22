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

export const invert = (color: Color, val = 100) => {
  return color.isDark() ? color.lighten(val) : color.darken(val)
}

export const converseLuminance = (c: Color) => {
  let color = tinycolor(c)
  let prevColor = tinycolor(c)

  let iterations = 0
  while (color.isDark() === prevColor.isDark() && iterations < 100) {
    color = invert(color, iterations)
    iterations += 30
  }

  return color.toHexString()
}
