import tinycolor from 'tinycolor2'

//Configs and Utilities
import { settings, defaultScheme, defaultTheme } from './store'
import type { UmbraOutput, UmbraInput, UmbraSettings, UmbraAdjusted } from './types'

//Primitives
import { format, Format, Formater, UmbraOutputs } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable } from './primitives/color'

//Color RawRange Steps
import { generate } from './generator'

//Types
interface SubSchemeProps {
  id: string
  settings?: UmbraSettings
  element?: HTMLElement
}

export interface Umbra {
  output: UmbraOutput
  apply: (element?: HTMLElement, formater?: Formater) => UmbraOutputs
  format: (formater?: Formater) => Format
  inverse: () => Umbra
  isDark: () => boolean
}

//Functions
export function umbraObject(generated: UmbraOutput): Umbra {
  const theme = generated.input

  const output: UmbraOutput = {
    input: generated.input,
    adjusted: generated.adjusted,
    ranges: generated.ranges
  }

  return {
    output,
    apply: (element, formater) => format({ output, formater }).attach(element),
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => umbra(inverse(theme).scheme, theme.settings),
    isDark: () => isDark(theme)
  }
}

export function umbra(scheme = defaultScheme, passedSettings = settings) {
  const input = {
    scheme: scheme,
    settings: {
      ...settings,
      ...passedSettings
    }
  }

  const readability = input.settings.readability || 4
  const background = tinycolor(scheme.background)
  const foreground = getReadable({
    foreground: tinycolor(scheme.foreground),
    background,
    readability
  })

  return umbraObject(
    generate({
      input,
      background,
      foreground,
      accents: scheme.accents
    })
  )
}

export const subScheme = (input: UmbraInput, props: SubSchemeProps) => {
  const subSchemes = input.scheme.subSchemes
  if (subSchemes === undefined) return null
  const theme = subSchemes[props.id]
  return umbra(theme.scheme, props.settings || theme.settings || input.settings)
}

export default umbra
