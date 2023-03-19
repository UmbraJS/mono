import tinycolor from "tinycolor2"
import { createScheme } from '..'
import { MyriadOutput, SchemeKey, GenColor, ColorList, customColor } from '../config'
import  { accent, adjusted } from "../adjust"
import { ColorObj } from "../generator"

const htmlElement = typeof document === 'undefined' ? null : document.documentElement

export const distributeScheme = (
  scheme = createScheme(),
  element = htmlElement,
) => {
  const { foreground, background, accents } = scheme
  if(!background || !element) return

  setColor('background', {
    color: background, element,
  })

  setColor('foreground', {
    color: foreground, element,
  })

  accents?.forEach((fl: GenColor, index: number) => {
    setAccent(index, fl, element)
  })

  setCustom(scheme, element)

  //This line makes sure that subschemes change their color if needed
  setProperty('color', 'var(--foreground)', element)
}

const setProperty = (name: SchemeKey, value: string, element: HTMLElement) => {
  element.style.setProperty(name, value)
}

const makeArray = (obj: ColorList): ColorList[] => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {[key]: value}
  })
}

const setCustom = (scheme: MyriadOutput, element: HTMLElement) => {
  const custom = scheme.origin.custom
  if(!scheme.foreground || !custom) return

  const genCustomColors = (array: ColorList[]) => {
    return array.map((obj) => {
      const key = Object.keys(obj)[0]
      const value = Object.values(obj)[0]
      return {[key]: getColorValue(value)}
    })
  }

  const getColorValue = (value: customColor) => {
    let color = value ? value : 'black'
    const origin = scheme.origin
    typeof value === 'function'
      ? color = value(origin)
      : color = accent(value, origin).toHexString()
    return color
  }

  const colorArray = makeArray(custom)
  const customColors = genCustomColors(colorArray)
  customColors.forEach((c) => {
    if(!adjusted) return
    const key = Object.keys(c)[0]
    const value = Object.values(c)[0]
    const color = {
      color: tinycolor(value),
      antithesis: tinycolor(value)
    }
    setAccent(0, ColorObj(color, adjusted), element, key)
  })

}

interface SetProps {
  color?: GenColor,
  element: HTMLElement
}

const setColor = (name: SchemeKey, { color, element }: SetProps) => {
  if(!color) return
  if(color instanceof Array) return
  setProperty('--' + name, color.color, element)
  setContrast(name, {color, element})
  setAllShade(name, {color, element})
}

function setAllShade(name: SchemeKey, {color, element}: SetProps) {
  if(!color) return
  Array.from(Object.entries(color.shade)).forEach((shade) => {
    const k = shade[0]
    const value = shade[1]
    setProperty('--' + name + '-' + k, value, element)
  })
}

function setContrast(name: SchemeKey | string, {color, element}: SetProps) {
  if(!color) return
  const bgfg = name === 'foreground' || name === 'background'
  //const value = color.contrast === 
  if(!bgfg) setProperty('--' + name + '-contrast', color.contrast, element)
}

const setAccent = (index = 0, fl: GenColor, element: HTMLElement, name = "accent") => {
  let id = index > 0 ? index : ''
  setColor(name + id, {
    color: fl,
    element,
  })
}

export default distributeScheme
