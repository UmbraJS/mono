import { shadowDOM, setColor } from './shadow'
import { m } from '../main'

export class ColorPallet extends HTMLElement {
  static properties = {
    name: {type: String},
    index: {type: Number},
  };
  constructor() {
    super()
    const name = this.getAttribute('name') || 'foreground';
    const index = this.getAttribute('index') || 0;
    const shadow = shadowDOM(this, `
      <style>
        div.pallets {
          display: flex;
          flex-direction: column;
          width: 50px;
          border: 1px solid var(--foreground);
        }
    
        div.pallets.reverse {
          flex-direction: column-reverse;
        }
    
        div.pallets > div {
          height: 50px;
          aspect-ratio: 1 / 1;
          background: var(--foreground);
          box-sizing: border-box;
        }

        div.pallets:not(.reverse) .color {
          border-bottom: 1px solid var(--foreground);
        }

        div.pallets.reverse .color {
          border-top: 1px solid var(--foreground);
        }
      </style>
      <div class="pallets">
        <div class="color"></div>
      </div>
    `)

    if(name === 'foreground') setColor(shadow, m[name])
    if(name === 'background') setColor(shadow, m[name])?.reverse()
    if(name === 'accents' && m.accents) setColor(shadow, m.accents[+index])
  }
}
