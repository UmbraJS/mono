import {
  myriad,
  // getReadable,
  MyriadSettings,
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"
import { RandomButton } from "./components/RandomButton"
import { InverseButton } from "./components/InverseButton"

// function linkColor(generated: Myriad) {
//   if(!generated.foreground) return "black"
//   const blue = '#6b6bff'
//   const linkColor = getReadable(blue, generated, 7)
//   return linkColor
// }

const settings: MyriadSettings = {
  readability: 2,
  background: {
    shade: [10, 20]
  } 
}

export let generated = myriad({
  background: '#373737',
  foreground: '#5e5555',
  accents: ['green'],
}, settings)

export function mutateMyriad(newMyriad = generated) {
  //console.log("mutated");
  generated = newMyriad
}


export const iro = new window.iro.ColorPicker("#picker", {
  color: generated.colors.origin.background,
});

function registerComponent() {
  customElements.define('color-pallet', ColorPallet)
  customElements.define('accent-pallet', AccentPallet)
  customElements.define('random-button', RandomButton)
  customElements.define('inverse-button', InverseButton)
}

registerComponent()
