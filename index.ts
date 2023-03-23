import { myriad, randomMyriad } from "./engine/index"
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import { MyriadOutput, MyriadOutputBasic, MyriadSettings, Myriad, GenColor } from './engine/store/types'

export {
  myriad,
  randomMyriad,
  getReadable,
  colorAlly,
}

export type {
  Myriad,
  MyriadOutput,
  MyriadOutputBasic,
  MyriadSettings,
  GenColor
}