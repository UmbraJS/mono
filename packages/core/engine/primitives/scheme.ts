import { colord } from 'colord'
import type { Colord } from 'colord'
import type { UmbraInput, UmbraScheme, UmbraAdjusted } from '../types'
import { increaseContrastUntil, getReadability, getReadable, mostReadable } from './color'

function inverseValidator(theme: UmbraScheme) {
  const fgDark = colord(theme.foreground).isDark()
  const bgDark = colord(theme.background).isDark()

  const background = colord(theme.background)
  const foreground = colord(theme.foreground)
  const readability = theme.settings?.readability

  if (fgDark !== bgDark)
    return {
      background: theme.foreground,
      foreground: theme.background
    }

  const fg = getReadable({ foreground, background, readability })
  if (fg.isDark() !== bgDark) {
    return {
      background: fg.toRgbString(),
      foreground: theme.background
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
    foreground: theme.foreground
  }
}

export const inverse = (theme: UmbraScheme, inversed?: UmbraInput) => {
  if (inversed)
    return {
      ...inversed,
      inversed: theme
    }
  return {
    ...theme,
    ...inverseValidator(theme),
    inversed: theme
  }
}

export const isDark = (background: string) => {
  return colord(background).isDark()
}

export function findContrast(color: Colord, adjusted: UmbraAdjusted) {
  return mostReadable(color, [adjusted.background || color, adjusted.foreground || color])
}
