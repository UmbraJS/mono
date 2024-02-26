// @ts-ignore
import nearestColor from 'nearest-color'
import { c } from './colornames' //'color-name-list'

type nearestType = (hex: string) => {
  name: string
  value: string
}

const colors = c.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {})
const nearest: nearestType = nearestColor.from(colors)

export function colorName(hex?: string) {
  if (!hex) return nearest('#000')
  return nearest(hex)
}
