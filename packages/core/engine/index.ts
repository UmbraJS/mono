import { colord } from 'colord'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraSettings, UmbraInput, UmbraRange } from './types'

import { format, Formater, UmbraOutputs, AttachProps } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable } from './primitives/color'
import { umbraGenerate } from './generator'

import type { Alias } from './primitives/attach'

interface ApplyProps {
  formater?: Formater
  alias?: Alias | boolean
  target?: string | HTMLElement | null
}

interface Format extends UmbraOutputs {
  attach: (props: AttachProps) => UmbraOutputs
}

export interface Umbra {
  output: UmbraRange[]
  input: UmbraInput
  apply: (props: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbra(scheme = defaultScheme, inversedScheme?: UmbraInput) {
  const input = umbraInput(scheme)
  const adjustment = umbraAdjust(input.settings, scheme)
  return umbraHydrate({
    input,
    output: umbraGenerate(input, adjustment),
    inversed: umbraInput(inversedScheme)
  })
}

function umbraInput(scheme = defaultScheme) {
  return {
    ...scheme,
    settings: {
      ...defaultSettings,
      ...scheme.settings
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

function getTarget(target?: string | HTMLElement | null) {
  if (!target) return undefined
  const targetIsString = typeof target === 'string'
  const targetIsElement = target instanceof HTMLElement || target === null
  return {
    element: targetIsElement ? target : undefined,
    selector: targetIsString ? target : undefined
  }
}

export function umbraHydrate({
  input,
  output,
  inversed
}: {
  input: UmbraInput
  output: UmbraRange[]
  inversed?: UmbraInput
}) {
  return {
    input,
    output,
    isDark: () => isDark(input),
    format: (formater?: Formater) => format({ output, formater, input }),
    inverse: () => umbra(inverse(input, inversed), input),
    apply: ({ alias, formater, target }: ApplyProps) => {
      const formated = format({ output, formater, input })
      return formated.attach({
        alias,
        target: getTarget(target)
      })
    }
  }
}
