import { shadowDOM } from './shadow'
import { mutateUmbra, u, iro } from '../../../main'
import { isDark, inverse, umbra, UmbraOutputs } from '../../..'

export class InverseButton extends HTMLElement {
  constructor() {
    super()

    const handleClick = () => {
      const i = inverse(u.output.input)
      if (!i) return

      iro.color.hexString = i.scheme.background || '#000000'

      const inversed = umbra(i.scheme, i.settings).apply()
      mutateUmbra(inversed)
      handleColorChange(inversed)
    }

    const handleColorChange = (theme: UmbraOutputs) => {
      const doc = this.shadowRoot
      if (doc === null) return
      const darkmode = doc.getElementById('darkmode')
      if (darkmode === null) return
      darkmode.innerText = isDark(theme.output.input) ? 'dark mode' : 'light mode'
    }

    this.addEventListener('click', handleClick)

    shadowDOM(
      this,
      `
      <div class="random-button">
        <p id="darkmode">...</p>
        <button id="inverse">
          Inverse Scheme
        </button>
      </div>
    `
    )
  }
}
