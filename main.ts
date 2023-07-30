import {
  umbra,
  UmbraSettings,
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"
import { RandomButton } from "./components/RandomButton"
import { InverseButton } from "./components/InverseButton"

const settings: UmbraSettings = {
  readability: 4,
}

export let u = umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#d9accf', '#41e980', '#d9accf'],
  custom: {
    link: '#03A9F4',
    warning: '#e91e63',
  },
}, settings).apply()

// console.log(umbra({
//   background: 'white',
//   foreground: 'black',
//   accents: ['#d9accf'],
// }, settings).format().attach(document.querySelector('body')!))

export function mutateUmbra(newUmbra = u) {
  u = newUmbra
}

export const iro = new (window as any).iro.ColorPicker("#picker", {
  color: u.output.input.scheme.background,
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
