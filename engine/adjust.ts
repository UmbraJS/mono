//External dependencies 
import tinycolor from "tinycolor2"

//Internal dependencies
import { getReadable } from './primitives/color'
import { defaultTheme } from './store'
import { UmbraAdjusted } from './types'

const fallback = tinycolor.random()

//composer
export const adjust = (theme = defaultTheme): UmbraAdjusted => {
  const background = tinycolor(theme.scheme.background)
  const foreground = tinycolor(theme.scheme.foreground)
  const accents = theme.scheme.accents
  const readability = theme.settings.readability || 4
  return {
    input: theme,
    background: background,
    foreground: getReadable({ foreground, background, readability }),
    accents: accents.map((fl) => getReadable({
      foreground: tinycolor(fl),
      background, readability
    })),
  }
}