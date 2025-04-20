interface CardImage {
  default?: string
}

interface AspectImage {
  default?: string
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
  | 'undead'
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
  'Skeleton Soldier',
  'Skeleton Archer',
  'Soldier',
  'Archer',
  'Halberdier',
  'Emerald Sword',
  'Doom Cloak',
  'Swamp',
  'Alien Halls',
  'Abandoned Halls',
  'Village',
  "Idun's Apple",
  "Freyja's Tears",
  'Skeleton Healer',
  'Skeleton Horseman',
  'Gauntlet of Sigmar',
  'Glimmer Cloak',
  'Longsword',
  'Moon Harp',
  'Thunder Cannon',
  'Viking',
  'Treasure',
] as const

export interface Card {
  id: string
  name: (typeof cardNames)[number]
  bash: CardBash
  stats?: CardStats
  level: number
  maxLevel: number
  description: string
  rarity: number
  unique: boolean
  baseCost: number
  cost: number
  tags: CardTag[]
  aspects: Aspect[]
  image?: CardImage
  effect?: () => void
}

interface CardStats {
  banter?: number
  attack?: number
  shield?: number
  heal?: number
  value: number
}

export interface CardBash {
  attack?: number
  shield?: number
  heal?: number
  burn?: number
  poison?: number
  banter?: number
  terror?: number
  critChance?: number
  critDamage?: number
  actionCount?: number
  cooldown?: number // in milliseconds
}

type CardEffect = (value: number) => number

interface CardEffects {
  banter: CardEffect[]
  attack: CardEffect[]
  shield: CardEffect[]
  heal: CardEffect[]
}

export interface CardAction {
  bash: CardBash
  effects: CardEffects
  index: number
  timestamp: number
  card: Card
}
