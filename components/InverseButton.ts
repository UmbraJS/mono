import { shadowDOM } from './shadow'
import { mutateMyriad, generated, iro } from '../main'
import { isDark, inverse, myriad, MyriadOutput } from "../"

export class InverseButton extends HTMLElement {
  constructor() {
    super()

    const handleClick = () => {
      const i = inverse(generated.colors.input)
      if(!i) return

      iro.color.hexString = i.scheme.background || '#000000';

      const inversed = myriad(i.scheme, i.settings).apply()
      mutateMyriad(inversed)
      handleColorChange(inversed)
    }    

    const handleColorChange = (theme: MyriadOutput) => {
      const doc = this.shadowRoot
      if(doc === null) return
      const darkmode = doc.getElementById('darkmode')
      if(darkmode === null) return
      darkmode.innerText = isDark(theme.colors.input) ? "dark mode" : "light mode"
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
