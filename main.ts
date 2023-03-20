import {
  myriad,
  // getReadable,
  // makeReadable,
  // Myriad
} from "."
import { ColorPallet } from "./components/ColorPallet"
import { AccentPallet } from "./components/AccentPallet"

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

// type DynamicObject = {[key: number]: string}

// const makeArray = (obj: DynamicObject) => {
//   const objArray = Object.entries(obj)
//   return objArray.map(([key, value]) => {
//     return {[key]: value}
//   })
// }

export const m = myriad({
  background: '#0c0915',
  foreground: '#c0aea3',
  accents: ['#c97074', '#0c0915', 'darkblue'],
  // custom: {
  //   link: linkColor,
  //   imgColor: imgColor,
  //   success: '#00ff00',
  //   error: '#ff0000',
  // }
})

function registerComponent() {
  customElements.define('color-pallet', ColorPallet)
  customElements.define('accent-pallet', AccentPallet)
}

registerComponent()

// function shadeArray(className: string, shade?: DynamicObject) {
//   if(!shade) return
//   const fs = makeArray(shade)
//   const pallet = document.querySelector(className)
//   if(!pallet) return
//   fs.forEach((obj) => {
//     const key = Object.keys(obj)[0]
//     const value = Object.values(obj)[0]
//     const div = document.createElement('div')
//     div.style.backgroundColor = value
//     div.innerHTML = key || '0'
//     pallet.appendChild(div)
//   })
// }

// function setAccent() {
//   m.accents?.forEach((fl) => {
//     shadeArray('.ac', fl.shade)
//   })
// }

// function update() {
//   setAccent()
// }

// update()

