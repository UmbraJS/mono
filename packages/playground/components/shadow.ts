import { u } from '../main'

export function shadowDOM(that: any, template: string) {
  const templateNode = document.createElement('template')
  templateNode.innerHTML = template
  const shadow = that.attachShadow({ mode: 'open' })
  shadow.append(templateNode.content.cloneNode(true))
  return shadow
}

const getArray = (name: string) => {
  return u.output.ranges.filter((c) => c.name === name)
}

function shadeArray(el: Element | null, name?: string, index: number = 0) {
  if (!name || !el) return

  const shades = getArray(name)[index].shades
  const pallet = el

  const id = index ? index + 1 : 0
  const number = id > 1 ? id : ''
  const n = name === 'accent' ? 'accent' + number : name

  if (!pallet) return

  shades.forEach((_, index) => {
    const value = `var(--${n}-${index * 10 + 10})`
    const div = document.createElement('div')
    div.style.backgroundColor = value
    div.innerHTML = '' + (index * 10 + 10) || '0'
    pallet.appendChild(div)
  })
}

export function setColor(shadow: ShadowRoot, name: string, index?: number) {
  const pallets = shadow.querySelector('.pallets')
  if (name === 'accents') name = 'accent'
  shadeArray(pallets, name, index)

  const id = index ? index + 1 : 0
  const number = id > 1 ? id : ''
  const n = name === 'accent' ? 'accent' + number : name

  const colorCSS = `background: var(--${n});`
  shadow.querySelector('.color')?.setAttribute('style', colorCSS)
  return {
    reverse: () => {
      pallets?.classList.add('reverse')
    }
  }
}

export function stringMap(array?: string[]) {
  let string = ''
  if (!array) return string
  array.forEach((s) => {
    string += s
  })
  return string
}
