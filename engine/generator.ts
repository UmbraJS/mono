import tinycolor from "tinycolor2"
import { pickContrast, rangeShader } from "./primitives/color"
import { adjust } from "./adjust"

import { 
  MyriadAdjusted, 
  MyriadGenerated, 
  GeneratedColor, 
  DynamicObject,
  Shade
} from "./store/types"

interface ColorRange {
  color: tinycolor.Instance,
  contrast: tinycolor.Instance,
}

const isNumber = (value: string | number) => { 
  return Boolean(typeof value === 'number')
}

function shade(colors: ColorRange, range: (number | string)[]) {
  const { color, contrast } = colors
  let shades: DynamicObject = {}
  range.forEach((val, i) => {
    shades[i * 10 + 10] = isNumber(val) 
      ? rangeShader(color, contrast, val as number) 
      : tinycolor(val as string)
  })
  return shades
}

export const ColorObj = (colors: ColorRange, scheme: MyriadAdjusted, range: Shade[] = [10, 20, 50]): GeneratedColor => {
  //Generic color object with all its auto generated color variations
  return {
    color: colors.color,
    shade: shade(colors, range),
    contrast: pickContrast(colors.color, scheme)
    //TODO: add ratings object / or maybe make the rating a function
  }
}

function background(scheme: MyriadAdjusted) {
  if(!scheme.background) return
  const shades = scheme.input.settings?.background?.shade
  const { background, foreground } = scheme
  return ColorObj({
    color: background, 
    contrast: foreground || background,
  }, scheme, shades)
}

function foreground(scheme: MyriadAdjusted) {
  if(!scheme.foreground) return
  const shades = scheme.input.settings?.foreground?.shade
  const { background, foreground } = scheme
  return ColorObj({
    color: foreground, 
    contrast: background || foreground
  }, scheme, shades)
}

function accents(scheme: MyriadAdjusted): GeneratedColor[] | undefined {
  const settings = scheme.input.settings
  const shades = settings?.accents?.shade || []
  const foregroundShades = settings?.foreground?.shade || []
  const backgroundShades = settings?.background?.shade || []
  const numberOfShades = foregroundShades.length + backgroundShades.length || 6
  const fraction = 100 / numberOfShades

  const fallbackShades = Array.from({length: numberOfShades}, (_, i) => i * fraction + 10)
  const newShades = [...shades, ...fallbackShades]

  if(newShades.length > numberOfShades) {
    const diffirence = Math.abs(newShades.length - numberOfShades)
    newShades.splice(diffirence, diffirence)
  }

  return scheme.accents?.map((color) => {
    return ColorObj({color, contrast: tinycolor.mostReadable(color, [
      scheme.background || color,
      scheme.foreground || color,
    ])}, scheme, newShades)
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