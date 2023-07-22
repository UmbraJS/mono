import tinycolor from "tinycolor2";
import { GeneratedScheme } from "../"
import { generated } from "../main"

export function shadowDOM(that: any, template: string) {
  const templateNode = document.createElement('template')
  templateNode.innerHTML = template
  const shadow = that.attachShadow({mode: 'open'})
  shadow.append(templateNode.content.cloneNode(true))
  return shadow
}

export type DynamicObject = {[key: number]: tinycolor.Instance}

const makeArray = (obj: DynamicObject) => {
  const objArray = Object.entries(obj)
  return objArray.map(([key, value]) => {
    return {[key]: value}
  })
}

const getArray = (name?: string, index?: number) => {
  if(!name) return
  const myriadBasic: GeneratedScheme = generated.colors
  const color = myriadBasic[name as keyof typeof myriadBasic]

  if(!color) return []
  if(Array.isArray(color)) {
    return makeArray(color[index || 0].shades)
  } else {
    return makeArray(color.shades)
  }
}

function shadeArray(el: Element | null, name?: string, index?: number) {
  if(!name || !el) return
  const shades = getArray(name, index)
  const pallet = el
  if(!pallet || !shades) return
  shades.forEach((shade) => {
    //setup
    const key = Object.keys(shade)[0]
    if(name === 'accents') name = 'accent'
    const value = `var(--${name}-${key})`
    const div = document.createElement('div')
    //assign
    div.style.backgroundColor = value
    div.innerHTML = key || '0'
    pallet.appendChild(div)
  })
}
 
export function setColor(shadow: ShadowRoot, name: string, index?: number) {
  const pallets = shadow.querySelector('.pallets')
  shadeArray(pallets, name, index)
  if(name === 'accents') name  = 'accent'
  
  const colorCSS = `background: var(--${name});`
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