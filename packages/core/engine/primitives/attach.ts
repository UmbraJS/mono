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

interface Targets {
  element?: HTMLElement | null
  selector?: string
}

interface Attach {
  outputs: UmbraOutputs
  target: Targets
  alias?: Alias | boolean
}

let iterations = 0
let targets: {
  index: number
  selector: string
  iterations: number
}[] = []

function getMeta(selector?: string) {
  if (!selector) return undefined
  iterations++
  const oldTarget = targets.find((t) => t.selector === selector)
  oldTarget
    ? targets[oldTarget.index].iterations++
    : targets.push({ index: targets.length, selector: selector, iterations: 1 })

  const targetIterations = oldTarget ? `${targets[oldTarget.index].iterations}` : '1'
  return `${targetIterations}-${iterations}`
}

export function attach({ outputs, target, alias }: Attach) {
  const meta = getMeta(target.selector)

  const filtered = outputs.flattened.filter(({ name }) => !invalidColor(name))
  if (target.element) setElementColors(target.element, filtered)
  if (target.selector) setColorSheet(target.selector, filtered, meta)

  if (alias) {
    const ali = alias === true ? defaultAliases : alias
    const aliasesArray = makeAliasArray(ali)
    if (target.element) setElementAliases(target.element, aliasesArray)
    if (target.selector) setAliasesSheet(target.selector, aliasesArray, meta)
  }

  return outputs
}

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

function setColorSheet(selector = ':root', flattened: FlattenColor[], meta?: string) {
  const sheet = new CSSStyleSheet()
  sheet.replace(
    `theme-${meta}, ${selector} {${flattened
      .map(({ name, color }) => `${name}: ${color};`)
      .join('')}}`
  )
  setSheet(sheet, selector)
}

function setElementColors(element: HTMLElement | null, colors: FlattenColor[]) {
  if (!element) return
  colors.forEach(({ name, color }) => setProperty(element, { name, color }))
  //Ensure that the foreground color is always set to the attached element
  setProperty(element, {
    name: 'color',
    color: 'var(--foreground)'
  })
}

function setAliasesSheet(selector = ':root', aliases: AliasObject[], meta?: string) {
  function camelToVariable(name: string) {
    return '--' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  const sheet = new CSSStyleSheet()
  sheet.replace(
    `theme-alias-${meta}, :${selector} {${aliases
      .map(({ name, value }) => `${camelToVariable(name)}: var(--${value});`)
      .join('')}}`
  )

  setSheet(sheet, selector)
}

function setElementAliases(element: HTMLElement | null, aliases: AliasObject[]) {
  if (!element) return
  aliases.forEach(({ name, value }) => {
    setProperty(element, {
      name: name,
      color: `var(--${value})`
    })
  })
}

function setSheet(sheet: CSSStyleSheet, selector: string) {
  //this is only possible because of ...spreading the adoptedStylesheets.
  //Normally, you can't access the cssRules of an adopted stylesheet
  const filtered = [...document.adoptedStyleSheets].filter((sheet) => {
    const includesUmbra = sheet.cssRules[0].cssText.includes('theme')
    const sameTarget = sheet.cssRules[0].cssText.includes(selector)
    return !includesUmbra || !sameTarget
  })
  document.adoptedStyleSheets = [...filtered, sheet]
}
