// Configs and Utilities
import { settings, defaultScheme } from './store'
import type { UmbraOutput, UmbraInput, UmbraSettings } from './types'

//Primitives
import { format, Format, Formater, UmbraOutputs } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'

// Main functions
import { adjust } from './adjust'
import { generate } from './generator'

export interface Umbra {
  output: UmbraOutput
  apply: (element?: HTMLElement, formater?: Formater) => UmbraOutputs
  format: (formater?: Formater) => Format
  inverse: () => Umbra,
  isDark: () => boolean
}

export function umbraObject(generated: UmbraOutput): Umbra {
  const theme = generated.input
  const colors = generated.generated

  const output: UmbraOutput = {
    input: generated.input,
    adjusted: generated.adjusted,
    generated: colors,
  }

  return {
    output,
    apply: (element, formater) => format({output, formater}).attach(element),
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => umbra(inverse(theme).scheme, theme.settings),
    isDark: () => isDark(theme)
  }
}

export function umbra(scheme = defaultScheme, passedSettings = settings) {
  return umbraObject(generate(adjust({
    scheme: scheme,
    settings: {
      ...settings,
      ...passedSettings,
    },
  })))
}

interface SubSchemeProps {
  id: string
  settings?: UmbraSettings
  element?: HTMLElement
}

export const subScheme = (input: UmbraInput, props: SubSchemeProps) => {
  const subSchemes = input.scheme.subSchemes
  if (subSchemes === undefined) return null
  const theme = subSchemes[props.id]
  return umbra(theme.scheme,  props.settings || theme.settings || input.settings)
}

export default umbra
