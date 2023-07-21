import {
  myriad,
  MyriadSettings,
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"
import { RandomButton } from "./components/RandomButton"
import { InverseButton } from "./components/InverseButton"

const settings: MyriadSettings = {
  readability: 4,
}

export let generated = myriad({
  background: 'white',
  foreground: 'black',
  accents: ['#d9accf'],
}, settings).apply()

export function mutateMyriad(newMyriad = generated) {
  generated = newMyriad
}

export const iro = new (window as any).iro.ColorPicker("#picker", {
  color: generated.colors.input.scheme.background,
  layout: [
    { 
      component: (window as any).iro.ui.Box,
      options: {}
    },
  ]
});

function registerComponent() {
  customElements.define('color-pallet', ColorPallet)
  customElements.define('accent-pallet', AccentPallet)
  customElements.define('random-button', RandomButton)
  customElements.define('inverse-button', InverseButton)
}

registerComponent()
