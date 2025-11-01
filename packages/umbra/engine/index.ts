import { swatch } from '../swatch'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraInput, UmbraScheme, UmbraRange, ValidationWarning } from './types'

import { format } from './primitives/format'
import type { Formater, UmbraOutputs, AttachProps } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable } from './primitives/color'
import { umbraGenerate } from './generator'
import { fallback } from './primitives/utils'

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
  validationWarnings: ValidationWarning[]
  apply: (props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbra(scheme: UmbraInput = defaultScheme): Umbra {
  const input = insertFallbacks(scheme)
  const adjustment = umbraAdjust(input)
  const generated = umbraGenerate(input, adjustment)
  return umbraHydrate({
    input,
    output: generated.output,
    validationWarnings: generated.validationWarnings,
    inversed: input.inversed,
  })
}

function insertFallbacks(scheme: UmbraInput = defaultScheme): UmbraScheme {
  const schemeSettings = {
    ...defaultSettings,
    ...('settings' in scheme ? scheme.settings : {}),
  }

  const settingsFallback = {
    settings: schemeSettings,
    inversed: {
      ...schemeSettings,
      ...('inversed' in scheme && scheme.inversed && 'settings' in scheme.inversed ? scheme.inversed.settings : {}),
    },
  }

  const inversed = ('inversed' in scheme && scheme.inversed) ? {
    ...scheme.inversed,
    settings: settingsFallback.inversed,
  } : undefined

  return {
    ...defaultScheme,
    ...scheme,
    settings: settingsFallback.settings,
    inversed: inversed,
  }
}

function umbraAdjust(scheme = defaultScheme) {
  const background = swatch(scheme.background)
  const foreground = getReadable({
    readability: fallback({ number: scheme.settings?.readability, fallback: 4 }),
    foreground: swatch(scheme.foreground),
    background,
  })

  const accents = Array.isArray(scheme.accents) ? scheme.accents : [scheme.accents]
  return {
    accents,
    background,
    foreground,
  }
}

function getTarget(target?: string | HTMLElement | null) {
  if (!target) return undefined
  const targetIsString = typeof target === 'string'
  const targetIsElement = target instanceof HTMLElement || target === null
  return {
    element: targetIsElement ? target : undefined,
    selector: targetIsString ? target : undefined,
  }
}

export function umbraHydrate({
  input,
  output,
  validationWarnings = [],
  inversed,
}: {
  input: UmbraScheme
  output: UmbraRange[]
  validationWarnings?: ValidationWarning[]
  inversed?: UmbraInput
}) {
  function getFormat(passedFormater?: Formater) {
    const formater = passedFormater || input.settings?.formater
    return format({ output, formater, input, callback: input.settings?.callback, validationWarnings })
  }

  return {
    input,
    output,
    validationWarnings,
    isDark: () => isDark(input.background),
    format: (formater?: Formater) => getFormat(formater),
    inverse: () => umbra(inverse(input, inversed)),
    apply: (props?: ApplyProps) => {
      const { alias, formater } = props || {}
      const target = getTarget(props?.target)
      const formated = getFormat(formater)
      const outputs = formated.attach({ alias, target })
      if (input.settings?.callback) input.settings.callback(outputs)
      return outputs
    },
  }
}
