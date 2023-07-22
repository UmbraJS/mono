import tinycolor from "tinycolor2"
import { myriad, myriadOutput } from '../..'
import { MyriadGenerated, GeneratedColor, ColorList, CustomColor } from '../../store/types'
import { ColorObj } from "../../generator"

type DynamicObject = {[key: number]: tinycolor.Instance}
type TinyColorArray = {name: string, value: tinycolor.Instance}[]

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
function getCustomColors(scheme: MyriadGenerated, custom?: ColorList, format = colorFormat) {
  if(!custom) return []
  const gen = generateCustomColors(custom, scheme)
  return gen.map((c) => {
    const key = Object.keys(c)[0]
    const value = Object.values(c)[0]
    return {[key]: getColors(value, format)}
  })
}

function getAccentColors(accents: GeneratedColor[], format = colorFormat) {
  return accents?.map((a) => getColors(a, format))
}

function getColors(color: GeneratedColor | undefined, format = colorFormat) {
  const shades = makeTinycolorArray(color?.shade || {})
  return {
    color: format(color?.color || tinycolor('black')),
    contrast: format(color?.contrast || tinycolor('black')),
    shades: shades.map((s) => format(s.value))
  }
}

function colorFormat(color: tinycolor.Instance) {
  return color.toHexString()
}


export const formatOutput = ({
  scheme = myriad().colors,
  format = colorFormat,
}) => {
  const custom = scheme.input.scheme.custom
  const { foreground, background, accents } = scheme
  if(!background || !foreground || !accents) return myriadOutput(scheme)




  return {
    foreground: getColors(foreground, format),
    background: getColors(background, format),
    accents: getAccentColors(accents, format),
    custom: getCustomColors(scheme, custom, format),
  }
}