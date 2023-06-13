import tinycolor from 'tinycolor2'
import type { GenScheme, MyriadInput } from '../store/types'
import { foreground } from '../adjust'
import { increaseContrastUntil, getReadability } from './color'

function isGenerated(scheme: GenScheme | MyriadInput) {
  return scheme.hasOwnProperty('origin')
}

function schemeCleaner(scheme: GenScheme | MyriadInput) {
  return isGenerated(scheme)
    ? (scheme as GenScheme).origin
    : (scheme as MyriadInput)
}

function inverseValidator(scheme: MyriadInput) {
  const fgDark = tinycolor(scheme.foreground).isDark()
  const bgDark = tinycolor(scheme.background).isDark()

  if (fgDark !== bgDark) return {}
  const fg = foreground(scheme)
  if(fg.isDark() !== bgDark) {
    return {
      background: fg.toHexString(),
      foreground: scheme.background,
    }
  }

  // Both are same, so we need to adjust something 
  // or return a failure of some kind
  function createInvertedFlippingReadability() {
    const background = tinycolor(scheme.background)
    const foreground = tinycolor(scheme.foreground)
    const oppositeLightEnd = background.isDark() ? tinycolor('white') : tinycolor('black')
    const currentLightEnd = background.isDark() ? tinycolor('black') : tinycolor('white')
    const readability = getReadability(background, currentLightEnd)

    return increaseContrastUntil({
      color: background,
      contrast: foreground,
      condition: (c) => {
        const diff = getReadability(c, oppositeLightEnd)
        const within = diff < readability
        return within
      },
    }).toHexString()
  }

  return {
    background: createInvertedFlippingReadability(),
    foreground: scheme.foreground,
  }
}

function basicInverse(scheme: MyriadInput): MyriadInput {
  return {
    ...scheme,
    background: scheme.foreground,
    foreground: scheme.background,
  }
}

function makeInverse(scheme: MyriadInput): MyriadInput {
  const inversed = basicInverse(scheme)
  return {
    ...inversed,
    ...inverseValidator(scheme),
    inversed: scheme
  }
}

export const inverse = (scheme: MyriadInput) => {
  const cleanScheme = schemeCleaner(scheme)
  const hasInverse = cleanScheme.hasOwnProperty('inverse')
  if(hasInverse) return scheme.inversed
  return makeInverse(scheme)
}

export const isDark = (scheme: GenScheme | MyriadInput) => {
  const origin = schemeCleaner(scheme)
  return tinycolor(origin.background).isDark()
}
