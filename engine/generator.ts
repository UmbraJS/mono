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
function background(scheme: MyriadAdjusted) {
  const shades = scheme.input.settings?.background?.shade
  const { background, foreground } = scheme
  return ColorObj({
    color: background, 
    contrast: foreground || background,
  }, scheme, shades)
}

function foreground(scheme: MyriadAdjusted) {
  const shades = scheme.input.settings?.foreground?.shade
  const { background, foreground } = scheme
  return ColorObj({
    color: foreground, 
    contrast: background || foreground
  }, scheme, shades)
}

function accents(scheme: MyriadAdjusted) {
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

  return scheme.accents.map((color) => {
    return ColorObj({color, contrast: tinycolor.mostReadable(color, [
      scheme.background || color,
      scheme.foreground || color,
    ])}, scheme, newShades)
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
  const objArray = Object.entries(colors)
  return objArray.map(([key, value]) => {
    let color = getCustomColorValue(value, obj)
    return {name: key, ...ColorObj({
      color: tinycolor(color),
      contrast: tinycolor(color)
    }, obj.adjusted)}
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

export const generate = (scheme = adjust()): MyriadOutput => {
  return formatScheme({
    input: scheme.input,
    adjusted: scheme,
    generated: {
      background: background(scheme),
      foreground: foreground(scheme),
      accents: accents(scheme),
    }
  })
}