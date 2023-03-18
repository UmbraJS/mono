import tinycolor from "tinycolor2"
import { createScheme } from '..'
import { MyriadOutput, GenColor, ColorList, customColor } from '../config'
import  { accent, adjusted } from "../adjust"
import { ColorObj } from "../generator"

const htmlElement = typeof document === 'undefined' ? null : document.documentElement

export const distributeScheme = (
  scheme = createScheme(),
  element = htmlElement,
) => {
  const { background, foreground, accents } = scheme
  if(!background || !element) return
  setBackground({background, element})
  setForeground({foreground, element})
  setAccents({accents, element})
  setOthers(scheme, element)
  //This line makes sure that subschemes change their color if needed
  setProperty('color', 'var(--foreground)', element)
}

const setProperty = (name: string, value: string, element: HTMLElement) => {
  element.style.setProperty(name, value)
}

const setOthers = (scheme: MyriadOutput, element: HTMLElement) => {
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

const setBackground = (props: {background: GenColor, element: HTMLElement}) => {
  const { background, element } = props
  if(!background) return
  setProperty('--background', background.color, element)
  setProperty('--shade', background.shade, element)
  setProperty('--shade-faint', background.shade2, element)
}

const setForeground = (props: {foreground?: GenColor, element: HTMLElement}) => {
  const { foreground, element } = props
  if(!foreground) return
  setProperty('--foreground', foreground.color, element)
  setProperty('--foreground-shade', foreground.shade, element)
  setProperty('--foreground-shade-faint', foreground.shade2, element)
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
  let vName = '--' + name
  let id = index > 0 ? index : ''
  setProperty(vName + id, fl.color, element)
  setProperty(vName + id + '-shade', fl.shade, element)
  setProperty(vName + id + '-shade-faint', fl.shade2, element)
  setProperty(vName + id + '-contrast', fl.contrast, element)
}

export default distributeScheme
