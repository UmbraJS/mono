import { colord } from 'colord'
import type { UmbraInput, Accent } from './types'

interface HydrateProps {
  input: UmbraInput
  adjusted: {
    background: string
    foreground: string
    accents: (Accent | string)[]
  }
  generated: {
    name: string
    background: string
    foreground: string
    shades: string[]
  }[]
}

export function dehydrateOutput(output: any) {
  return JSON.stringify(output)
}

function rehydrateColord(color: string) {
  const parsed = JSON.parse(color)
  return colord(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`)
}

export function hydrateOutput({ input, adjusted, generated }: HydrateProps) {
  return {
    input,
    adjusted: {
      background: rehydrateColord(adjusted.background),
      foreground: rehydrateColord(adjusted.foreground),
      accents: adjusted.accents
    },
    generated: generated.map((gen) => ({
      name: gen.name,
      background: rehydrateColord(gen.background),
      foreground: rehydrateColord(gen.foreground),
      shades: gen.shades.map(rehydrateColord)
    }))
  }
}
