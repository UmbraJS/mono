import type { FlattenColor, UmbraOutputs } from './format'

//Why aliases? 2 reasons:
//1 - People seem to be better at understanding direct instructions rather than logic.
//2 - This lets us define a second dimension of attribution style to a color themes on top of the underlying foreground-background color readability dimension.

export type Alias = {
  [key: string]: string
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
//   buttonText: 'accent-text',
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
  alias?: Alias
  rangeMapping?: boolean
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
  if (oldTarget) {
    targets[oldTarget.index].iterations++
  } else {
    targets.push({ index: targets.length, selector: selector, iterations: 1 })
  }

  const targetIterations = oldTarget ? `${targets[oldTarget.index].iterations}` : '1'
  return `${targetIterations}-${iterations}`
}

export async function attach({ outputs, target, alias, rangeMapping = true }: Attach) {
  const meta = getMeta(target.selector)

  const colors = outputs.flattened.filter(({ name }) => !invalidColor(name))
  if (target.element) setElementColors(target.element, colors)
  if (target.selector) await setColorSheet(target.selector, colors, meta)

  if (alias) {
    const aliases = Object.entries(alias)
    const array = aliases.map(([key, value]) => ({ name: '--' + key, color: `var(--${value})` }))
    array.forEach((p) => target.element && setProperty(target.element, p))
    if (target.selector) await setAliasSheet(target.selector, array, meta)
  }

  if (rangeMapping && target.selector) {
    await setRangeMappingSheet(outputs, meta)
  }

  return outputs
}

function invalidColor(name: string) {
  const regex = /(?:background|foreground).*text/i
  return regex.test(name)
}

//sheet functions
interface MTS {
  meta?: string
  marker?: string
  selector?: string
}

async function makeThemeSheet(
  colors: FlattenColor[],
  { selector = ':root', meta = '1', marker = 'theme' }: MTS
) {
  const sheet = new CSSStyleSheet()
  await sheet.replace(
    `${marker}-${meta}, ${selector} {${colors
      .map(({ name, color }) => `${name}: ${color};`)
      .join('')}}`
  )
  return sheet
}

async function setColorSheet(selector = ':root', colors: FlattenColor[], meta?: string) {
  const marker = 'theme'
  const sheet = await makeThemeSheet(colors, { meta, marker, selector })
  setSheet(sheet, selector, marker)
}

async function setAliasSheet(selector = ':root', colors: FlattenColor[], meta?: string) {
  const marker = 'alias'
  const sheet = await makeThemeSheet(colors, { meta, marker, selector })
  setSheet(sheet, selector, marker)
}

async function setRangeMappingSheet(outputs: UmbraOutputs, meta?: string) {
  const marker = 'range-mapping'

  // Get all accent ranges (excluding base/background/foreground)
  const accentRanges = outputs.formated.filter(
    (range) => !['base', 'background', 'foreground'].includes(range.name)
  )

  // Generate CSS for all range mappings
  const mappingRules: string[] = []

  accentRanges.forEach((accent) => {
    const className = `.base-${accent.name}`
    const variables: string[] = []

    // Map base variables to accent variables
    variables.push(`--base: var(--${accent.name});`)

    // Map all 12 shade steps
    for (let i = 1; i <= 12; i++) {
      const step = i * 10
      variables.push(`--base-${step}: var(--${accent.name}-${step});`)
    }

    // Map text variable
    variables.push(`--base-text: var(--${accent.name}-text);`)

    mappingRules.push(`${className} { ${variables.join(' ')} }`)
  })

  // Create and apply the stylesheet
  if (mappingRules.length > 0) {
    const cssText = mappingRules.join('\n')
    const sheet = new CSSStyleSheet()
    await sheet.replace(`${marker}-${meta || '1'} { } ${cssText}`)
    setSheet(sheet, 'range-mapping', marker)
  }
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
    color: 'var(--base-text)'
  })
}
