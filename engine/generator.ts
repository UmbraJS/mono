import tinycolor from "tinycolor2"
import { pickContrast, rangeShader } from "./primitives/color"
import { adjust } from "./adjust"

import { 
  MyriadAdjusted, 
  MyriadOutput, 
  Shade,
  CustomColor,
  ColorList,
  MyriadInput,
  ColorObject
} from "./store/types"

interface ColorRange {
  color: tinycolor.Instance,
  contrast: tinycolor.Instance,
}

//something
const isNumber = (value: string | number) => { 
  return Boolean(typeof value === 'number')
}

function shade(colors: ColorRange, range: (number | string)[]) {
  const { color, contrast } = colors
  let shades: tinycolor.Instance[] = []

  range.forEach((val, i) => {
    shades[i * 10 + 10] = isNumber(val) 
      ? rangeShader(color, contrast, val as number) 
      : tinycolor(val as string)
  })

  return shades
}

export const ColorObj = (colors: ColorRange, scheme: MyriadAdjusted, range: Shade[] = [10, 20, 50]) => ({
  color: colors.color,
  shades: shade(colors, range),
  contrast: pickContrast(colors.color, scheme)
  //TODO: add ratings object / or maybe make the rating a function
})

//something
function background(adjusted: MyriadAdjusted) {
  const shades = adjusted.input.settings?.background?.shade
  const { background, foreground } = adjusted
  return ColorObj({
    color: background, 
    contrast: foreground || background,
  }, adjusted, shades)
}

function foreground(adjusted: MyriadAdjusted) {
  const shades = adjusted.input.settings?.foreground?.shade
  const { background, foreground } = adjusted
  return ColorObj({
    color: foreground, 
    contrast: background || foreground
  }, adjusted, shades)
}

export function accentShades(adjusted: MyriadAdjusted, shades: Shade[] = []) {
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

function accents(adjusted: MyriadAdjusted) {
  const shades = adjusted.input.settings?.accents?.shade
  const newShades = accentShades(adjusted, shades)
  return adjusted.accents.map((color) => {
    return ColorObj({color, contrast: tinycolor.mostReadable(color, [
      adjusted.background || color,
      adjusted.foreground || color,
    ])}, adjusted, newShades)
  }) 
}

//something
function getCustomColorValue(value: CustomColor, obj: GeneratedObject): string {
  let color = value;
  const origin = obj.input
  const isFunc = typeof value === 'function'
  if(isFunc) color = value(origin)
  return color as string
}

const generateCustomColors = (colors: ColorList, obj: GeneratedObject) => {
  const adjusted = obj.adjusted
  const shades = accentShades(adjusted)
  const objArray = Object.entries(colors)
  return objArray.map(([key, value]) => {
    let color = getCustomColorValue(value, obj)
    return {name: key, ...ColorObj({
      color: tinycolor(color),
      contrast: tinycolor(color)
    }, adjusted, shades)}
  })
}

interface GeneratedObject {
  input: MyriadInput;
  adjusted: MyriadAdjusted;
  generated: {
    background: ColorObject,
    foreground: ColorObject,
    accents: ColorObject[],
  }
}

function formatScheme(obj: GeneratedObject): MyriadOutput  {
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

export const generate = (adjusted = adjust()): MyriadOutput => {
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