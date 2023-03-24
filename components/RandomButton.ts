import { shadowDOM } from './shadow'
import { mutateMyriad } from '../main'
import { randomMyriad } from "../"

export class RandomButton extends HTMLElement {
  constructor() {
    super()

    const handleClick = () => {
      mutateMyriad(randomMyriad().colors)
    }

    this.addEventListener('click', handleClick)

    shadowDOM(this, `
      <button>
        Random Scheme
      </button>
    `)
  }
}
