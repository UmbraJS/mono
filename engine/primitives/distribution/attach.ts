import { SchemeKey, FormatedColor } from '../../store/types'

interface SetProps {
  color?: FormatedColor;
  element: HTMLElement;
}

const setProperty = (name: SchemeKey, value: string, element: HTMLElement) => {
  //TODO: use adoptedStyleSheets when support reaches 90% - current: 75% (2023-03-23) 
  //status: https://caniuse.com/mdn-api_document_adoptedstylesheets
  //guide https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
  element.style.setProperty(name, value)
}

function setAllShades(name: SchemeKey, {color, element}: SetProps) {
  if(!color) return
  Array.from(Object.entries(color.shades)).forEach((shade) => {
    const key = shade[0]
    const value = shade[1]
    const token = (+key + 1) * 10
    const n = '--' + name + '-' + token
    setProperty(n, value, element)
  })
}

function setContrast(name: SchemeKey | string, {color, element}: SetProps) {
  if(!color) return
  const bgfg = name === 'foreground' || name === 'background'
  if(!bgfg) setProperty('--' + name + '-contrast', color.contrast, element)
}

const setColor = (name: SchemeKey, { color, element }: SetProps) => {
  if(!color) return
  if(color instanceof Array) return
  setProperty('--' + name, color.color, element);
  setContrast(name, {color, element})
  setAllShades(name, {color, element})
}

export function attach({formated, element}: {formated: FormatedColor[], element: HTMLElement}) {
  let existingAccents = 0
  function getName(name: string) {
    if(name === "accent") {
      existingAccents++
      if(existingAccents > 1)
      name = "accent" + existingAccents
    }
    return name
  }

  //TODO: make an array of all css variables. And then use that array to set all variables instead

  formated.forEach((c) => {
    const name = getName(c.name)
    setColor(name, {
      color: c,
      element,
    })
  })

  //Ensure that the foreground color is always set to the attached element
  setProperty('color', 'var(--foreground)', element)
}
