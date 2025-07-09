import type { Character, User } from '../../types'
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
  image: {
    default: 'soldier.jpg',
  },
  age: adultHumanAge,
  perks: [],
}

const user: User = {
  characters: [warrior],
  field: cards.find((card) => card.info.name === 'Village')!,
  deck: [
    { ...cards.find((card) => card.info.name === 'Halberdier')!, index: 0, },
    { ...cards.find((card) => card.info.name === 'Archer')!, index: 8 },
    // { ...cards.find((card) => card.info.name === 'Doom Cloak')!, index: 2 },
    // { ...cards.find((card) => card.info.name === 'Glimmer Cloak')!, index: 3 },
  ],
  inventory: [
    { ...cards.find((card) => card.info.name === 'Fenrir Viking')!, index: 0, },
    { ...cards.find((card) => card.info.name === 'Halberdier')!, index: 3 },
    { ...cards.find((card) => card.info.name === 'Archer')!, index: 6 },
    { ...cards.find((card) => card.info.name === 'Skeleton Archer')!, index: 9 },

  ],
}

const skeletonKing: Character = {
  id: 'skeleton king',
  name: 'Skeleton King',
  description: 'A powerful undead king',
  health: 200,
  maxHealth: 200,
  stats: mageStats,
  image: {
    default: 'skeletonKing.jpg',
  },
  age: adultHumanAge,
  perks: [],
}

const bot: User = {
  characters: [skeletonKing],
  field: cards.find((card) => card.info.name === 'Abandoned Halls')!,
  deck: [
    { ...cards.find((card) => card.info.name === 'Skeleton Archer')!, index: 0 },
    // { ...cards.find((card) => card.info.name === 'Skeleton Soldier')!, index: 1 },
    // { ...cards.find((card) => card.info.name === 'Skeleton Healer')!, index: 2 },
    // { ...cards.find((card) => card.info.name === 'Skeleton Horseman')!, index: 3 },
  ],
  inventory: [
    cards.find((card) => card.info.name === 'Alien Halls')!,
    cards.find((card) => card.info.name === 'Abandoned Halls')!,
  ],
}

export { user, bot }
