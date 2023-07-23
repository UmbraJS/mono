import tinycolor from "tinycolor2"
import { myriad } from '../..'
import { MyriadOutput, GeneratedColor } from '../../store/types'
import { attach } from "./attach"

type DynamicObject = {[key: number]: tinycolor.Instance}
type TinyColorArray = {name: string, value: tinycolor.Instance}[]

interface FormatProps {
  output: MyriadOutput;
  formater?: (color: tinycolor.Instance) => string;
  element: HTMLElement;
}

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

export const format = ({
  element,
  output = myriad().output,
  formater = hexFormat,
}: FormatProps) => {
  const gen = output.generated
  const formated = gen.map((c) => getColors(c.name, c, formater))

  return {
    attach: () => attach({formated, element}),
    output
  }
}