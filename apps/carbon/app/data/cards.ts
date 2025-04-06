import type { Card } from '../../types/card'
import { aspects } from './aspects'

export const fields: Card[] = [
  {
    id: 'Swamp',
    name: 'Swamp',
    bash: { cooldown: 5 },
    level: 1,
    unique: false,
    maxLevel: 5,
    description: 'A basic swamp',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['location'],
    aspects: [aspects.water],
    image: {
      default: 'swamp.jpg',
    },
  },
  {
    id: 'AlienHalls',
    name: 'Alien Halls',
    bash: { cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic alien halls',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['location'],
    aspects: [aspects.light],
    image: {
      default: 'alienHalls.jpg',
    },
  },
  {
    id: 'AbandonedHalls',
    name: 'Abandoned Halls',
    bash: { cooldown: 5 },
    level: 1,
    unique: false,
    maxLevel: 5,
    description: 'A basic abandoned halls',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['location'],
    aspects: [aspects.shadow],
    image: {
      default: 'abandonedHalls.jpg',
    },
  },
  {
    id: 'Village',
    name: 'Village',
    bash: { cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic village',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['location'],
    aspects: [aspects.wood],
    image: {
      default: 'village.jpg',
    },
  },
]

export const cards: Card[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    bash: {
      attack: 10,
      burn: 5,
      actionCount: 1,
      cooldown: 5,
    },
    level: 1,
    unique: false,
    maxLevel: 5,
    description: 'A basic fire spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.ember, aspects.air],
    image: {
      default: 'https://example.com/fireball.png',
    },
  },
  {
    id: 'water-splash',
    name: 'Water Splash',
    bash: {
      attack: 5,
      actionCount: 1,
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic water spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.water],
    image: {
      default: 'https://example.com/water-splash.png',
    },
  },
  {
    id: 'earth-quake',
    name: 'Earth Quake',
    bash: {
      attack: 15,
      actionCount: 1,
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic earth spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.rock],
    image: {
      default: 'https://example.com/earth-quake.png',
    },
  },
  {
    id: 'air-slice',
    name: 'Air Slice',
    bash: { attack: 8, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic air spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.air, aspects.slash],
    image: {
      default: 'https://example.com/air-slice.png',
    },
  },
  {
    id: 'light-blast',
    name: 'Light Blast',
    bash: { attack: 12, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic light spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.light],
    image: {
      default: 'https://example.com/light-blast.png',
    },
  },
  {
    id: 'darkness-shroud',
    name: 'Darkness Shroud',
    bash: { attack: 0, shield: 5, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic darkness spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.shadow],
    image: {
      default: 'https://example.com/darkness-shroud.png',
    },
  },
  {
    id: 'sword',
    name: 'Sword',
    bash: { attack: 15, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic sword',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.slash, aspects.metal],
    image: {
      default: 'sword.png',
    },
  },
  {
    id: 'wooden-shield',
    name: 'Wooden Shield',
    bash: { attack: 0, shield: 10, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic wood spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.wood],
    image: {
      default: 'https://example.com/wooden-shield.png',
    },
  },
  {
    id: 'stone-armor',
    name: 'Stone Armor',
    bash: { attack: 0, shield: 15, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic stone spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.rock],
    image: {
      default: 'https://example.com/stone-armor.png',
    },
  },
  {
    id: 'ice-shard',
    name: 'Ice Shard',
    bash: { attack: 7, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic ice spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.ice],
    image: {
      default: 'https://example.com/ice-shard.png',
    },
  },
  {
    id: 'electric-bolt',
    name: 'Electric Bolt',
    bash: { attack: 9, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic electricity spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.charge],
    image: {
      default: 'https://example.com/electric-bolt.png',
    },
  },
  {
    id: 'psychic-wave',
    name: 'Psychic Wave',
    bash: { attack: 6, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic psychic spell',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['spell'],
    aspects: [aspects.warpWeave],
    image: {
      default: 'https://example.com/psychic-wave.png',
    },
  },
  {
    id: 'arrow',
    name: 'Arrow',
    bash: { attack: 8, shield: 0, heal: 0, burn: 0, poison: 0, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic arrow',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.wood, aspects.slash],
    image: {
      default: 'https://example.com/arrow.png',
    },
  },
  {
    id: 'bow',
    name: 'Bow',
    bash: { attack: 10, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic bow',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.wood],
    image: {
      default: 'https://example.com/bow.png',
    },
  },
  {
    id: 'dagger',
    name: 'Dagger',
    bash: { attack: 5, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic dagger',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.slash],
    image: {
      default: 'https://example.com/dagger.png',
    },
  },
  {
    id: 'bite',
    name: 'Bite',
    bash: { attack: 3, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic bite',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['action'],
    aspects: [],
    image: {
      default: 'https://example.com/bite.png',
    },
  },
  {
    id: 'skeleton-soldier',
    name: 'Skeleton Soldier',
    bash: { attack: 5, shield: 5, cooldown: 3 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic skeleton',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant', 'undead'],
    aspects: [aspects.shadow],
    image: {
      default: 'skeletonSoldier.jpg',
    },
  },
  {
    id: 'skeleton-archer',
    name: 'Skeleton Archer',
    bash: { attack: 7, shield: 3, cooldown: 3 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic skeleton archer',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant', 'undead'],
    aspects: [aspects.shadow],
    image: {
      default: 'skeletonArcher.jpg',
    },
  },
  {
    id: 'archer',
    name: 'Archer',
    bash: { attack: 7, cooldown: 2 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic archer',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant'],
    aspects: [aspects.wood],
    image: {
      default: 'archer.jpg',
    },
  },
  {
    id: 'halberdier',
    name: 'Halberdier',
    bash: { attack: 10, shield: 5, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic halberdier',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant'],
    aspects: [aspects.metal],
    image: {
      default: 'halberdier.jpg',
    },
  },
  {
    id: 'EmeraldSword',
    name: 'Emerald Sword',
    bash: { attack: 20, cooldown: 5 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic emerald sword',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.slash, aspects.metal],
    image: {
      default: 'emeraldSword.jpg',
    },
  },
  {
    id: 'DoomCloak',
    name: 'Doom Cloak',
    bash: { attack: 20, shield: 20, cooldown: 7 },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic doom cloak',
    rarity: 2,
    baseCost: 10,
    cost: 10,
    tags: ['friend'],
    aspects: [aspects.shadow],
    image: {
      default: 'doomCloak.jpg',
    },
  },
  {
    id: 'Skeleton Healer',
    name: 'Skeleton Healer',
    bash: {
      heal: 10,
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic skeleton healer',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant'],
    aspects: [aspects.shadow],
    image: {
      default: 'skeletonHealer.jpg',
    },
  },
  {
    id: 'Skeleton Horseman',
    name: 'Skeleton Horseman',
    bash: {
      attack: 10,
      cooldown: 4,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic skeleton horseman',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant'],
    aspects: [aspects.shadow],
    image: {
      default: 'skeletonCavalry.jpg',
    },
  },
  {
    id: 'Gauntlet of Sigmar',
    name: 'Gauntlet of Sigmar',
    bash: {
      attack: 10,
      shield: 10,
      actionCount: 1,
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic gauntlet of sigmar',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.metal],
    image: {
      default: 'gauntletOfSigmar.jpg',
    },
  },
  {
    id: 'Glimmer Cloak',
    name: 'Glimmer Cloak',
    bash: {
      attack: 5,
      banter: 5,
      burn: 5,
      heal: 5,
      poison: 5,
      terror: 5,
      shield: 10,
      cooldown: 10,
    },
    level: 1,
    unique: true,
    maxLevel: 5,
    description:
      'When this enchantment enters, if its your main phase, there is an additional combat phase after this phase followed by an additional main phase. When you next attack this turn, untap each creature you control.',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['friend'],
    aspects: [aspects.light],
    image: {
      default: 'glimmerCloak.jpg',
    },
  },
  {
    id: 'viking',
    name: 'Viking',
    bash: {
      attack: 10,
      shield: 5,
      actionCount: 1,
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic viking',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['servant'],
    aspects: [aspects.metal],
    image: {
      default: 'viking.jpg',
    },
  },
  {
    id: 'Thunder Cannon',
    name: 'Thunder Cannon',
    bash: {
      attack: 20,
      actionCount: 1,
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic thunder cannon',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.charge],
    image: {
      default: 'thunderCannon.jpg',
    },
  },
  {
    id: 'Treasure',
    name: 'Treasure',
    bash: {
      cooldown: 5,
    },
    level: 1,
    unique: false,

    maxLevel: 5,
    description: 'A basic treasure',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['trinket'],
    aspects: [aspects.metal],
    image: {
      default: 'treasure.jpg',
    },
  },
]
