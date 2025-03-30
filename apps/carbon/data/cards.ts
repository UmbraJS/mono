import type { Card } from '../types/card'
import { aspects } from './aspects'

export const cards: Card[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    stats: { attack: 10, shield: 0, heal: 0, burn: 5, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 5, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 15, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 8, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 12, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 0, shield: 5, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 15, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
    maxLevel: 5,
    description: 'A basic sword',
    rarity: 1,
    baseCost: 10,
    cost: 10,
    tags: ['weapon'],
    aspects: [aspects.slash, aspects.metal],
    image: {
      default: 'https://example.com/sword.png',
    },
  },
  {
    id: 'wooden-shield',
    name: 'Wooden Shield',
    stats: { attack: 0, shield: 10, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 0, shield: 15, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 7, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 9, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 6, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 8, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 10, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 5, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
    stats: { attack: 3, shield: 0, heal: 0, burn: 0, poison: 0, actionRate: 5 },
    level: 1,
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
]
