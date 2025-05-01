import type { ElementRef } from './utils'
import type { ModifierChunk, OutputChunk } from "../utils/types";

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

export interface SimCard extends Card {
  cooldownEvents: {
    baseDuration: number;
    duration: number;
    chunks: OutputChunk[];
  }[];
  modifiers: ModifierChunk[]; // Modifiers waiting to be applied on next cooldown
  remainingCooldown: number; // Seconds left until trigger
  count: number; // Number of times this card has been played
  owner: Owner; // Owner of the card
}

export interface Card {
  id: string
  index: number
  name: (typeof cardNames)[number]
  bash: CardBash
  effects: CardEffect[]
  stats: CardStats
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
}

interface CardStats {
  banter?: number
  attack?: number
  shield?: number
  heal?: number
  value?: number
}

export interface CardBash {
  attack?: number
  shield?: number
  heal?: number
  banter?: number
  critChance?: number
  critDamage?: number
  actionCount?: number
  cooldown?: number // in milliseconds
}

export interface CardModifier {
  value: number
  type: "haste" | "slow" | "freeze"
  trigger: {
    type: "trigger" | "cooldown" | "start" | "end" | "banter" | "attack" | "shield" | "heal"
    playerTriggerIndexes: number[]
    opponentTriggerIndexes: number[]
  }
}

export type CardEffect = (card: Card) => CardModifier

export interface CardAction {
  bash: CardBash
  index: number
  timestamp: number
  card: Card
}
