import tinycolor from "tinycolor2"
import { pickContrast, colorMix } from "./primitives/color"

import { 
  UmbraAdjusted, 
  UmbraOutput, 
  Shade,
  CustomColor,
  ColorList,
  UmbraInput,
  ColorObject,
} from "./types"

interface ColorRange {
  color: tinycolor.Instance,
  contrast: tinycolor.Instance,
}

function findContrast(color: tinycolor.Instance, adjusted: UmbraAdjusted) {
  return tinycolor.mostReadable(color, [
    adjusted.background || color,
    adjusted.foreground || color,
  ])
}

function shade(colors: ColorRange, range: (number | string)[]) {
  const { color, contrast } = colors

  const gr = getRange({
    from: color,
    to: contrast,
    range: range
  })

  return gr
}

interface Range { 
  from: tinycolor.Instance, 
  to: tinycolor.Instance, 
  range: Shade[] 
}

function getRange({ from, to, range }: Range) {
  const foreground = tinycolor(from)
  const background = tinycolor(to)

  const r = range.map((val) => {
    const isNumber = Boolean(typeof val === 'number')
    if(!isNumber) return tinycolor(val as string)
    return colorMix(foreground, background, val as number)
  })

  return r
}

const ColorObj = (colors: ColorRange, scheme: UmbraAdjusted, range: Shade[] = [10, 20, 50]) => ({
  color: colors.color,
  shades: shade(colors, range),
  contrast: pickContrast(colors.color, scheme)
  //TODO: add ratings object / or maybe make the rating a function
})

//something
function background(adjusted: UmbraAdjusted) {
  const shades = adjusted.input.settings?.background?.shade
  const { background, foreground } = adjusted
  return ColorObj({
    color: background, 
    contrast: foreground,
  }, adjusted, shades)
}

function foreground(adjusted: UmbraAdjusted) {
  const shades = adjusted.input.settings?.foreground?.shade
  const { background, foreground } = adjusted
  return ColorObj({
    color: foreground, 
    contrast: background
  }, adjusted, shades)
}

export function accentShades(adjusted: UmbraAdjusted) {
  const shades = adjusted.input.settings?.accents?.shade || []
  const settings = adjusted.input.settings
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

  return newShades
}

function accents(adjusted: UmbraAdjusted) {
  const range = accentShades(adjusted)

  return adjusted.accents.map((color) => {
    const background = adjusted.background
    return {
      color,
      shades: getRange({from: color, to: background, range}),
      contrast: pickContrast(color, adjusted)
    }
  }) 
}

function base(adjusted: UmbraAdjusted) {
  const range = accentShades(adjusted)
  const background = adjusted.background
  const foreground = adjusted.foreground
  return {
    background,
    shades: getRange({from: background, to: foreground, range}),
    foreground
  }
}

//something
function getCustomColorValue(value: CustomColor, obj: GeneratedObject) {
  let color = value;
  const origin = obj.input
  const isFunc = typeof value === 'function'
  if(isFunc) color = value(origin)
  return tinycolor(color as string)
}

const generateCustomColors = (colors: ColorList, obj: GeneratedObject) => {
  const adjusted = obj.adjusted
  const shades = accentShades(adjusted)
  const objArray = Object.entries(colors)
  return objArray.map(([key, value]) => {
    let color = getCustomColorValue(value, obj)
    const background = adjusted.background
    const object = ColorObj({color, contrast: background}, adjusted, shades)
    return {name: key, ...object}
  })
  
}

interface GeneratedObject {
  input: UmbraInput;
  adjusted: UmbraAdjusted;
  generated: {
    background: ColorObject,
    foreground: ColorObject,
    accents: ColorObject[],
  }
}

function formatScheme(obj: GeneratedObject): UmbraOutput  {
  const gen = obj.generated
  const accents = gen.accents || []
  const custom = obj.input.scheme.custom || {}
  return {
    input: obj.input,
    adjusted: obj.adjusted,
    generated: [
      { name: 'background', ...gen.background },
      { name: 'foreground', ...gen.foreground },
      ...accents.map((colors) => ({ name: 'accent', ...colors })),
      ...generateCustomColors(custom, obj),
    ],
  }
}

function newGenerate(adjusted: UmbraAdjusted) {
  const input = adjusted.input
  return {
    input,
    adjusted,
    generated: {
      base: base(adjusted),
      accents: accents(adjusted),
    }
  }
}

export function generate(adjusted: UmbraAdjusted) {
  const input = adjusted.input
  return formatScheme({
    input,
    adjusted,
    generated: {
      background: background(adjusted),
      foreground: foreground(adjusted),
      accents: accents(adjusted),
    }
  })
}