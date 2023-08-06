import { shadowDOM, stringMap } from './shadow'
import { u } from '../main'

export class AccentPallet extends HTMLElement {
  constructor() {
    const accents = u.output.ranges.filter((c) => c.name === 'accents')
    super()
    shadowDOM(this, `
      <style>
        .accents {
          display: flex;
          gap: 0em;
        }

        .contrast {
          height: 50px;
          aspect-ratio: 1 / 1;
          border: 1px solid var(--foreground);
          border-top: 0px solid var(--foreground);
          box-sizing: border-box;
        }
      </style>
      <div class="accents">
        ${stringMap(accents?.map((fl, index) => {
          const id = index ? index + 1 : 0
          const number = id > 1 ? id : ''
          const name = 'accent' + number
          return `
            <div class="accent-range">
              <color-pallet name="accents" index="${index}"></color-pallet>
              <div id="${fl.foreground.isDark()}" class="contrast pallet" style="background: var(--${name}-contrast)"></div>
            </div>
          `
        }))}
      </div>
    `)
  }
}
