import { colord } from 'colord'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraInput, UmbraRange, UmbraSettings } from './types'

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

interface DefaultSettings extends UmbraSettings {
  callback?: (props: UmbraOutputs) => void
}

export function umbra(scheme = defaultScheme, settings?: DefaultSettings): Umbra {
  const input = insertFallbacks(scheme, settings)
  const adjustment = umbraAdjust(input)
  return umbraHydrate({
    input,
    output: umbraGenerate(input, adjustment),
    inversed: scheme.inversed ? insertFallbacks(scheme.inversed, settings) : undefined,
    callback: settings?.callback
  })
}

function insertFallbacks(scheme = defaultScheme, passedDefault?: DefaultSettings): UmbraInput {
  const settingsFallback = {
    settings: {
      ...defaultSettings,
      ...passedDefault,
      ...scheme.settings
    },
    inversed: {
      ...defaultSettings,
      ...passedDefault,
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
    iterations: scheme.settings?.iterations || 15,
    power: scheme.settings?.power || 15,
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
  inversed,
  callback
}: {
  input: UmbraInput
  output: UmbraRange[]
  inversed?: UmbraInput
  callback?: (props: any) => void
}) {
  return {
    input,
    output,
    isDark: () => isDark(input),
    format: (formater?: Formater) => format({ output, formater, input, callback }),
    inverse: () => umbra(inverse(input, inversed)),
    apply: (props?: ApplyProps) => {
      const { alias, formater } = props || {}
      const target = getTarget(props?.target)
      const formated = format({ output, formater, input })
      const outputs = formated.attach({ alias, target })
      callback && callback(outputs)
      return outputs
    }
  }
}
