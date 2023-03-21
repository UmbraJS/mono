//Configs and Utilities
import { defaultScheme, changeSettings, SettingsType } from './store'
import { Myriad, MyriadOutput } from './store/types'
import { distributeScheme } from './primitives/distribution'

//Main functions
import { adjust } from "./adjust"
import { generate } from "./generator"

//Composition Functions
export const createScheme = (scheme?: Myriad): MyriadOutput => {
  return generate(adjust(scheme))
}

interface Props {
  element?: HTMLElement
  settings?: SettingsType
}

export const myriad = (scheme?: Myriad, props?: Props) => {
  if(props?.settings) changeSettings(props?.settings)
  const generated = createScheme(scheme)
  distributeScheme(generated, props?.element)
  return generated
}

function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

export function randomMyriad(element?: HTMLElement, accents = 1) {
  //Generates a random scheme
  const scheme = {
    background: randomHex(),
    foreground: randomHex(),
    accents: Array.from({ length: accents }, () => randomHex()),
  }
  return myriad(scheme, {element})
}

interface SubSchemeProps extends Props {
  id: string
  element: HTMLElement
  settings?: SettingsType
}

export const subScheme = (scheme: Myriad, props: SubSchemeProps) => {
  //runs the myriad on a subsceme 
  //and attaches it to an element
  let subSchemes = scheme.subSchemes
  if(subSchemes !== undefined) {
    myriad(subSchemes[props.id], props)
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
