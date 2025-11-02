import type { UmbraSwatch } from '../../swatch'
import { umbra } from '../..'
import type { UmbraRange, FormatedRange, UmbraScheme, StableScheme, ValidationWarning } from '../types'
import { attach } from './attach'
import type { Alias } from './attach'

export type Formater = (color: UmbraSwatch) => string

interface FormatProps {
  input: Partial<UmbraScheme>
  output: UmbraRange[]
  formater?: Formater
  target?: HTMLElement | null | string
  callback?: (outputs: UmbraOutputs) => void
  validationWarnings?: ValidationWarning[]
}

export interface UmbraOutputs {
  flattened: FlattenColor[]
  formated: FormatedRange[]
  output: UmbraRange[]
  input: Partial<UmbraScheme>
  stable: StableScheme
  validationWarnings: ValidationWarning[]
}

export interface Target {
  element?: HTMLElement | null
  selector?: string
}

export interface AttachProps {
  alias?: Alias | boolean
  target?: Target
  rangeMapping?: boolean
}

export const format = ({
  input,
  output = umbra().output,
  formater = defaultFormater,
  callback,
  validationWarnings = []
}: FormatProps) => {
  let existingAccents = 0
  function getName(name: string) {
    if (name !== 'accent') return name
    existingAccents++
    if (existingAccents > 1) return name + existingAccents
    else return name
  }

  function getColors(c: UmbraRange, formater = defaultFormater) {
    return {
      name: getName(c.name),
      background: formater(c.background.swatch),
      shades: c.range.map((s) => formater(s.swatch)),
      foreground: formater(c.foreground.swatch)
    }
  }

  const formated = output.map((c) => getColors(c, formater))
  const flattened = flattenColors({
    prefix: '--',
    formated
  })

  // Generate stable schema from output
  const stable = generateStableScheme(output, formater)

  const outputs: UmbraOutputs = {
    flattened,
    formated,
    output,
    input,
    stable,
    validationWarnings
  }

  return {
    ...outputs,
    attach: async ({ target, alias, rangeMapping }: AttachProps) => {
      if (!document) return outputs
      if (callback) callback(outputs)
      return await attach({
        outputs,
        alias: typeof alias === 'boolean' ? undefined : alias,
        rangeMapping,
        target: target || {
          selector: ':root'
        }
      })
    }
  }
}

export const defaultFormater = hex

/**
 * Generates a stable, serializable schema from the output
 * This schema uses only strings and is version-independent
 */
function generateStableScheme(output: UmbraRange[], formater: Formater = hex): StableScheme {
  // Find base range (should be first)
  const baseRange = output.find(range => range.name === 'base')
  if (!baseRange) {
    throw new Error('Base range not found in output')
  }

  // All other ranges are accents
  const accentRanges = output.filter(range => range.name !== 'base')

  return {
    background: formater(baseRange.background.swatch),
    foreground: formater(baseRange.foreground.swatch),
    baseRange: baseRange.range.map(color => formater(color.swatch)),
    accents: accentRanges.map(accent => ({
      name: accent.name,
      color: findAccentColor(accent, formater),
      range: accent.range.map(color => formater(color.swatch))
    }))
  }
}

/**
 * Finds the primary accent color from a range
 * This is typically the color with highest saturation or the middle color
 */
function findAccentColor(accent: UmbraRange, formater: Formater): string {
  // Find the color with highest saturation - likely the "pure" accent color
  let maxSaturation = -1
  let accentColor = accent.range[0]

  accent.range.forEach(color => {
    const hsl = color.swatch.toHsl()
    if (hsl.s > maxSaturation) {
      maxSaturation = hsl.s
      accentColor = color
    }
  })

  return formater(accentColor.swatch)
}

/**
 * Formats a color as a hexadecimal string: `#ff0000`
 */
export function hex(color: UmbraSwatch) {
  return color.toHex()
}

/**
 * Formats a color as an RGB string: `rgb(255, 0, 0)`
 */
export function rgb(color: UmbraSwatch) {
  const rgba = color.toRgb()
  return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
}

export interface FlattenColor {
  name: string
  color: string
}

interface FlattenColors {
  formated: FormatedRange[]
  prefix?: string | false
}

function flattenColors({ formated, prefix }: FlattenColors) {
  const flattened: FlattenColor[] = []

  formated.forEach((c) => {
    const name = prefix ? prefix + c.name : c.name
    flattened.push({ name, color: c.background })
    flattened.push(...flattenShades(c.shades, name))
    flattened.push({
      name: name + '-text',
      color: c.foreground
    })
  })

  function flattenShades(shades: any[], name: string): FlattenColor[] {
    if (!Array.isArray(shades) || shades.length === 0) {
      return []
    }
    return shades
      .map((shade, i) => {
        if (shade === undefined || shade === null) {
          return null
        }
        const token = (+i + 1) * 10
        return {
          name: name + '-' + token,
          color: shade
        }
      })
      .filter((item): item is FlattenColor => item !== null) // Type-safe filter
  }

  return sortFlattened(flattened)
}

function sortFlattened(flattened: FlattenColor[]) {
  const foregroundPrefix = '--foreground'
  const backgroundPrefix = '--background'

  // Filter out any undefined or null items
  const validFlattened = flattened.filter((item) => item && item.name)

  const background = validFlattened.filter((item) => item.name.startsWith(backgroundPrefix))
  const foreground = validFlattened.filter((item) => item.name.startsWith(foregroundPrefix))
  const rest = validFlattened.filter(
    (item) => !item.name.startsWith(backgroundPrefix) && !item.name.startsWith(foregroundPrefix)
  )

  const ordered = [...background, ...foreground.reverse(), ...rest]

  const filtered = ordered.filter(({ name }) => !invalidColor(name))
  function invalidColor(name: string) {
    const regex = /(?:background|foreground).*contrast/i
    return regex.test(name)
  }

  return filtered
}
