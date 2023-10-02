import { colord } from 'colord'
import { settings, defaultScheme } from './defaults'
import type { UmbraOutput } from './types'

import { format, Format, Formater, UmbraOutputs } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import type { Alias } from './primitives/attach'
import { getReadable } from './primitives/color'
import { generate } from './generator'

interface ApplyProps {
  element?: HTMLElement
  formater?: Formater
  alias?: Alias | boolean
}

export interface Umbra {
  output: UmbraOutput
  apply: (props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  inverse: () => Umbra
  isDark: () => boolean
}

export function umbraObject(generated: UmbraOutput): Umbra {
  const theme = generated.input

  const output: UmbraOutput = {
    input: generated.input,
    adjusted: generated.adjusted,
    ranges: generated.ranges
  }

  function apply({ element, formater, alias }: ApplyProps = {}) {
    return format({ output, formater }).attach(element, alias)
  }

  return {
    output,
    apply,
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => umbra(inverse(theme).scheme, theme.settings),
    isDark: () => isDark(theme)
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

  const readability = input.settings.readability || 4
  const background = colord(scheme.background)
  const foreground = getReadable({
    foreground: colord(scheme.foreground),
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
