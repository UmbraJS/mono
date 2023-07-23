import { myriad } from '../..'
import { format, hexFormat } from "./format"

const htmlElement = typeof document === 'undefined' ? null : document.documentElement

export const apply = ({
  output = myriad().output,
  element = htmlElement,
  formater = hexFormat,
}) => {
  if(!element) return output
  format({element, output, formater}).attach()
  return output
}

export default apply
