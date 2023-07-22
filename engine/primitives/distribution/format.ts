import tinycolor from "tinycolor2"
import { myriad } from '../..'
import { MyriadGenerated, GeneratedColor, ColorList, CustomColor } from '../../store/types'
import { ColorObj } from "../../generator"

type DynamicObject = {[key: number]: tinycolor.Instance}
type TinyColorArray = {name: string, value: tinycolor.Instance}[]

export function hexFormat(color: tinycolor.Instance) {
  return color.toHexString()
}

const makeTinycolorArray = (obj: DynamicObject): TinyColorArray => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {name: key, value: value}
  })
}

function getCustomColorValue(value: CustomColor, scheme: MyriadGenerated): string {
  let color = value;
  const origin = scheme.input
  const isFunc = typeof value === 'function'
  if(isFunc) color = value(origin)
  return color as string
}

const generateCustomColors = (colors: ColorList, scheme: MyriadGenerated) => {
  const objArray = Object.entries(colors)
  return objArray.map(([key, value]) => {
    let color = getCustomColorValue(value, scheme)
    return {[key]: ColorObj({
      color: tinycolor(color),
      contrast: tinycolor(color)
    }, scheme.adjusted)}
  })      
}

//Turn tiny colors into actual colors 
function getCustomColors(scheme: MyriadGenerated, custom?: ColorList, formater = hexFormat) {
  if(!custom) return []
  const gen = generateCustomColors(custom, scheme)
  return gen.map((c) => {
    const key = Object.keys(c)[0]
    const value = Object.values(c)[0]
    return getColors(key, value, formater)
  })
}

function getAccentColors(accents: GeneratedColor[], formater = hexFormat) {
  return accents?.map((a) => getColors('accent', a, formater))
}

function getColors(name: string, color: GeneratedColor | undefined, formater = hexFormat) {
  const shades = makeTinycolorArray(color?.shades || {})
  return {
    name: name,
    color: formater(color?.color || tinycolor('black')),
    contrast: formater(color?.contrast || tinycolor('black')),
    shades: shades.map((s) => formater(s.value))
  }
}

export const format = ({
  scheme = myriad().colors,
  formater = hexFormat,
}) => {
  const custom = scheme.input.scheme.custom
  const { foreground, background, accents } = scheme
  if(!background || !foreground || !accents) return []
  return [
    getColors('foreground', foreground, formater),
    getColors('background', background, formater),
    ...getAccentColors(accents, formater),
    ...getCustomColors(scheme, custom, formater),
  ]
}