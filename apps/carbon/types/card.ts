interface CardImage {
  default: string
}

interface AspectImage {
  default: string
  1?: string
  2?: string
  3?: string
  4?: string
  5?: string
  6?: string
}

type CardTag =
  | 'tool'
  | 'weapon'
  | 'armor'
  | 'spell'
  | 'friend'
  | 'servant'
  | 'location'
  | 'land'
  | 'artifact'
  | 'trap'
  | 'trinket'
  | 'event'
  | 'furniture'
  | 'food'
  | 'drink'
  | 'mount'
  | 'pet'
  | 'action'

type AspectType =
  | 'fire'
  | 'water'
  | 'earth'
  | 'air'
  | 'light'
  | 'darkness'
  | 'metal'
  | 'wood'
  | 'stone'
  | 'ice'
  | 'electricity'
  | 'psychic'
  | 'time'
  | 'kinetic'
  | 'poison'
  | 'lightning'

export interface Aspect {
  name: string
  description: string
  image?: AspectImage
  type: AspectType
  level: number
  effect?: () => void
}

const cardNames = [
  'Fireball',
  'Water Splash',
  'Earth Quake',
  'Air Slice',
  'Light Blast',
  'Darkness Shroud',
  'Sword',
  'Wooden Shield',
  'Stone Armor',
  'Ice Shard',
  'Electric Bolt',
  'Psychic Wave',
  'Arrow',
  'Bow',
  'Dagger',
  'Bite',
] as const

export interface Card {
  id: string
  name: (typeof cardNames)[number]
  stats: CardStats
  level: number
  maxLevel: number
  description: string
  rarity: number
  baseCost: number
  cost: number
  tags: CardTag[]
  aspects: Aspect[]
  image?: CardImage
  effect?: () => void
}

export interface CardStats {
  attack: number
  shield: number
  heal: number
  burn: number
  poison: number
  actionRate: number // in milliseconds
}
