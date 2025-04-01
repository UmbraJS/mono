import type { Card } from './card'

interface CharacterImage {
  default: string
  casual?: string
  formal?: string
  angry?: string
  happy?: string
  sad?: string
  surprised?: string
  embarrassed?: string
  flirty?: string
  sleepy?: string
  confused?: string
  scared?: string
  bored?: string
  annoyed?: string
  excited?: string
  traumatized?: string
  tortured?: string
  possessed?: string
  reanimated?: string
  proud?: string
  swimsuit?: string
  punished?: string
  naked?: string
  submissive?: string
  dominant?: string
  eating?: string
  servant?: string
  slave?: string
  victory?: string
  defeat?: string
  hurt?: string
  death?: string
  burial?: string
  pregnant?: string
  birth?: string
}

interface CharacterStats {
  charisma: number
  strength: number
  speed: number
  constitution: number
  intelligence: number
  dexterity: number
  faith: number
  luck: number
}

export interface Player extends Character {
  money: number
  interest: number
  endurance: number
  experience: number
  level: number
}

export interface Character {
  id: string
  name: string
  description: string
  health: number
  maxHealth: number
  field: string
  deck: Card[]
  stats: CharacterStats
  inventory: Card[]
  perks: Perks[]
  image?: CharacterImage
  age: {
    years: number
    stage: 'child' | 'adult' | 'elder'
  }
}

export interface Perks {
  name: string
  description: string
  effect: () => void
}
