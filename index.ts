import { myriad, randomMyriad, MyriadOutput } from "./engine/index"
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import { GenScheme, GenSchemeBasic, MyriadSettings, Myriad, GenColor } from './engine/store/types'

export {
  myriad,
  randomMyriad,
  getReadable,
  colorAlly,
}

export type {
  Myriad,
  GenColor,
  GenScheme,
  GenSchemeBasic,
  MyriadSettings,
  MyriadOutput,
}