import tinycolor from "tinycolor2"
import { pickContrast, rangeShader } from "./primitives/color"
import { adjust } from "./adjust"
import { AdjustedScheme, MyriadOutput, GenColor, DynamicObject } from "./config"

interface ColorRange {
  color: tinycolor.Instance,
  antithesis: tinycolor.Instance,
}

function shade(colors: ColorRange, range = [30, 50]) {
  const { color, antithesis } = colors
  let shades: DynamicObject = {}
  range.forEach((val, i) => {
    shades[i * 10 + 10] = rangeShader(color, antithesis, val)
  })
  return shades
}

export const ColorObj = (colors: ColorRange, scheme: AdjustedScheme, range = [30, 50]): GenColor => {
  //Generic color object with all its auto generated color variations
  return {
    color: colors.color.toHexString(),
    shade: shade(colors, range),
    contrast: pickContrast(colors.color, scheme)
  }
}

function background(scheme: AdjustedScheme) {
  if(!scheme.background) return
  const { background, foreground } = scheme
  return ColorObj({
    color: background, 
    antithesis: foreground || background,
  }, scheme, [10, 30])
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
  return scheme.accents?.map((color) => {
    const antithesis = tinycolor.mostReadable(color, [
      scheme.background || color,
      scheme.foreground || color,
    ])
    return ColorObj({color, antithesis }, scheme)
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