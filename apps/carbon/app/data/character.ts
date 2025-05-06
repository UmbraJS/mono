import type { Character } from '../../types'
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

const adultHumanAge: Character['age'] = {
  years: 20,
  stage: 'adult',
}

const warrior: Character = {
  id: 'warrior',
  name: 'Warrior',
  description: 'A brave and strong fighter',
  health: 150,
  maxHealth: 150,
  stats: soldierStats,
  field: cards.find((card) => card.name === 'Village')!,
  image: {
    default: 'soldier.jpg',
  },
  age: adultHumanAge,
  perks: [],
  deck: [
    // cards.find((card) => card.name === 'Archer')!,
    cards.find((card) => card.name === 'Halberdier')!,
    cards.find((card) => card.name === 'Doom Cloak')!,
    // cards.find((card) => card.name === 'Glimmer Cloak')!,
  ],
  inventory: [
    cards.find((card) => card.name === 'Village')!,
    cards.find((card) => card.name === 'Swamp')!,
  ],
}

const skeletonKing: Character = {
  id: 'skeleton king',
  name: 'Skeleton King',
  description: 'A powerful undead king',
  health: 200,
  maxHealth: 200,
  stats: mageStats,
  field: cards.find((card) => card.name === 'Abandoned Halls')!,
  image: {
    default: 'skeletonKing.jpg',
  },
  age: adultHumanAge,
  perks: [],
  deck: [
    // cards.find((card) => card.name === 'Skeleton Archer')!,
    // cards.find((card) => card.name === 'Skeleton Soldier')!,
    // cards.find((card) => card.name === 'Skeleton Healer')!,
    // cards.find((card) => card.name === 'Skeleton Horseman')!,
  ],
  inventory: [
    cards.find((card) => card.name === 'Alien Halls')!,
    cards.find((card) => card.name === 'Abandoned Halls')!,
  ],
}

export { warrior, skeletonKing }
