import tinycolor from 'tinycolor2'
import { GenScheme } from '../store/types'
import { myriad } from '..'

export const inverse = (scheme: GenScheme) => {
  const { background, foreground } = scheme.origin
  return myriad({
    ...scheme.origin,
    background: foreground,
    foreground: background,
  })
}

export const isDark = (scheme: GenScheme) => {
  return tinycolor(scheme.background?.color).isDark()
}