// Configs and Utilities
import { changeSettings, settings, defaultScheme } from './store'
import type { MyriadGenerated, MyriadInput, MyriadSettings } from './store/types'
import { attach } from './primitives/distribution'
import { inverse, isDark } from './primitives/scheme'

// Main functions
import { adjust } from './adjust'
import { generate } from './generator'

export interface MyriadOutput {
  colors: MyriadGenerated
  settings?: MyriadSettings
  attach: (element?: HTMLElement) => MyriadOutput
  isDark: () => boolean
  inverse: () => MyriadOutput
}

export function myriadOutput(colors: MyriadGenerated): MyriadOutput {
  const theme = colors.input
  return {
    colors, 
    isDark: () => isDark(theme),
    inverse: () => myriad(inverse(theme).scheme, theme.settings),
    attach: (el?: HTMLElement) => attach(colors, el),
  }
}

export function myriad(scheme = defaultScheme, s = settings) {
  if(s) changeSettings(s)
  return myriadOutput(generate(adjust({
    scheme: scheme,
    settings: s,
  })))
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
  return myriad({
    ...theme.scheme,
  })
}

interface SubSchemeProps {
  id: string
  settings?: MyriadSettings
  element?: HTMLElement
}

export const subScheme = (input: MyriadInput, props: SubSchemeProps) => {
  const subSchemes = input.scheme.subSchemes
  if (subSchemes === undefined) return null
  const theme = subSchemes[props.id]
  return myriad(theme.scheme,  props.settings || theme.settings || input.settings)
}

export default myriad
