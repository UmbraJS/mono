import { colord } from 'colord'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraScheme, UmbraSettings, UmbraInput, RawRange } from './types'

import { format, Format, Formater, UmbraOutputs } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import type { Alias } from './primitives/attach'
import { getReadable } from './primitives/color'
import { umbraGenerate } from './generator'

interface ApplyProps {
  element?: HTMLElement
  formater?: Formater
  alias?: Alias | boolean
}

interface RootSettings extends UmbraSettings {
  inversed?: UmbraInput
}

export function umbra(scheme = defaultScheme, settings?: RootSettings) {
  const input = umbraInput({ scheme, settings })
  const adjustment = umbraAdjust(input.settings, scheme)
  const output = umbraGenerate(input, adjustment)
  return umbraHydrate(input, output)
}

function umbraInput({
  scheme = defaultScheme,
  settings
}: {
  scheme?: UmbraScheme
  settings?: RootSettings
}): UmbraInput {
  const { inversed, ...rest } = settings || {}
  return {
    scheme,
    inversed: inversed,
    settings: {
      ...defaultSettings,
      ...rest
    }
  }
}

function umbraAdjust(settings: UmbraSettings, scheme = defaultScheme) {
  const background = colord(scheme.background)
  const foreground = getReadable({
    readability: settings.readability || 4,
    foreground: colord(scheme.foreground),
    background
  })

  return {
    accents: scheme.accents,
    background,
    foreground
  }
}

export interface Umbra {
  output: RawRange[]
  input: UmbraInput
  apply: (props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbraHydrate(input: UmbraInput, output: RawRange[]): Umbra {
  const apply = ({ element, formater, alias }: ApplyProps = {}) =>
    format({ output, formater, input }).attach(element, alias)
  return {
    apply,
    input,
    output,
    isDark: () => isDark(input.scheme),
    format: (formater?: Formater) => format({ input, output, formater }),
    inverse: () => umbra(inverse(input).scheme, input.settings)
  }
}
