import tinycolor from 'tinycolor2'

//Configs and Utilities
import { settings, defaultScheme, defaultTheme } from './store'
import type {
  UmbraOutput,
  UmbraInput,
  UmbraSettings,
  UmbraAdjusted,
  Accent,
  AdjustedAccent
} from './types'

//Primitives
import { format, Format, Formater, UmbraOutputs } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable } from './primitives/color'

//Color RawRange Steps
import { generate } from './generator'

//Types
interface SubSchemeProps {
  id: string
  settings?: UmbraSettings
  element?: HTMLElement
}

export interface Umbra {
  output: UmbraOutput
  apply: (element?: HTMLElement, formater?: Formater) => UmbraOutputs
  format: (formater?: Formater) => Format
  inverse: () => Umbra
  isDark: () => boolean
}

//Functions
export function umbraObject(generated: UmbraOutput): Umbra {
  const theme = generated.input

  const output: UmbraOutput = {
    input: generated.input,
    adjusted: generated.adjusted,
    ranges: generated.ranges
  }

  return {
    output,
    apply: (element, formater) => format({ output, formater }).attach(element),
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => umbra(inverse(theme).scheme, theme.settings),
    isDark: () => isDark(theme)
  }
}

export function umbra(scheme = defaultScheme, passedSettings = settings) {
  return umbraObject(
    generate(
      adjust({
        scheme: scheme,
        settings: {
          ...settings,
          ...passedSettings
        }
      })
    )
  )
}

interface AdjustAccent {
  accent: string | Accent
  background: tinycolor.Instance
  readability: number
}

function adjustAccent({ accent, background, readability }: AdjustAccent): AdjustedAccent {
  const isString = typeof accent === 'string'
  const color = tinycolor(isString ? accent : accent.value)
  const read = !isString && accent.readability ? accent.readability : readability
  return {
    name: !isString ? accent.name : undefined,
    shades: !isString ? accent.shades : undefined,
    readability: read,
    value: getReadable({
      foreground: color,
      background,
      readability: read
    })
  }
}

const adjust = (theme = defaultTheme): UmbraAdjusted => {
  const background = tinycolor(theme.scheme.background)
  const foreground = tinycolor(theme.scheme.foreground)
  const accents = theme.scheme.accents
  const readability = theme.settings.readability || 4
  return {
    input: theme,
    background: background,
    foreground: getReadable({ foreground, background, readability }),
    accents: accents.map((accent) =>
      adjustAccent({
        accent,
        background,
        readability
      })
    )
  }
}

export const subScheme = (input: UmbraInput, props: SubSchemeProps) => {
  const subSchemes = input.scheme.subSchemes
  if (subSchemes === undefined) return null
  const theme = subSchemes[props.id]
  return umbra(theme.scheme, props.settings || theme.settings || input.settings)
}

export default umbra
