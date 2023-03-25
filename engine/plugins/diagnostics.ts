//Configs and Utilities
import tinycolor from "tinycolor2"
import { GenScheme } from '../store/types'
import { settings } from '../store'

const readability = (col: string, bg: string) => {
  return tinycolor.readability(col, bg)
}

//Composition Functions
export const colorAlly = (scheme: GenScheme) => {
  const { background, foreground, accents } = scheme
  if(!background || !foreground || !accents) return
  const bg = background.color
  const fg = foreground.color
  const ac = accents[0].color
  const acc = accents[0].contrast

  return {
    min: settings.readability,
    range: readability(bg, fg),
    accent: readability(ac, acc),
  }
}

