import tinycolor from "tinycolor2"
import { mixToShade, pickContrast, rangeShader } from "./primitives/color"
import { adjust } from "./adjust"
import { AdjustedScheme, MyriadOutput, GenColor } from "./config"

interface ColorRange {
  color: tinycolor.Instance,
  antithesis: tinycolor.Instance,
}

function shade(colors: ColorRange) {
  //const faintness = 1.1
  const { color, antithesis } = colors
  return {
    30: rangeShader(color, antithesis, 10),
    50: rangeShader(color, antithesis, 30)
  }
}

//mixToShade(color, antithesis, 12.0),

export const ColorObj = (colors: ColorRange, scheme: AdjustedScheme): GenColor => {
  //Generic color object with all its auto generated color variations
  return {
    color: colors.color.toHexString(),
    shade: shade(colors),
    contrast: pickContrast(colors.color, scheme).toString()
  }
}

//generate colors
//export function generateColor(colors: ColorRange, scheme: AdjustedScheme) {
//  if(!colors.color) return
//  return ColorObj(colors, scheme)
//}

function background(scheme: AdjustedScheme) {
  if(!scheme.background) return
  const { background, foreground } = scheme
  return ColorObj({
    color: background, 
    antithesis: foreground || background
  }, scheme)
}

function foreground(scheme: AdjustedScheme) {
  if(!scheme.foreground) return
  const { background, foreground } = scheme
  return ColorObj({
    color: foreground, 
    antithesis: background || foreground
  }, scheme)
}

function accents(scheme: AdjustedScheme): GenColor[] | undefined {
  return scheme.accents?.map((fl) => {
    return ColorObj({
      color: fl, 
      antithesis: scheme.background || fl
    }, scheme)
  }) 
}

export let generated: MyriadOutput | null = null
export const generate = (scheme = adjust()): MyriadOutput => {
  //Gets the adjusted colors from the wrapper and generates more colors
  //assosiated with the root colors. Like, shadeded variations and accent contrast colors.
  const obj = {
    background: background(scheme),
    foreground: foreground(scheme),
    accents: accents(scheme),
    origin: scheme.origin,
  }

  generated = obj
  return obj
}