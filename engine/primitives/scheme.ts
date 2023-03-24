import tinycolor from 'tinycolor2'
import { MyriadOutput } from '../store/types'
import { myriad } from '..'

export const inverse = (scheme: MyriadOutput) => {
  const { background, foreground } = scheme.origin
  return myriad({
    ...scheme.origin,
    background: foreground,
    foreground: background,
  })
}

export const isDark = (scheme: MyriadOutput) => {
  return tinycolor(scheme.background?.color).isDark()
}