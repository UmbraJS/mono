import type { Player, Character } from './character'

export interface GameState {
  player: Player
  availableNPCs: Character[]
  maxEndurance: number
}

export const timeStates = ['morning', 'afternoon', 'evening', 'night'] as const
export type TimeState = (typeof timeStates)[number]

export interface GameTime {
  day: number
  hour: number
  state: TimeState
}
