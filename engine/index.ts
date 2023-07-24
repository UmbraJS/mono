// Configs and Utilities
import { settings, defaultScheme } from './store'
import type { MyriadOutput, MyriadInput, MyriadSettings } from './store/types'

//Primitives
import { apply } from './primitives/apply'
import { format, FormatObject, Formater } from './primitives/apply/format'
import { inverse, isDark } from './primitives/scheme'

// Main functions
import { adjust } from './adjust'
import { generate } from './generator'

export interface Myriad {
  output: MyriadOutput
  apply: (element?: HTMLElement, formater?: Formater) => MyriadOutput
  format: (formater?: Formater) => FormatObject
  inverse: () => Myriad,
  isDark: () => boolean
}

export function myriadObject(generated: MyriadOutput): Myriad {
  const theme = generated.input
  const colors = generated.generated

  const output: MyriadOutput = {
    input: generated.input,
    adjusted: generated.adjusted,
    generated: colors,
  }

  return {
    output,
    apply: (element, formater) => apply({ element, output, formater }),
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => myriad(inverse(theme).scheme, theme.settings),
    isDark: () => isDark(theme)
  }
}

export function myriad(scheme = defaultScheme, passedSettings = settings) {
  return myriadObject(generate(adjust({
    scheme: scheme,
    settings: {
      ...settings,
      ...passedSettings,
    },
  })))
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
