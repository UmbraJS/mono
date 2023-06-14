//External dependencies 
import tinycolor from "tinycolor2"

//Internal dependencies
import { invert } from './primitives/utils'
import { getReadable } from './primitives/color'
import { defaultTheme, defaultScheme, settings } from './store'
import { MyriadScheme, AdjustedScheme, MyriadInput } from './store/types'

const fallback = tinycolor.random()
const defaultBG = tinycolor('white')

//instances
function bgInstance(scheme: MyriadScheme) {
  return scheme.hasOwnProperty('background')
    ? background(scheme)
    : background(defaultScheme)
}

//handlers
export const background = (scheme: MyriadScheme) => {
  //Makes sure there exists a backgrund color. Defaults to white
  return scheme.background ? tinycolor(scheme.background) : defaultBG
}

export const foreground = (scheme: MyriadScheme) => {
  //Adjusts the foreground and makes sure its readable against the background
  const contrast = bgInstance(scheme)

  const context = {
    color: tinycolor(scheme.foreground),
    contrast: contrast,
    readability: settings.readability || 5,
  }

  return tinycolor(scheme.foreground
    ? getReadable(context)
    : invert(contrast.clone()))
}

export const accent = (fl: string, theme: MyriadInput) => {
  //Adjusts the accent and makes sure its in contrast to BG and FG.
  //If no accent, generate a random one
  const context = {
    color: fl ? tinycolor(fl) : fallback,
    contrast: bgInstance(theme.scheme),
    readability: theme.settings?.readability || 5
  }

  return tinycolor(getReadable(context))
}

//composer
export let adjusted: AdjustedScheme | null = null
export const adjust = (theme = defaultTheme) => {
  //Gets the config and adjusts the colors according to
  //their relationship to each other so theres enough color contrasts
  let obj: AdjustedScheme = { origin: theme }

  console.log('adjusting', theme)

  obj.background = background(theme.scheme)
  obj.foreground = foreground(theme.scheme)
  obj.accents = theme.scheme.accents?.map((fl) => accent(fl, theme))
  obj.origin = theme
  
  adjusted = obj
  return obj
}