import {
  myriad,
  // getReadable,
  MyriadSettings,
  MyriadOutput,
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"
import { RandomButton } from "./components/RandomButton"

// function linkColor(m: Myriad) {
//   if(!m.foreground) return "black"
//   const blue = '#6b6bff'
//   const linkColor = getReadable(blue, m, 7)
//   return linkColor
// }

const settings: MyriadSettings = {
  readability: 5,
  background: {
    shade: [10, 20]
  } 
}

export let m = myriad({
  background: 'white',
  foreground: 'white',
  accents: ['green'],
}, settings)

export function mutateMyriad(newMyriad: MyriadOutput) {
  m = newMyriad
}

function registerComponent() {
  customElements.define('color-pallet', ColorPallet)
  customElements.define('accent-pallet', AccentPallet)
  customElements.define('random-button', RandomButton)
}

registerComponent()
