import type { FlattenColor, UmbraOutputs } from './format'

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

  const colors = outputs.flattened.filter(({ name }) => !invalidColor(name))
  if (target.element) setElementColors(target.element, colors)
  if (target.selector) setColorSheet(target.selector, colors, meta)

  if (alias) {
    const aliases = Object.entries(alias === true ? defaultAliases : alias)
    const array = aliases.map(([key, value]) => ({ name: '--' + key, color: `var(--${value})` }))
    if (target.element) setElementAliases(target.element, array)
    if (target.selector) setAliasSheet(target.selector, array, meta)
  }

  return outputs
}

function invalidColor(name: string) {
  const regex = /(?:background|foreground).*contrast/i
  return regex.test(name)
}

//sheet functions

interface MTS {
  meta?: string
  marker?: string
  selector?: string
}

function makeThemeSheet(
  colors: FlattenColor[],
  { selector = ':root', meta = '1', marker = 'theme' }: MTS
) {
  const sheet = new CSSStyleSheet()
  sheet.replace(
    `${marker}-${meta}, ${selector} {${colors
      .map(({ name, color }) => `${name}: ${color};`)
      .join('')}}`
  )
  return sheet
}

function setColorSheet(selector = ':root', colors: FlattenColor[], meta?: string) {
  const marker = 'theme'
  const sheet = makeThemeSheet(colors, { meta, marker, selector })
  setSheet(sheet, selector, marker)
}

function setAliasSheet(selector = ':root', colors: FlattenColor[], meta?: string) {
  const marker = 'alias'
  const sheet = makeThemeSheet(colors, { meta, marker, selector })
  setSheet(sheet, selector, marker)
}

function setSheet(sheet: CSSStyleSheet, selector: string, marker = 'theme') {
  //this is only possible because of ...spreading the adoptedStylesheets.
  //Normally, you can't access the cssRules of an adopted stylesheet
  const filtered = [...document.adoptedStyleSheets].filter((sheet) => {
    const includesMarker = sheet.cssRules[0].cssText.includes(marker)
    const sameTarget = sheet.cssRules[0].cssText.includes(selector)
    return !includesMarker || !sameTarget
  })
  document.adoptedStyleSheets = [...filtered, sheet]
}

//element functions

interface SetProperty {
  name: 'foreground' | 'background' | 'accents' | string
  color: string
}

const setProperty = (element: HTMLElement, { name, color }: SetProperty) => {
  element.style.setProperty(name, color)
}

function setElementColors(element: HTMLElement | null, colors: FlattenColor[]) {
  if (!element) return
  colors.forEach(({ name, color }) => setProperty(element, { name, color }))
  //Ensure that the foreground color is always set to the attached element
  setProperty(element, {
    name: 'color',
    color: 'var(--base-contrast)'
  })
}

function setElementAliases(element: HTMLElement | null, aliases: FlattenColor[]) {
  element && aliases.forEach((p) => setProperty(element, p))
}
