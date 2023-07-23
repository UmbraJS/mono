import tinycolor from "tinycolor2"
import { myriad } from '../..'
import { MyriadOutput, GeneratedColor, FormatedColor } from '../../store/types'
import { attach } from "./attach"

export type Formater = (color: tinycolor.Instance) => string

interface FormatProps {
  output: MyriadOutput;
  formater?: Formater;
  element: HTMLElement;
}

export const format = ({
  element,
  output = myriad().output,
  formater = hexFormat,
}: FormatProps) => {
  const gen = output.generated
  const formated = gen.map((c) => getColors(c.name, c, formater))
  const flattened = flattenColors({
    prefix: '--',
    formated,
  })

  return {
    attach: () => attach({flattened, element}),
    flattened,
    formated,
    output
  }
}

//Formating logic
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

function getColors(name: string, color: GeneratedColor | undefined, formater = hexFormat) {
  const shades = makeTinycolorArray(color?.shades || {})
  return {
    name: name,
    color: formater(color?.color || tinycolor('black')),
    contrast: formater(color?.contrast || tinycolor('black')),
    shades: shades.map((s) => formater(s.value))
  }
}

//Flatten logic
export interface FlattenColor {
  name: string;
  color: string;
}

interface FlattenColors {
  formated: FormatedColor[];
  prefix?: string | false;
}

function flattenColors({formated, prefix}: FlattenColors) {
  const flattened: FlattenColor[] = []


  function prefixName(name: string) {
    return prefix ? prefix + name : name
  }

  let existingAccents = 0
  function getName(name: string) {
    const prefixed = prefixName(name)
    if(name !== "accent") return prefixed
    existingAccents++
    if(existingAccents > 1) return prefixed + existingAccents
    else return prefixed
  }


  formated.forEach((c) => {
    const name = getName(c.name)
    const color = c.color

    flattened.push({ name, color })
    flattened.push({
      name: name + '-contrast',
      color: c.contrast,
    })

    flattened.push(...flattenShades(c.shades, name))    
  })

  function flattenShades(shades: any[], name: string) {
    return shades.map((shade, i) => {
      const token = (+i + 1) * 10
       return {
        name: name + '-' + token,
        color: shade,
      }
    })
  }

  return flattened
}
