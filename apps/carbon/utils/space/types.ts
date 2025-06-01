export interface ValueLogCore {
  actualChange: number
  attemptedChange: number
  timestamp: number
  index: number
  type: 'banter' | 'attack' | 'shield' | 'heal'
  banter: {
    debuffs: ValueLogCore[]
    buffs: ValueLogCore[]
  }
}

export interface ValueLog extends ValueLogCore {
  oldValue: number
  newValue: number
}
