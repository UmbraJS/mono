import {
  myriad,
  // getReadable,
  // makeReadable,
  MyriadOutput,
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"
import { RandomButton } from "./components/RandomButton"

// function linkColor(m: Myriad) {
//   if(!m.foreground) return "black"
//   const blue = '#6b6bff'
//   const linkColor = makeReadable(blue, m, 7)
//   return linkColor
// }

// function imgColor(m: Myriad) {
//   if(!m.foreground) return "black"
//   return getReadable(m.foreground, 'black', 19)
// }

export let m = myriad({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074'],
  // custom: {
  //   link: linkColor,
  //   imgColor: imgColor,
  //   success: '#00ff00',
  //   error: '#ff0000',
  // }
})

export function mutateMyriad(newMyriad: MyriadOutput) {
  m = newMyriad
}

function registerComponent() {
  customElements.define('color-pallet', ColorPallet)
  customElements.define('accent-pallet', AccentPallet)
  customElements.define('random-button', RandomButton)
}

registerComponent()
