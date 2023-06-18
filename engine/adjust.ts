//External dependencies 
import tinycolor from "tinycolor2"

//Internal dependencies
import { invert } from './primitives/utils'
import { getReadable } from './primitives/color'
import { defaultTheme } from './store'
import { MyriadAdjusted, MyriadInput } from './store/types'

const fallback = tinycolor.random()
const defaultBG = tinycolor('white')

//instances
function bgInstance(theme: MyriadInput) {
  return theme.scheme.hasOwnProperty('background')
    ? background(theme)
    : background(defaultTheme)
}

//handlers
export const background = (theme: MyriadInput) => {
  //Makes sure there exists a backgrund color. Defaults to white
  return theme.scheme.background ? tinycolor(theme.scheme.background) : defaultBG
}

export const foreground = (theme: MyriadInput) => {
  //Adjusts the foreground and makes sure its readable against the background
  const contrast = bgInstance(theme)

  const context = {
    color: tinycolor(theme.scheme.foreground),
    contrast: contrast,
    readability: theme.settings.readability || 5,
  }

  return tinycolor(theme.scheme.foreground
    ? getReadable(context)
    : invert(contrast.clone()))
}

export const accent = (fl: string, theme: MyriadInput) => {
  //Adjusts the accent and makes sure its in contrast to BG and FG.
  //If no accent, generate a random one
  return tinycolor(getReadable({
    color: fl ? tinycolor(fl) : fallback,
    contrast: bgInstance(theme),
    readability: theme.settings?.readability || 5
  }))
}

//composer
export const adjust = (theme = defaultTheme): MyriadAdjusted => {
  //Gets the config and adjusts the colors according to
  //their relationship to each other so theres enough color contrasts
  return {
    background: background(theme),
    foreground: foreground(theme),
    accents: theme.scheme.accents?.map((fl) => accent(fl, theme)),
    input: theme,
  }
}