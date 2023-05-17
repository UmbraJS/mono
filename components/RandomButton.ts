import { shadowDOM } from './shadow'
import { mutateMyriad, } from '../main'
import { randomScheme, myriad } from "../"

export class RandomButton extends HTMLElement {
  constructor() {
    super()

    const handleClick = () => {
      const { scheme, settings } = randomScheme()
      mutateMyriad(myriad(scheme, settings).attach())
    }

    this.addEventListener('click', handleClick)

    shadowDOM(this, `
      <button id="random">
        Random Scheme
      </button>
    `)
  }
}
