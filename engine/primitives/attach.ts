import { SchemeKey } from '../types'
import { FlattenColor, UmbraOutputs } from './format'

//Why aliases? 2 reasons: 
//1 - People seem to be better at understanding direct instructions that actual logic. 
//2 - This lets us define a second dimention to a color theme on top of the underlying foreground-background scale. 
// Should borders be mid tones or bold accents? etc. 

export type Alias = {
  [key: string]: string
}

const defaultAliases = {
  //backgrounds
  backgroundSubtle: 'background-10',
  panelSubtle: 'background-10',
  panel: 'background-20',
  panelActive: 'background-30',
  
  //borders
  borderSubtle: 'background-30',
  border: 'foreground-30',
  borderHover: 'foreground-20',
  borderActive: 'foreground-10',

  //foregrounds
  text: 'foreground',
  textSubtle: 'foreground-30',
  textDisabled: 'background-30',

  //buttons
  buttonDisabled: 'background-30',
  buttonSubtle: 'accent-60',
  button: 'accent',
  buttonHover: 'accent-20',
  buttonActive: 'accent-10',

  buttonBorder: 'accent',
  buttonBorderHover: 'accent',
  buttonBorderActive: 'accent',

  buttonText: 'accent-contrast',
  buttonSubtleText: 'foreground',
  buttonDisabledText: 'foreground',
}

type AliasObject = {
  name: string,
  value: string
}

const makeAliasArray = (obj: Alias): AliasObject[] => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {name: key, value: value}
  })
}

export function attach({ outputs, element }: {outputs: UmbraOutputs, element?: HTMLElement | null}) {
  if(!document) return outputs

  setColors(outputs.flattened, element)
  setAliases(outputs.output.input.settings.aliases, element)
  
  if(!element) return outputs
  //Ensure that the foreground color is always set to the attached element
  setProperty(element, {
    name: 'color',
    color: 'var(--foreground)'
  })
  
  return outputs
}

function setColors(flattened: FlattenColor[], element?: HTMLElement | null) {
  const filtered = flattened.filter(({name}) => !invalidColor(name))
  function invalidColor(name: string) {
    const regex = /(?:background|foreground).*contrast/i;
    return regex.test(name);
  }
  element 
    ? setElementColors(element, filtered) 
    : setColorSheet(filtered)
}

function setColorSheet(flattened: FlattenColor[]) {
  const sheet = new CSSStyleSheet();
  sheet.replace(`:root {${flattened.map(({name, color}) => `${name}: ${color};`).join('')}}`);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

function setElementColors(element: HTMLElement, colors: FlattenColor[]) {
  colors.forEach(({ name, color }) => {
    setProperty(element, { name, color });
  })
}

function setAliases(aliases?: Alias | true, element?: HTMLElement | null) {
  if(!aliases) return
  const ali = aliases === true ? defaultAliases : aliases
  const aliasesArray = makeAliasArray(ali)
  element 
    ? setElementAliases(element, aliasesArray) 
    : setAliasesSheet(aliasesArray)
}

function setAliasesSheet(aliases: AliasObject[]) {
  function camelToVariable(name: string) {
    return "--" + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  const sheet = new CSSStyleSheet();
  sheet.replace(`:root {${aliases.map(({name, value}) => `${camelToVariable(name)}: var(--${value});`).join('')}}`);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

function setElementAliases(element: HTMLElement, aliases: AliasObject[]) {
  aliases.forEach(({name, value}) => {
    setProperty(element, {
      name: name,
      color: `var(--${value})`
    })
  })
}

interface SetProperty {
  name: SchemeKey; 
  color: string; 
}

const setProperty = (element: HTMLElement, { name, color }: SetProperty) => {
  element.style.setProperty(name, color)
}

