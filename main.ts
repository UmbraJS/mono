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

export let output = myriad({
  background: 'white',
  foreground: 'black',
  accents: ['#d9accf', '#41e980', '#d9accf'],
  custom: {
    link: '#03A9F4',
    warning: '#e91e63',
  },
}, settings).apply()

export function mutateMyriad(newMyriad = output) {
  output = newMyriad
}

export const iro = new (window as any).iro.ColorPicker("#picker", {
  color: output.input.scheme.background,
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
