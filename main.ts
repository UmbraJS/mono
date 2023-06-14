import {
  myriad,
  MyriadSettings,
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"
import { RandomButton } from "./components/RandomButton"
import { InverseButton } from "./components/InverseButton"

const settings: MyriadSettings = {
  readability: 2,
  background: {
    shade: [10, 20]
  }
}

export let generated = myriad({scheme: {
  background: '#373737',
  foreground: '#5e5555',
  accents: ['green'],
}, settings}).attach()

export function mutateMyriad(newMyriad = generated) {
  generated = newMyriad
}

export const iro = new (window as any).iro.ColorPicker("#picker", {
  color: generated.colors.origin.background,
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
