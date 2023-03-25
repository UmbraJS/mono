import tinycolor from 'tinycolor2'
import { GenScheme, Myriad } from '../store/types'
import { myriad } from '..'

function unified(scheme: GenScheme | Myriad) {
  return scheme.hasOwnProperty('origin') 
    ? (scheme as GenScheme).origin 
    : (scheme as Myriad)
}

export const inverse = (scheme: GenScheme | Myriad) => {
  const s = unified(scheme)
  return myriad({
    ...s,
    background: s.foreground,
    foreground: s.background,
  })
}

export const isDark = (scheme: GenScheme | Myriad) => {
  const origin = unified(scheme)
  return tinycolor(origin.background).isDark()
}