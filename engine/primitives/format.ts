import tinycolor from "tinycolor2"
import { umbra } from '../..'
import { UmbraOutput, GeneratedColor, FormatedColor } from '../types'
import { attach } from "./attach"

export type Formater = (color: tinycolor.Instance) => string

interface FormatProps {
  output: UmbraOutput;
  formater?: Formater;
  element?: HTMLElement;
}

export interface Format extends UmbraOutputs {
  attach: (element?: HTMLElement) => UmbraOutputs;
}

export interface UmbraOutputs {
  flattened: FlattenColor[];
  formated: FormatedColor[];
  output: UmbraOutput;
}

export const format = ({
  output = umbra().output,
  formater = defaultFormater,
}: FormatProps) => {
  const gen = output.generated
  const formated = gen.map((c) => getColors(c.name, c, formater))
  const flattened = flattenColors({
    prefix: '--',
    formated,
  })

  const outputs: UmbraOutputs = {
    flattened,
    formated,
    output
  }

  return {
    attach: (element) => attach({outputs, element}),
    ...outputs
  } as Format
}

//Formating logic
type DynamicObject = {[key: number]: tinycolor.Instance}
type TinyColorArray = {name: string, value: tinycolor.Instance}[]


export const defaultFormater = hexFormat

export function hexFormat(color: tinycolor.Instance) {
  return color.toHexString()
}

export function rgbStrippedFormat(color: tinycolor.Instance) {
  const rgba = color.toRgb()
  return `${rgba.r} ${rgba.g} ${rgba.b}`
}

export function hslFormat(color: tinycolor.Instance) {
  return color.toHslString()
}

const makeTinycolorArray = (obj: DynamicObject): TinyColorArray => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {name: key, value: value}
  })
}

function getColors(name: string, color: GeneratedColor | undefined, formater = defaultFormater) {
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

  return sortFlattened(flattened)
}


function sortFlattened(flattened: FlattenColor[]) {
  const foregroundPrefix = "--foreground";
  const backgroundPrefix = "--background";
  
  // Extract foreground and background shades from the original array
  const background = flattened.filter(item => item.name.startsWith(backgroundPrefix));
  const foreground= flattened.filter(item => item.name.startsWith(foregroundPrefix));
  const rest = flattened.filter(item => !item.name.startsWith(backgroundPrefix) && !item.name.startsWith(foregroundPrefix));
    
  // Combine the sorted foreground and background shades to form the desired order
  const ordered = [
    ...background,
    ...foreground.reverse(),
    ...rest
  ];

  const filtered = ordered.filter(({name}) => !invalidColor(name))

  function invalidColor(name: string) {
    const regex = /(?:background|foreground).*contrast/i;
    return regex.test(name);
  }
  
  return filtered
}