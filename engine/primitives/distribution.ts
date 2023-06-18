import tinycolor from "tinycolor2"
import { myriad, myriadOutput } from '..'
import { MyriadGenerated, SchemeKey, GeneratedColor, ColorList, customColor } from '../store/types'
import  { accent } from "../adjust"
import { ColorObj } from "../generator"

const htmlElement = typeof document === 'undefined' ? null : document.documentElement

export const attach = (
  scheme = myriad().colors,
  element = htmlElement,
) => {
  const { foreground, background, accents } = scheme
  if(!background || !element) return myriadOutput(scheme)

  setColor('background', {
    color: background, element,
  })

  setColor('foreground', {
    color: foreground, element,
  })

  accents?.forEach((fl: GeneratedColor, index: number) => {
    setAccent(index, fl, element)
  })

  setCustom(scheme, element)

  //This line makes sure that subschemes change their color if needed
  setProperty('color', 'var(--foreground)', element)
  return myriadOutput(scheme)
}

const setProperty = (name: SchemeKey, value: string, element: HTMLElement) => {
  //TODO: use adoptedStyleSheets when support reaches 90% - current: 75% (2023-03-23) 
  //status: https://caniuse.com/mdn-api_document_adoptedstylesheets
  //guide https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
  element.style.setProperty(name, value)
}

const makeArray = (obj: ColorList): ColorList[] => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {[key]: value}
  })
}

const setCustom = (scheme: MyriadGenerated, element: HTMLElement) => {
  const custom = scheme.input.scheme.custom
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
    const origin = scheme.input
    typeof value === 'function'
      ? color = value(origin)
      : color = accent(value, origin).toHexString()
    return color
  }

  const colorArray = makeArray(custom)
  const customColors = genCustomColors(colorArray)
  customColors.forEach((c) => {
    const key = Object.keys(c)[0]
    const value = Object.values(c)[0]
    const color = {
      color: tinycolor(value),
      antithesis: tinycolor(value)
    }
    setAccent(0, ColorObj(color, scheme.adjusted), element, key)
  })

}

interface SetProps {
  color?: GeneratedColor,
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
  if(!bgfg) setProperty('--' + name + '-contrast', color.contrast, element)
}

const setAccent = (index = 0, fl: GeneratedColor, element: HTMLElement, name = "accent") => {
  let id = index > 0 ? index : ''
  setColor(name + id, {
    color: fl,
    element,
  })
}

export default attach
