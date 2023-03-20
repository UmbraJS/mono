import {
  myriad,
  // getReadable,
  // makeReadable,
  // Myriad
} from "."

// function linkColor(m: Myriad) {
//   if(!m.foreground) return "black"
//   const blue = '#6b6bff'
//   const linkColor = makeReadable(blue, m, 7)
//   return linkColor
// }

// function imgColor(m: Myriad) {
//   if(!m.foreground) return "black"
//   return getReadable(m.foreground, 'black', 19)
// }

type DynamicObject = {[key: number]: string}

const makeArray = (obj: DynamicObject) => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {[key]: value}
  })
}


const m = myriad({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074', '#0c0915'],
  // custom: {
  //   link: linkColor,
  //   imgColor: imgColor,
  //   success: '#00ff00',
  //   error: '#ff0000',
  // }
})

function shadeArray(className: string, shade?: DynamicObject) {
  if(!shade) return
  const fs = makeArray(shade)
  const pallet = document.querySelector(className)
  if(!pallet) return
  fs.forEach((obj) => {
    const key = Object.keys(obj)[0]
    const value = Object.values(obj)[0]
    const div = document.createElement('div')
    div.style.backgroundColor = value
    div.innerHTML = key || '0'
    pallet.appendChild(div)
  })
}

function setAccent() {
  m.accents?.forEach((fl) => {
    shadeArray('.ac', fl.shade)
  })
}

function update() {
  shadeArray('.fg', m.foreground?.shade)
  shadeArray('.bg', m.background?.shade)
  setAccent()
}

update()


function sa(el: Element | null, shade?: DynamicObject) {
  if(!shade || !el) return
  const fs = makeArray(shade)
  const pallet = el
  if(!pallet) return
  fs.forEach((obj) => {
    const key = Object.keys(obj)[0]
    const value = Object.values(obj)[0]
    const div = document.createElement('div')
    div.style.backgroundColor = value
    div.innerHTML = key || '0'
    pallet.appendChild(div)
  })
}

const template = document.createElement('template')
template.innerHTML = `
  <style>
    div.pallets {
      display: flex;
      flex-direction: column;
      gap: 0em;
      width: 50px;
    }

    div.pallets.reverse {
      flex-direction: column-reverse;
    }

    div.pallets > div {
      height: 50px;
      aspect-ratio: 1 / 1;
      background: var(--foreground);
      border: 1px solid var(--foreground);
    }
  </style>
  <div class="pallets">
    <div class="color">0</div>
  </div>
`

function ifForeground(shadow: ShadowRoot) {
  const pallets = shadow.querySelector('.pallets')
  const shades = m.foreground?.shade

  sa(pallets, shades)

  const colorCSS = `background: ${m.foreground?.color}; color: ${m.background?.color}`
  shadow.querySelector('.color')?.setAttribute('style', colorCSS)
}

function ifBackground(shadow: ShadowRoot) {
  const pallets = shadow.querySelector('.pallets')
  const shades = m.background?.shade
  pallets?.classList.add('reverse')

  sa(pallets, shades)

  const colorCSS = `background: ${m.background?.color}; color: ${m.foreground?.color}`
  shadow.querySelector('.color')?.setAttribute('style', colorCSS)
}

class Pallet extends HTMLElement {
  static properties = {
    name: {type: String},
  };
  constructor() {
    super()
    const name = this.getAttribute('name');
    const shadow = this.attachShadow({mode: 'open'})
    shadow.append(template.content.cloneNode(true))

    if(name === 'foreground') ifForeground(shadow)
    if(name === 'background') ifBackground(shadow)
  }
}

customElements.define('m-pallet', Pallet)

