import { myriad } from '../..'
import { format, hexFormat } from "./format"
import { htmlElement } from "./attach"

export const apply = ({
  output = myriad().output,
  element = htmlElement,
  formater = hexFormat,
}) => {
  if(!element) return output
  format({output, formater}).attach(element)
  return output
}

export default apply
