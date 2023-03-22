//External dependencies 
import tinycolor from "tinycolor2"

//Internal dependencies
import { invert } from './primitives/utils'
import { getReadable } from './primitives/color'
import { defaultScheme, settings } from './store'
import { Myriad, AdjustedScheme } from './store/types'

const fallback = tinycolor.random()
const defaultBG = tinycolor('white')

//instances
function bgInstance(scheme: Myriad) {
  return scheme.hasOwnProperty('background')
    ? background(scheme)
    : background(defaultScheme)
}

//handlers
const background = (scheme: Myriad) => {
  //Makes sure there exists a backgrund color. Defaults to white
  return scheme.background ? tinycolor(scheme.background) : defaultBG
}

const foreground = (scheme: Myriad) => {
  //Adjusts the foreground and makes sure its readable against the background
  const contrast = bgInstance(scheme)

  const context = {
    color: tinycolor(scheme.foreground),
    contrast: contrast,
    readability: settings.readability || 5
  }

  return tinycolor(scheme.foreground
    ? getReadable(context)
    : invert(contrast.clone()))
}

export const accent = (fl: string, scheme: Myriad) => {
  //Adjusts the accent and makes sure its in contrast to BG and FG.
  //If no accent, generate a random one
  const context = {
    color: fl ? tinycolor(fl) : fallback,
    contrast: bgInstance(scheme),
    readability: settings.readability || 5
  }

  return tinycolor(getReadable(context))
}

//composer
export let adjusted: AdjustedScheme | null = null
export const adjust = (scheme = defaultScheme) => {
  //Gets the config and adjusts the colors according to
  //their relationship to each other so theres enough color contrasts
  let obj: AdjustedScheme = { origin: scheme }

  obj.background = background(scheme)
  obj.foreground = foreground(scheme)
  obj.accents = scheme.accents?.map((fl) => accent(fl, scheme))
  obj.origin = scheme
  
  adjusted = obj
  return obj
}