import { colord } from 'colord'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraInput, UmbraRange } from './types'

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

export function umbra(scheme = defaultScheme) {
  const input = insertFallbacks(scheme)
  const adjustment = umbraAdjust(input)
  return umbraHydrate({
    input,
    output: umbraGenerate(input, adjustment),
    inversed: scheme.inversed ? insertFallbacks(scheme.inversed) : undefined
  })
}

function insertFallbacks(scheme = defaultScheme): UmbraInput {
  const settingsFallback = {
    settings: {
      ...defaultSettings,
      ...scheme.settings
    },
    inversed: {
      ...defaultSettings,
      ...scheme.settings,
      ...scheme.inversed?.settings
    }
  }

  const inversed = scheme.inversed && {
    ...scheme.inversed,
    settings: settingsFallback.inversed
  }

  return {
    ...scheme,
    settings: settingsFallback.settings,
    inversed: inversed
  }
}

function umbraAdjust(scheme = defaultScheme) {
  const background = colord(scheme.background)
  const foreground = getReadable({
    readability: scheme.settings?.readability || 4,
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
    inverse: () => umbra(inverse(input, inversed)),
    apply: ({ alias, formater, target }: ApplyProps) => {
      const formated = format({ output, formater, input })
      return formated.attach({
        alias,
        target: getTarget(target)
      })
    }
  }
}
