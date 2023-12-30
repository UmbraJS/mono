import { UmbraInput } from '../..'
import { FlattenColor, UmbraOutputs } from './format'

//Why aliases? 2 reasons:
//1 - People seem to be better at understanding direct instructions rather than logic.
//2 - This lets us define a second dimention of attribution style to a color themes on top of the underlying foreground-background color readability dimention.

export type Alias = {
  [key: string]: string
}

const defaultAliases = {
  background: 'base',
  'background-10': 'base-10',
  'background-20': 'base-20',
  'background-30': 'base-30',
  'background-40': 'base-40',

  'midground-50': 'base-40',
  'midground-60': 'base-50',
  'midground-70': 'base-60',
  'midground-80': 'base-70',

  'foreground-90': 'base-70',
  'foreground-100': 'base-80',
  'foreground-110': 'base-90',
  'foreground-120': 'base-100',
  foreground: 'base-contrast'
}

// const ActionAliases = {
//   //backgrounds
//   backgroundSubtle: 'base-10',
//   panelSubtle: 'base-10',
//   panel: 'base-20',
//   panelActive: 'base-30',

//   //borders
//   borderSubtle: 'base-30',
//   border: 'foreground-30',
//   borderHover: 'foreground-20',
//   borderActive: 'foreground-10',

//   //foregrounds
//   text: 'foreground',
//   textSubtle: 'foreground-30',
//   textDisabled: 'background-30',

//   //buttons
//   buttonDisabled: 'background-30',
//   buttonSubtle: 'accent-60',
//   button: 'accent',
//   buttonHover: 'accent-20',
//   buttonActive: 'accent-10',

//   //button borders
//   buttonBorder: 'accent',
//   buttonBorderHover: 'accent',
//   buttonBorderActive: 'accent',

//   //button text
//   buttonText: 'accent-contrast',
//   buttonSubtleText: 'foreground',
//   buttonDisabledText: 'foreground'
// }

interface Attach {
  input: UmbraInput
  outputs: UmbraOutputs
  element?: HTMLElement | null
  alias?: Alias | boolean
}

//main
export function attach({ input, outputs, element, alias }: Attach) {
  setColors(outputs.flattened, element)
  setAliases(alias || input.settings.aliases, element)

  if (!element) return outputs
  //Ensure that the foreground color is always set to the attached element
  setProperty(element, {
    name: 'color',
    color: 'var(--foreground)'
  })

  return outputs
}

//utils
interface SetProperty {
  name: 'foreground' | 'background' | 'accents' | string
  color: string
}

const setProperty = (element: HTMLElement, { name, color }: SetProperty) => {
  element.style.setProperty(name, color)
}

type AliasObject = {
  name: string
  value: string
}

const makeAliasArray = (obj: Alias): AliasObject[] => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return { name: key, value: value }
  })
}

function invalidColor(name: string) {
  const regex = /(?:background|foreground).*contrast/i
  return regex.test(name)
}

//attach colors
function setColors(flattened: FlattenColor[], element?: HTMLElement | null) {
  const filtered = flattened.filter(({ name }) => !invalidColor(name))
  element ? setElementColors(element, filtered) : setColorSheet(filtered)
}

function setColorSheet(flattened: FlattenColor[]) {
  const sheet = new CSSStyleSheet()
  sheet.replace(`:root {${flattened.map(({ name, color }) => `${name}: ${color};`).join('')}}`)
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
}

function setElementColors(element: HTMLElement, colors: FlattenColor[]) {
  colors.forEach(({ name, color }) => {
    setProperty(element, { name, color })
  })
}

//attach aliases
function setAliases(aliases?: Alias | true, element?: HTMLElement | null) {
  if (!aliases) return
  const ali = aliases === true ? defaultAliases : aliases
  const aliasesArray = makeAliasArray(ali)
  element ? setElementAliases(element, aliasesArray) : setAliasesSheet(aliasesArray)
}

function setAliasesSheet(aliases: AliasObject[]) {
  function camelToVariable(name: string) {
    return '--' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  const sheet = new CSSStyleSheet()
  sheet.replace(
    `:root {${aliases
      .map(({ name, value }) => `${camelToVariable(name)}: var(--${value});`)
      .join('')}}`
  )
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
}

function setElementAliases(element: HTMLElement, aliases: AliasObject[]) {
  aliases.forEach(({ name, value }) => {
    setProperty(element, {
      name: name,
      color: `var(--${value})`
    })
  })
}
