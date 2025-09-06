import type { UmbraSwatch } from '../../swatch'
import { swatch } from '../../swatch'

import type { UmbraInput, UmbraScheme, UmbraAdjusted } from '../types'
import { increaseContrastUntil, getReadability, getReadable, mostReadable } from './color'

function inverseValidator(theme: UmbraScheme) {
  const fgDark = swatch(theme.foreground).isDark()
  const bgDark = swatch(theme.background).isDark()

  const background = swatch(theme.background)
  const foreground = swatch(theme.foreground)
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
    const oppositeLightEnd = background.isDark() ? swatch('white') : swatch('black')
    const currentLightEnd = background.isDark() ? swatch('black') : swatch('white')
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
  return swatch(background).isDark()
}

export function findContrast(color: UmbraSwatch, adjusted: UmbraAdjusted) {
  return mostReadable(color, [adjusted.background || color, adjusted.foreground || color])
}
