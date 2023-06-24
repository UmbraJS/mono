import tinycolor from "tinycolor2"
import { pickContrast, rangeShader } from "./primitives/color"
import { adjust } from "./adjust"
import { settings } from "./store"
import { 
  MyriadAdjusted, 
  MyriadGenerated, 
  GeneratedColor, 
  DynamicObject 
} from "./store/types"

interface ColorRange {
  color: tinycolor.Instance,
  contrast: tinycolor.Instance,
}

function shade(colors: ColorRange, range = [30, 50]) {
  const { color, contrast } = colors
  let shades: DynamicObject = {}
  range.forEach((val, i) => {
    shades[i * 10 + 10] = rangeShader(color, contrast, val)
  })
  return shades
}

export const ColorObj = (colors: ColorRange, scheme: MyriadAdjusted, range = [20, 50]): GeneratedColor => {
  //Generic color object with all its auto generated color variations
  return {
    color: colors.color,
    shade: shade(colors, range),
    contrast: pickContrast(colors.color, scheme)
    //add ratings object / or maybe make the rating a function
  }
}

function background(scheme: MyriadAdjusted) {
  if(!scheme.background) return
  const { background, foreground } = scheme
  return ColorObj({
    color: background, 
    contrast: foreground || background,
  }, scheme, settings?.background?.shade)
}

function foreground(scheme: MyriadAdjusted) {
  if(!scheme.foreground) return
  const { background, foreground } = scheme
  return ColorObj({
    color: foreground, 
    contrast: background || foreground
  }, scheme, settings?.foreground?.shade)
}

function accents(scheme: MyriadAdjusted): GeneratedColor[] | undefined {
  return scheme.accents?.map((color) => {
    return ColorObj({color, contrast: tinycolor.mostReadable(color, [
      scheme.background || color,
      scheme.foreground || color,
    ])}, scheme, settings?.foreground?.shade)
  }) 
}

export const generate = (scheme = adjust()): MyriadGenerated => {
  //Gets the adjusted colors from the wrapper and generates more colors
  //assosiated with the root colors. Like, shadeded variations and accent contrast colors.
  return {
    background: background(scheme),
    foreground: foreground(scheme),
    accents: accents(scheme),
    input: scheme.input,
    adjusted: scheme
  }
}