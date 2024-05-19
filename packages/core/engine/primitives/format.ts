import type { Colord } from 'colord'
import { umbra } from '../..'
import type { UmbraRange, FormatedRange, UmbraScheme } from '../types'
import { attach } from './attach'
import type { Alias } from './attach'

export type Formater = (color: Colord) => string

interface FormatProps {
  input: Partial<UmbraScheme>
  output: UmbraRange[]
  formater?: Formater
  target?: HTMLElement | null | string
  callback?: (outputs: UmbraOutputs) => void
}

export interface UmbraOutputs {
  flattened: FlattenColor[]
  formated: FormatedRange[]
  output: UmbraRange[]
  input: Partial<UmbraScheme>
}

export interface Target {
  element?: HTMLElement | null
  selector?: string
}

export interface AttachProps {
  alias?: Alias | boolean
  target?: Target
}

export const format = ({
  input,
  output = umbra().output,
  formater = defaultFormater,
  callback
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
      background: formater(c.background),
      shades: c.range.map((s) => formater(s)),
      foreground: formater(c.foreground)
    }
  }

  const formated = output.map((c) => getColors(c, formater))
  const flattened = flattenColors({
    prefix: '--',
    formated
  })

  const outputs: UmbraOutputs = {
    flattened,
    formated,
    output,
    input
  }

  return {
    ...outputs,
    attach: ({ target, alias }: AttachProps) => {
      if (!document) return outputs
      callback && callback(outputs)
      return attach({
        outputs,
        alias,
        target: target || {
          selector: ':root'
        }
      })
    }
  }
}

export const defaultFormater = hex

export function hex(color: Colord) {
  return color.toHex()
}

export function rgb(color: Colord) {
  const rgba = color.toRgb()
  return `${rgba.r} ${rgba.g} ${rgba.b}`
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
      name: name + '-contrast',
      color: c.foreground
    })
  })

  function flattenShades(shades: any[], name: string) {
    return shades.map((shade, i) => {
      const token = (+i + 1) * 10
      return {
        name: name + '-' + token,
        color: shade
      }
    })
  }

  return sortFlattened(flattened)
}

function sortFlattened(flattened: FlattenColor[]) {
  const foregroundPrefix = '--foreground'
  const backgroundPrefix = '--background'

  const background = flattened.filter((item) => item.name.startsWith(backgroundPrefix))
  const foreground = flattened.filter((item) => item.name.startsWith(foregroundPrefix))
  const rest = flattened.filter(
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
