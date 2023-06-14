// Configs and Utilities
import { changeSettings, settings, defaultTheme } from './store'
import type { GenScheme, MyriadInput, MyriadScheme, MyriadSettings } from './store/types'
import { attach } from './primitives/distribution'
import { inverse, isDark } from './primitives/scheme'

// Main functions
import { adjust } from './adjust'
import { generate } from './generator'

export interface MyriadOutput {
  colors: GenScheme
  settings?: MyriadSettings
  attach: (element?: HTMLElement) => MyriadOutput
  isDark: () => boolean
  inverse: () => MyriadOutput
}

export function myriadOutput(colors: GenScheme): MyriadOutput {
  return {
    colors, 
    isDark: () => isDark(colors.origin),
    inverse: () => myriad(inverse(colors.origin)),
    attach: (element?: HTMLElement): MyriadOutput => {
      return attach(colors, element)
    },
  }
}

function format(theme: MyriadInput | MyriadScheme, settings: MyriadSettings): MyriadInput {
  const hasScheme = theme.hasOwnProperty('scheme')
  if(hasScheme) return theme as MyriadInput
  const scheme = theme as MyriadScheme
  return { scheme, settings } as MyriadInput
}

type t = MyriadInput | MyriadScheme

export function myriad(t: t = defaultTheme, s = settings) {
  const theme = format(t, s)
  if(theme.settings) changeSettings(theme.settings)
  const colors = generate(adjust(theme))
  return myriadOutput(colors)
}

export function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

interface RandomMyriadProps extends MyriadSettings {
  amount: number
}

export function randomScheme(props: RandomMyriadProps = { amount: 1 }): MyriadInput {
  const scheme = {
    background: randomHex(),
    foreground: randomHex(),
    accents: Array.from({ length: props.amount }, () => randomHex()),
  }

  return {
    scheme,
    settings: {
      ...settings,
      ...props,
    },
  }
}

export function randomMyriad(props: RandomMyriadProps = { amount: 1 }) {
  const theme = randomScheme(props)
  return myriad(theme)
}

interface SubSchemeProps {
  id: string
  settings?: MyriadSettings
  element?: HTMLElement
}

export const subScheme = (input: MyriadInput, props: SubSchemeProps) => {
  const subSchemes = input.scheme.subSchemes
  if (subSchemes === undefined) return null
  const scheme = subSchemes[props.id]
  return myriad({
    ...scheme,
    settings: props.settings || scheme.settings || input.settings,
  })
}

export default myriad
