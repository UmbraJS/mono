import tinycolor from "tinycolor2"
import { settings } from '../store'
import { myriad } from '../'
import { MyriadInput, MyriadSettings } from '../store/types'

export type Color = tinycolor.Instance
export type Colour = string | Color

export const getHSLA = (col: string, a = 0.6) => {
  const color = tinycolor(col);
  const alpha = color.setAlpha(a);
  const HSL = alpha.toHsl();
  const string = alpha.toHslString();
  return { string, HSL }
}

//inversion tools
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

//random tools
export function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

interface RandomSettings extends MyriadSettings {
  amount: number
}

export function randomScheme(randomSettings: RandomSettings = { amount: 1 }): MyriadInput {
  const newSettings = { ...settings, ...randomSettings }
  return {
    settings: newSettings,
    scheme: {
      background: randomHex(),
      foreground: randomHex(),
      accents: Array.from({ length: randomSettings.amount }, () => randomHex()),
    },
  }
}

export function randomMyriad(props: RandomSettings = { amount: 1 }) {
  const theme = randomScheme(props)
  return myriad({
    ...theme.scheme,
  })
}
