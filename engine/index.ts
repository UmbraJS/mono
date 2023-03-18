//Configs and Utilities
import { defaultScheme, Myriad, MyriadOutput  } from './config'
import { distributeScheme } from './primitives/distribution'

//Main functions
import { adjust } from "./adjust"
import { generate } from "./generator"

//Composition Functions
export const createScheme = (scheme?: Myriad): MyriadOutput => {
  return generate(adjust(scheme))
}

const htmlElement = typeof document === 'undefined' ? null : document.documentElement
export const colorBus = (scheme?: Myriad, element = htmlElement) => {
  const generated = createScheme(scheme)
  distributeScheme(generated, element)
  return generated
}

export const elementScheme = (scheme: Myriad, element: HTMLElement, id: string) => {
  //runs the colorBus on a subsceme 
  //and attaches it to an element
  let subSchemes = scheme.subSchemes
  if(subSchemes !== undefined) {
    colorBus(subSchemes[id], element)
  }
}

//For fetching the rootScheme result to use in Javascript elsewhere 
export const rootScheme = (scheme: Myriad) => {
  //Creates a root scheme with 
  //the neccesary root scheme checks
  let checkedScheme = scheme ? scheme : defaultScheme
  let warning = 'colorBus: No valid root scheme detected. Default scheme enabled. Make sure your passed scheme has a background property'
  
  if (!checkedScheme.background) {
    console.warn(warning)
    checkedScheme = defaultScheme
  }

  return createScheme(checkedScheme)
}

export default colorBus
