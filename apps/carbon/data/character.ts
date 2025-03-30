import type { Character } from '../types'
import { cards } from './cards'

const soldierStats = {
  charisma: 5,
  strength: 10,
  speed: 5,
  constitution: 8,
  intelligence: 3,
  dexterity: 4,
  faith: 2,
  luck: 3,
}

const mageStats = {
  charisma: 4,
  strength: 3,
  speed: 5,
  constitution: 4,
  intelligence: 10,
  dexterity: 6,
  faith: 5,
  luck: 4,
}

const archerStats = {
  charisma: 5,
  strength: 6,
  speed: 7,
  constitution: 5,
  intelligence: 4,
  dexterity: 10,
  faith: 3,
  luck: 4,
}

const rougeStats = {
  charisma: 8,
  strength: 5,
  speed: 10,
  constitution: 4,
  intelligence: 6,
  dexterity: 9,
  faith: 2,
  luck: 7,
}

const dogStats = {
  charisma: 2,
  strength: 5,
  speed: 8,
  constitution: 6,
  intelligence: 3,
  dexterity: 7,
  faith: 4,
  luck: 5,
}

const adultHumanAge: Character['age'] = {
  years: 20,
  stage: 'adult',
}

const characters: Character[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A brave and strong fighter',
    health: 150,
    maxHealth: 150,
    stats: soldierStats,
    image: {
      default: 'https://example.com/warrior.png',
    },
    age: adultHumanAge,
    perks: [],
    deck: [
      cards.find((card) => card.name === 'Wooden Shield')!,
      cards.find((card) => card.name === 'Sword')!,
    ],
    inventory: [],
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'A wise and powerful spellcaster',
    health: 100,
    maxHealth: 100,
    stats: mageStats,
    image: {
      default: 'https://example.com/mage.png',
    },
    perks: [],
    age: adultHumanAge,
    deck: [
      cards.find((card) => card.name === 'Fireball')!,
      cards.find((card) => card.name === 'Water Splash')!,
    ],
    inventory: [],
  },
  {
    id: 'archer',
    name: 'Archer',
    description: 'A skilled marksman with a bow',
    health: 120,
    maxHealth: 120,
    stats: {
      ...soldierStats,
      strength: 7,
      dexterity: 10,
    },
    image: {
      default: 'https://example.com/archer.png',
    },
    perks: [],
    age: adultHumanAge,

    deck: [
      cards.find((card) => card.name === 'Bow')!,
      cards.find((card) => card.name === 'Arrow')!,
    ],
    inventory: [],
  },
  {
    id: 'rouge',
    name: 'Rouge',
    description: 'A stealthy and agile thief',
    health: 110,
    maxHealth: 110,
    stats: rougeStats,
    image: {
      default: 'https://example.com/rouge.png',
    },
    perks: [],
    age: adultHumanAge,

    deck: [cards.find((card) => card.name === 'Dagger')!],
    inventory: [],
  },
  {
    id: 'dog',
    name: 'Dog',
    description: 'A loyal companion',
    health: 80,
    maxHealth: 80,
    stats: dogStats,
    age: {
      years: 5,
      stage: 'adult',
    },
    image: {
      default: 'https://example.com/dog.png',
    },
    perks: [],
    deck: [cards.find((card) => card.name === 'Bite')!],
    inventory: [],
  },
]
