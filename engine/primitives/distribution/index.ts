import { myriad, myriadOutput } from '../..'
import { format, hexFormat } from "./format"
import { attach } from "./attach"

const htmlElement = typeof document === 'undefined' ? null : document.documentElement

export const apply = ({
  scheme = myriad().colors,
  element = htmlElement,
  formater = hexFormat,
}) => {
  const output = myriadOutput(scheme)
  const { foreground, background, accents } = scheme
  if(!background || !foreground || !accents || !element) return output

  //[x]: translate colors to hex
  //[0]: set colors as css variables
  //[0]: attach css variables to element

  const formated = format({scheme, formater})

  attach({formated, element})

  return output
}

export default apply
