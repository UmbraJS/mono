//Configs and Utilities
import { defaultScheme, changeSettings, settings } from './store'
import { Myriad, MyriadSettings, GenScheme } from './store/types'
import { distributeScheme } from './primitives/distribution'
import { inverse, isDark } from './primitives/scheme'

//Main functions
import { adjust } from "./adjust"
import { generate } from "./generator"

export interface MyriadOutput {
  colors: GenScheme
  isDark: () => boolean
  inverse: () => MyriadOutput
}

//Composition Functions
export const createScheme = (scheme?: Myriad): MyriadOutput => {
  const colors = generate(adjust(scheme))
  return {
    colors: colors,
    isDark: () => isDark(colors),
    inverse: () => inverse(colors),
  }
}
interface Props {
  element?: HTMLElement
  settings?: MyriadSettings
}

export const myriad = (scheme?: Myriad, settings?: MyriadSettings) => {
  if(settings) changeSettings(settings)
  const generated = createScheme(scheme)
  distributeScheme(generated.colors, settings?.element)
  return generated
}

function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

interface RandomMyriadProps extends MyriadSettings {
  amount: number
}

export function randomMyriad(props: RandomMyriadProps = { amount: 1 }) {
  //Generates a random scheme
  const scheme = {
    background: randomHex(),
    foreground: randomHex(),
    accents: Array.from({ length: props.amount }, () => randomHex()),
  }
  return myriad(scheme, {
    ...settings,
    ...props
  })
}

interface SubSchemeProps extends Props {
  id: string
  element: HTMLElement
  settings?: MyriadSettings
}

export const subScheme = (scheme: Myriad, props: SubSchemeProps) => {
  //runs the myriad on a subsceme
  //and attaches it to an element
  let subSchemes = scheme.subSchemes
  if(subSchemes !== undefined) {
    return myriad(subSchemes[props.id], props)
  } else {
    return null
  }
}

//For fetching the rootScheme result to use in Javascript elsewhere 
export const rootScheme = (scheme: Myriad) => {
  //Creates a root scheme with 
  //the neccesary root scheme checks
  let checkedScheme = scheme ? scheme : defaultScheme
  let warning = 'myriad: No valid root scheme detected. Default scheme enabled. Make sure your passed scheme has a background property'
  
  if(!checkedScheme.background) {
    console.warn(warning)
    checkedScheme = defaultScheme
  }

  return createScheme(checkedScheme)
}

export default myriad
