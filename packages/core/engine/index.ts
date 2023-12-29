import { colord } from 'colord'
import { settings, defaultScheme } from './defaults'
import type { UmbraOutput } from './types'

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

export interface Umbra {
  output: UmbraOutput
  apply: (props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbraHydrate(output: UmbraOutput) {
  const input = output.input
  function apply({ element, formater, alias }: ApplyProps = {}) {
    return format({ output, formater }).attach(element, alias)
  }

  return {
    apply,
    isDark: () => isDark(input),
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => umbra(inverse(input).scheme, input.settings),
    output
  }
}

export function umbra(scheme = defaultScheme, passedSettings = settings) {
  const input = {
    scheme,
    settings: {
      ...settings,
      ...passedSettings
    }
  }

  const accents = scheme.accents
  const background = colord(scheme.background)
  const foreground = getReadable({
    readability: input.settings.readability || 4,
    foreground: colord(scheme.foreground),
    background
  })

  const generated = umbraGenerate(input, {
    background,
    foreground,
    accents
  })

  return umbraHydrate(generated)
}
