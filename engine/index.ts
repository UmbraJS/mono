//Configs and Utilities
import { changeSettings, settings } from './store'
import { Myriad, MyriadSettings, GenScheme } from './store/types'
import { attach } from './primitives/distribution'
import { inverse, isDark } from './primitives/scheme'

//Main functions
import { adjust } from "./adjust"
import { generate } from "./generator"

export interface MyriadOutput {
  colors: GenScheme
  settings?: MyriadSettings
  attach: (element?: HTMLElement) => MyriadOutput
  isDark: () => boolean
  inverse: () => MyriadOutput
}

interface Props {
  element?: HTMLElement
  settings?: MyriadSettings
}

export function myriadOutput(colors: GenScheme): MyriadOutput {
  return {
    colors: colors,
    attach: (element?: HTMLElement): MyriadOutput => {
      return attach(colors, element)
    },
    isDark: () => isDark(colors),
    inverse: () => myriad(inverse(colors.origin)),
  }
}

export const myriad = (scheme?: Myriad, settings?: MyriadSettings) => {
  if(settings) changeSettings(settings)
  const colors = generate(adjust(scheme))
  return myriadOutput(colors)
}

export function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

interface RandomMyriadProps extends MyriadSettings {
  amount: number
}

export function randomScheme(props: RandomMyriadProps = { amount: 1 }) {
  const scheme = {
    background: randomHex(),
    foreground: randomHex(),
    accents: Array.from({ length: props.amount }, () => randomHex()),
  }

  return {
    scheme: scheme,
    settings: {
      ...settings,
      ...props
    }
  }
}

export function randomMyriad(props: RandomMyriadProps = { amount: 1 }) {
  const {scheme, settings} = randomScheme(props)
  return myriad(scheme, settings)
}

interface SubSchemeProps extends Props {
  id: string
  settings?: MyriadSettings
}

export const subScheme = (scheme: Myriad, props: SubSchemeProps) => {
  let subSchemes = scheme.subSchemes
  if(subSchemes === undefined) return null
  return myriad(subSchemes[props.id], props.settings)
}

export default myriad
