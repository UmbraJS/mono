//External dependencies 
import tinycolor from "tinycolor2"

//Internal dependencies
import { converse, getReadable, makeReadable } from './primitives/color'
import { defaultScheme, Myriad, AdjustedScheme } from './config'

const background = (scheme: Myriad) => {
  //Makes sure there exists a backgrund color. Defaults to white
  return scheme.background ? tinycolor(scheme.background) : tinycolor('white')
}

const foreground = (scheme: Myriad) => {
  //Adjusts the foreground and makes sure its readable against the background
  let readability = scheme.readability || defaultScheme.readability || 5

  const bg = scheme.hasOwnProperty('background')
    ? background(scheme)
    : background(defaultScheme)

  const computedForeground = scheme.foreground
    ? getReadable(tinycolor(scheme.foreground), bg, readability)
    : converse(bg.clone())

  return tinycolor(computedForeground)
}

export const accent = (fl: string, scheme: Myriad, fallback = tinycolor.random().toHexString()) => {
  //Adjusts the accent and makes sure its in contrast to BG and FG.
  //If no accent, generate a random one
  const fg = scheme.hasOwnProperty('foreground')
    ? foreground(scheme)
    : foreground(defaultScheme)

  const bg = scheme.hasOwnProperty('background')
    ? background(scheme)
    : background(defaultScheme)

  const context: Myriad = {
    foreground: fg.toHexString(),
    background: bg.toHexString(),
  }

  return fl
    ? tinycolor(makeReadable(fl, context))
    : tinycolor(makeReadable(fallback, context))
}

//export const adjustColors = (scheme = defaultScheme) => {
//  if(!scheme.accents && !scheme.settings.length) return
//  return scheme.settings?.map((s) => accent(s, scheme))
//}

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