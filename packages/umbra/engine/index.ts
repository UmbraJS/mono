import { swatch } from '../swatch'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraInput, UmbraScheme, UmbraRange, ValidationWarning } from './types'

import { format } from './primitives/format'
import type { Formater, UmbraOutputs, AttachProps } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable, getReadability } from './primitives/color'
import { umbraGenerate } from './generator'
import { fallback } from './primitives/utils'

import type { Alias } from './primitives/attach'

interface ApplyProps {
  formater?: Formater
  alias?: Alias | boolean
  target?: string | HTMLElement | null
}

interface Format extends UmbraOutputs {
  attach: (props: AttachProps) => Promise<UmbraOutputs>
}

export interface Umbra {
  output: UmbraRange[]
  input: UmbraInput
  validationWarnings: ValidationWarning[]
  apply: (props?: ApplyProps) => Promise<UmbraOutputs>
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbra(scheme: UmbraInput = defaultScheme): Umbra {
  const input = insertFallbacks(scheme)
  const adjustment = umbraAdjust(input)
  const generated = umbraGenerate(input, adjustment)

  // Combine warnings from adjustment and generation
  const allWarnings = [...adjustment.warnings, ...generated.validationWarnings]

  return umbraHydrate({
    input,
    output: generated.output,
    validationWarnings: allWarnings,
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

function umbraAdjust(scheme = defaultScheme): {
  accents: (string | import('./types').Accent)[]
  background: import('../swatch').UmbraSwatch
  foreground: import('../swatch').UmbraSwatch
  warnings: ValidationWarning[]
} {
  const background = swatch(scheme.background)
  const originalForeground = swatch(scheme.foreground)
  const readabilityThreshold = fallback({ number: scheme.settings?.readability, fallback: 30 })

  const foreground = getReadable({
    readability: readabilityThreshold,
    foreground: originalForeground,
    background,
  })

  const warnings: ValidationWarning[] = []

  // Check if original foreground and background have sufficient contrast
  // Use the same readability threshold that's used for generating the range
  const contrast = getReadability(originalForeground, background)

  if (contrast < readabilityThreshold) {
    warnings.push({
      type: 'contrast',
      severity: 'warning',
      message: `Foreground and background colors have low contrast (${contrast.toFixed(1)} Lc, threshold: ${readabilityThreshold})`,
      context: {
        contrast,
        threshold: readabilityThreshold,
        originalForeground: originalForeground.toHex(),
        background: background.toHex(),
        adjustedForeground: foreground.toHex(),
      }
    })
  }

  const accents = Array.isArray(scheme.accents) ? scheme.accents : [scheme.accents]
  return {
    accents,
    background,
    foreground,
    warnings,
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
    apply: async (props?: ApplyProps) => {
      const { alias, formater } = props || {}
      const target = getTarget(props?.target)
      const formated = getFormat(formater)
      const outputs = await formated.attach({ alias, target })
      if (input.settings?.callback) input.settings.callback(outputs)
      return outputs
    },
  }
}
