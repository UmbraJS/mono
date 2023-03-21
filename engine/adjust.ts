//External dependencies 
import tinycolor from "tinycolor2"

//Internal dependencies
import { converse, getReadable, makeReadable } from './primitives/color'
import { defaultScheme, settings } from './store'
import { Myriad, AdjustedScheme } from './store/types'

const fallback = tinycolor.random().toHexString()
const defaultBG = tinycolor('white')

//instances
function bgInstance(scheme: Myriad) {
  return scheme.hasOwnProperty('background')
    ? background(scheme)
    : background(defaultScheme)
}

function fgInstance(scheme: Myriad) {
  return scheme.hasOwnProperty('foreground')
    ? foreground(scheme)
    : foreground(defaultScheme)
}

//handlers
const background = (scheme: Myriad) => {
  //Makes sure there exists a backgrund color. Defaults to white
  return scheme.background ? tinycolor(scheme.background) : defaultBG
}

const foreground = (scheme: Myriad) => {
  //Adjusts the foreground and makes sure its readable against the background
  let readability = settings.readability || 5
  const bg = bgInstance(scheme)
  return tinycolor(scheme.foreground
    ? getReadable(scheme.foreground, bg, readability)
    : converse(bg.clone()))
}

export const accent = (fl: string, scheme: Myriad) => {
  //Adjusts the accent and makes sure its in contrast to BG and FG.
  //If no accent, generate a random one
  const context: Myriad = {
    foreground: fgInstance(scheme).toHexString(),
    background: bgInstance(scheme).toHexString(),
  }

  return fl
    ? tinycolor(makeReadable(fl, context))
    : tinycolor(makeReadable(fallback, context))
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