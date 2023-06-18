import tinycolor from 'tinycolor2'
import type { MyriadInput, MyriadScheme } from '../store/types'
import { foreground } from '../adjust'
import { increaseContrastUntil, getReadability } from './color'

function inverseValidator(theme: MyriadInput): MyriadScheme {
  const fgDark = tinycolor(theme.scheme.foreground).isDark()
  const bgDark = tinycolor(theme.scheme.background).isDark()

  if (fgDark !== bgDark) return {}
  const fg = foreground(theme)
  if(fg.isDark() !== bgDark) {
    return {
      background: fg.toHexString(),
      foreground: theme.scheme.background,
    }
  }

  // Both are same, so we need to adjust something 
  // or return a failure of some kind
  function createInvertedFlippingReadability() {
    const background = tinycolor(theme.scheme.background)
    const foreground = tinycolor(theme.scheme.foreground)
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
    foreground: theme.scheme.foreground,
  }
}

function basicInverse(scheme: MyriadScheme): MyriadScheme {
  return {
    ...scheme,
    background: scheme.foreground,
    foreground: scheme.background,
  }
}

function makeInverse(theme: MyriadInput): MyriadInput {
  const inversed = basicInverse(theme.scheme)
  return {
    inversed: theme,
    settings: theme.settings,
    scheme: {
      ...inversed,
      ...inverseValidator(theme),
    },
  }
}

export const inverse = (theme: MyriadInput) => {
  const hasInverse = theme.hasOwnProperty('inverse')
  if(hasInverse) return theme.inversed as MyriadInput
  return makeInverse(theme)
}

export const isDark = (theme: MyriadInput) => {
  return tinycolor(theme.scheme.background).isDark()
}
