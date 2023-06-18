import { MyriadGenerated } from '../store/types'
import { settings } from '../store'
import { getReadability } from '../primitives/color'

//Composition Functions
export const colorAlly = (scheme: MyriadGenerated) => {
  const { background, foreground, accents } = scheme
  if(!background || !foreground || !accents) return
  const bg = background.color
  const fg = foreground.color
  const ac = accents[0].color
  const acc = accents[0].contrast

  return {
    min: settings.readability,
    range: getReadability(bg, fg),
    accent: getReadability(ac, acc),
  }
}

