import type { ElementRef } from './utils'
import type { ModifierChunk, OutputChunk } from '../utils/time/types';

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

const _cardNames = [
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
  'Idun\'s Apple',
  'Freyja\'s Tears',
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

export type CardName = (typeof _cardNames)[number]

export interface ReactiveCard extends Card {
  index: number;
  cooldown: Ref<number, number>;
  cardTimeline: gsap.core.Timeline;
  functionRef: (el: ElementRef) => void;
  slow: Ref<number, number>;
  haste: Ref<number, number>;
  setSlow: (duration: number) => void;
  setHaste: (duration: number) => void;
}

export type Owner = 'player' | 'opponent';

export interface PreSimulationCard {
  card: Card;
  cardStats: CardStats;
}

export interface SimCard extends PreSimulationCard {
  owner: {
    user: Owner;
    characterIndex: number;
  };
  simulation: {
    chunks: OutputChunk[];
    modifiers: ModifierChunk[]; // Modifiers waiting to be applied on next cooldown
    lifetime: number[]; // Amount of time in cooldowns passed for this card
  }
}

export interface CardStatRealms {
  base: CardStats
  quest?: CardStats
  campaign?: CardStats
}

export interface Card {
  id: string
  index: number
  size: number
  info: CardInfo
  stats: CardStatRealms
}

export interface CardInfo {
  name: CardName
  levels: CardStats[]
  description: string
  rarity: number
  unique: boolean
  image?: CardImage
}

export interface CardStats {
  cost: number
  bash?: CardBash
  effects: CardEffect[]
  aspects: Aspect[]
  tags: CardTag[]
  record: CardRecord
  level: number
}

interface CardRecord {
  banter?: number
  attack?: number
  shield?: number
  heal?: number
  value?: number
}

// interface StatComposite {
//   value: number // Total value of the stat
//   baseValue: number // Base value of the stat
//   upgrades: {
//     name: string // Name of the upgrade card
//     tier: number // Tier of the upgrade
//     times: number // How many times this upgrade has been applied
//     value: number // Total value of the upgrade
//   }[]
// }

export interface CardBash {
  attack?: number
  shield?: number
  heal?: number
  banter?: number
  critChance?: number
  critDamage?: number
  actionCount?: number
  cooldown: number
}

export interface TimeEffect {
  value: number
  timeType: 'haste' | 'slow' | 'freeze'
  trigger: {
    triggerType: 'event' | 'cooldown' | 'start' | 'end'
    playerTriggerIndexes?: number[]
    opponentTriggerIndexes?: number[]
  },
  target: {
    playerTargetIndexes: number[]
    opponentTargetIndexes: number[]
  }
}

export type CardEffect = (props: {
  card: SimCard
  opponentCards: SimCard[]
  playerCards: SimCard[]
}) => TimeEffect

export interface CardAction {
  bash: CardBash
  index: number
  timestamp: number
  card: SimCard
}
