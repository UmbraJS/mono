import { colord } from 'colord'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraScheme, UmbraSettings, UmbraInput, UmbraRange } from './types'

import { format, Formater, UmbraOutputs, AttachProps } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable } from './primitives/color'
import { umbraGenerate } from './generator'

import type { Alias } from './primitives/attach'

interface ApplyProps {
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

interface Format extends UmbraOutputs {
  attach: (props: AttachProps) => UmbraOutputs
}

export interface Umbra {
  output: UmbraRange[]
  input: UmbraInput
  apply: (target?: string | HTMLElement | null, props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbraHydrate(input: UmbraInput, output: UmbraRange[]): Umbra {
  const apply = (target?: string | HTMLElement | null, props?: ApplyProps) => {
    const { alias, formater } = props || {}
    const targetIsString = typeof target === 'string'
    const targetIsElement = target instanceof HTMLElement || target === null
    return format({ output, formater, input }).attach({
      alias,
      target: target
        ? {
            element: targetIsElement ? target : undefined,
            selector: targetIsString ? target : undefined
          }
        : undefined
    })
  }

  return {
    input,
    output,
    isDark: () => isDark(input.scheme),
    format: (formater?: Formater) => format({ output, formater, input }),
    inverse: () => umbra(inverse(input).scheme, input.settings),
    apply
  }
}
