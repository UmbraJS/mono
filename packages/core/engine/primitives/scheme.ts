import { colord, Colord } from 'colord'
import type { UmbraInput, UmbraScheme, UmbraAdjusted } from '../types'
import { increaseContrastUntil, getReadability, getReadable, mostReadable } from './color'

function inverseValidator(theme: UmbraInput) {
  const fgDark = colord(theme.scheme.foreground).isDark()
  const bgDark = colord(theme.scheme.background).isDark()

  const background = colord(theme.scheme.background)
  const foreground = colord(theme.scheme.foreground)
  const readability = theme.settings?.readability

  if (fgDark !== bgDark) return {}
  const fg = getReadable({ foreground, background, readability })
  if (fg.isDark() !== bgDark) {
    return {
      background: fg.toRgbString(),
      foreground: theme.scheme.background
    }
  }

  // Both are same, so we need to adjust something
  // or return a failure of some kind
  function createInvertedFlippingReadability() {
    const oppositeLightEnd = background.isDark() ? colord('white') : colord('black')
    const currentLightEnd = background.isDark() ? colord('black') : colord('white')
    const readability = getReadability(background, currentLightEnd)

    return increaseContrastUntil({
      color: background,
      contrast: foreground,
      condition: (c) => {
        const diff = getReadability(c, oppositeLightEnd)
        const within = diff < readability
        return within
      }
    }).toRgbString()
  }

  return {
    background: createInvertedFlippingReadability(),
    foreground: theme.scheme.foreground
  }
}

function basicInverse(scheme: UmbraScheme): UmbraScheme {
  return {
    ...scheme,
    background: scheme.foreground,
    foreground: scheme.background
  }
}

function makeInverse(theme: UmbraInput): UmbraInput {
  const inversed = basicInverse(theme.scheme)
  return {
    inversed: theme,
    settings: theme.settings,
    scheme: {
      ...inversed,
      ...inverseValidator(theme)
    }
  }
}

export const inverse = (theme: UmbraInput) => {
  const hasInverse = theme.hasOwnProperty('inverse')
  if (hasInverse) return theme.inversed as UmbraInput
  return makeInverse(theme)
}

export const isDark = (theme: UmbraInput) => {
  return colord(theme.scheme.background).isDark()
}

export function findContrast(color: Colord, adjusted: UmbraAdjusted) {
  console.log('findContrast', color.toHex(), adjusted)
  return mostReadable(color, [adjusted.background || color, adjusted.foreground || color])
}
