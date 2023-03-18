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
  const { background, accents } = scheme
  if(!background || !element) return
  //setBackground({background, element})
  //setForeground({foreground, element})

  setColor('background', {
    color: scheme.background, element,
  })

  setColor('foreground', {
    color: scheme.foreground, element,
  })

  setAccents({accents, element})
  setCustom(scheme, element)
  //This line makes sure that subschemes change their color if needed
  setProperty('color', 'var(--foreground)', element)
}

const setProperty = (name: string, value: string, element: HTMLElement) => {
  element.style.setProperty(name, value)
}

const setCustom = (scheme: MyriadOutput, element: HTMLElement) => {
  const custom = scheme.origin.custom
  if(!scheme.foreground || !custom) return

  const makeArray = (obj: ColorList): ColorList[] => {
    const objArray = Object.entries(obj)
    return objArray.map(([key, value]) => {
      return {[key]: value}
    })
  }

  const generateCustomColors = (array: ColorList[]) => {
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

  const customColors = generateCustomColors(makeArray(custom))
  customColors.forEach((c) => {
    const key = Object.keys(c)[0]
    const value = Object.values(c)[0]
    let newColor = tinycolor(value)
    if(!adjusted) return
    const gen = ColorObj({
      color: newColor,
      antithesis: newColor
    }, adjusted)
    setAccent(0, gen, element, key)
  })

}

// function isArray(obj: any) {
//   return Array.isArray(obj)
// }

// function isObject(obj: any) {
//   return typeof obj === 'object'
// }

const setColor = (name: SchemeKey | string, { color, element }: {color?: GenColor, element: HTMLElement}) => {
  if(!color) return
  if(color instanceof Array) return
  setProperty('--' + name, color.color, element)
  setProperty('--' + name + '-contrast', color.contrast, element)
  Array.from(Object.entries(color.shade)).forEach((shade) => {
    const k = shade[0]
    const value = shade[1]
    setProperty('--' + name + '-' + k, value, element)
  })
}

interface AccentsInterface {
  accents?: GenColor[]
  element: HTMLElement
}

const setAccents = (props: AccentsInterface) => {
  const { accents, element } = props
  if(!accents) return
  accents.forEach((fl: GenColor, index: number) => {
    setAccent(index, fl, element)
  })
}

const setAccent = (index = 0, fl: GenColor, element: HTMLElement, name = "accent") => {
  let id = index > 0 ? index : ''
  setColor(name + id, {
    color: fl,
    element,
  })
}

export default distributeScheme
