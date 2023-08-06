import tinycolor from "tinycolor2"
import { umbra } from '../..'
import { UmbraOutput, RawRange, FormatedRange } from '../types'
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
  formated: FormatedRange[];
  output: UmbraOutput;
}

export const format = ({
  output = umbra().output,
  formater = defaultFormater,
}: FormatProps) => {
  const gen = output.ranges
  const formated = gen.map((c) => getColors(c, formater))

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

function getColors({ name, foreground, background, shades }: RawRange, formater = defaultFormater) {
  return {
    name: name,
    background: formater(background),
    shades: shades.map((c) => formater(c)),
    foreground: formater(foreground),
  }
}

export interface FlattenColor {
  name: string;
  color: string;
}

interface FlattenColors {
  formated: FormatedRange[];
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
    flattened.push({ name, color: c.background })
    flattened.push(...flattenShades(c.shades, name))
    flattened.push({
      name: name + '-foreground',
      color: c.foreground,
    })
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
  
  const background = flattened.filter(item => item.name.startsWith(backgroundPrefix));
  const foreground= flattened.filter(item => item.name.startsWith(foregroundPrefix));
  const rest = flattened.filter(item => !item.name.startsWith(backgroundPrefix) && !item.name.startsWith(foregroundPrefix));
    
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