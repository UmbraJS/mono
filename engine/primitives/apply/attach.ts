import { SchemeKey } from '../../store/types'
import { FlattenColor } from './format'

export const htmlElement = typeof document === 'undefined' ? null : document.documentElement

export function attach({flattened, element = htmlElement}: {flattened: FlattenColor[], element?: HTMLElement | null}) {
  if(!element) return flattened

  flattened.forEach(({ name, color }) => {
    setProperty(element, { name, color });
  })

  //Ensure that the foreground color is always set to the attached element
  setProperty(element, {
    name: 'color',
    color: 'var(--foreground)'
  })

  return flattened
}

interface SetProperty {
  name: SchemeKey; 
  color: string; 
}

const setProperty = (element: HTMLElement, { name, color }: SetProperty) => {
  //TODO: use adoptedStyleSheets when support reaches 90% - current: 75% (2023-03-23) 
  //status: https://caniuse.com/mdn-api_document_adoptedstylesheets
  //guide https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
  element.style.setProperty(name, color)
}

