import { colord, Colord } from 'colord'
import { settings } from '../defaults'
import { umbra } from '../'
import { UmbraInput, UmbraSettings } from '../types'

//inversion tools
const invert = (color: Colord, val = 100) => {
  return color.isDark() ? color.lighten(val) : color.darken(val)
}

export const converseLuminance = (c: Colord) => {
  let color = colord(c)
  let prevColor = colord(c)

  let iterations = 0
  while (color.isDark() === prevColor.isDark() && iterations < 100) {
    color = invert(color, iterations)
    iterations += 30
  }

  return color.toRgbString()
}

//random tools
export function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

interface RandomSettings extends UmbraSettings {
  amount: number
}

export function randomScheme(randomSettings: RandomSettings = { amount: 1 }): UmbraInput {
  return {
    settings: { ...settings, ...randomSettings },
    scheme: {
      background: randomHex(),
      foreground: randomHex(),
      accents: Array.from({ length: randomSettings.amount }, () => randomHex())
    }
  }
}

export function randomUmbra(props: RandomSettings = { amount: 1 }) {
  const theme = randomScheme(props)
  return umbra({
    ...theme.scheme
  })
}
