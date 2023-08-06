import { shadowDOM } from './shadow'
import { mutateUmbra } from '../../../main'
import { randomScheme, umbra } from '../../..'

export class RandomButton extends HTMLElement {
  constructor() {
    super()

    const handleClick = () => {
      const { scheme, settings } = randomScheme()
      mutateUmbra(umbra(scheme, settings).apply())
    }

    this.addEventListener('click', handleClick)

    shadowDOM(
      this,
      `
      <button id="random">
        Random Scheme
      </button>
    `
    )
  }
}
