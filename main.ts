import {
  myriad,
  // getReadable,
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

// function imgColor(m: Myriad) {
//   if(!m.foreground) return "black"
//   return getReadable(m.foreground, 'black', 19)
// }

const settings: MyriadSettings = {
  readability: 0.1,
  foreground: {
    shade: [10, 40]
  } 
}

const colorTheme = {
  background: 'white',
  foreground: 'white',
  accents: ['white'],
};

export let m = myriad(colorTheme, {settings})

export function mutateMyriad(newMyriad: MyriadOutput) {
  m = newMyriad
}

function registerComponent() {
  customElements.define('color-pallet', ColorPallet)
  customElements.define('accent-pallet', AccentPallet)
  customElements.define('random-button', RandomButton)
}

registerComponent()
