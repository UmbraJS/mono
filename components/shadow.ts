import { GenColor } from "../"

export function shadowDOM(that: any, template: string) {
  const templateNode = document.createElement('template')
  templateNode.innerHTML = template
  const shadow = that.attachShadow({mode: 'open'})
  shadow.append(templateNode.content.cloneNode(true))
  return shadow
}

export type DynamicObject = {[key: number]: string}

export const makeArray = (obj: DynamicObject) => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {[key]: value}
  })
}

function shadeArray(el: Element | null, shade?: DynamicObject) {
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

export function setColor(shadow: ShadowRoot, color: GenColor | undefined) {
  if(!color) return
  const pallets = shadow.querySelector('.pallets')
  shadeArray(pallets, color.shade)
  const colorCSS = `background: ${color.color};`
  shadow.querySelector('.color')?.setAttribute('style', colorCSS)
  return {
    reverse: () => {
      pallets?.classList.add('reverse')
    }
  }
}

export function stringMap(array?: string[]) {
  let string = ''
  if(!array) return string
  array.forEach((s) => {string += s})
  return string
}