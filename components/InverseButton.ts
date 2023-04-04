import { shadowDOM } from './shadow'
import { mutateMyriad, generated, iro } from '../main'
import { isDark, inverse, myriad, MyriadOutput } from "../"

export class InverseButton extends HTMLElement {
  constructor() {
    super()

    const handleClick = () => {
      const i = inverse(generated.colors.origin)
      iro.color.hexString = i?.background || '#000000';

      const inversed = myriad(i)
      mutateMyriad(inversed)
      handleColorChange(inversed)
    }

    // const i = inverse(generated.colors.origin)
    // iro.color.hexString = i.background;

    //console.log('rex i: ', i.background);
    

    const handleColorChange = (theme: MyriadOutput) => {
      const doc = this.shadowRoot
      if(doc === null) return
      const darkmode = doc.getElementById('darkmode')
      if(darkmode === null) return
      darkmode.innerText = isDark(theme.colors) ? "dark mode" : "light mode"
    }

    this.addEventListener('click', handleClick)

    shadowDOM(this, `
      <div class="random-button">
        <p id="darkmode">...</p>
        <button id="inverse">
          Inverse Scheme
        </button>
      </div>
    `)
  }
}
