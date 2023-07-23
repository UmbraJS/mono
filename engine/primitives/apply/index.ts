import { myriad } from '../..'
import { format, defaultFormater } from "./format"
import { htmlElement } from "./attach"

export const apply = ({
  output = myriad().output,
  element = htmlElement,
  formater = defaultFormater,
}) => {
  if(!element) return output
  format({output, formater}).attach(element)
  return output
}

export default apply
