import type { Character, User, Card } from '../../types'
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
  field: cards.find((card) => card.info.name === 'Village') || cards[0]!, // Use first card as fallback
  deck: [
    { ...cards.find((card) => card.info.name === 'Archer'), index: 0 },
    { ...cards.find((card) => card.info.name === 'Halberdier'), index: 2 },
    { ...cards.find((card) => card.info.name === 'Doom Cloak'), index: 5 },
  ].filter((card): card is Card => card !== undefined),
  inventory: [
    cards.find((card) => card.info.name === 'Fenrir Viking'),
    cards.find((card) => card.info.name === 'Halberdier'),
    cards.find((card) => card.info.name === 'Archer'),
    cards.find((card) => card.info.name === 'Skeleton Archer'),
  ].filter((card): card is Card => card !== undefined).map((card, index) => ({ ...card, index: index * 3 })),
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
  field: cards.find((card) => card.info.name === 'Abandoned Halls') || cards[0]!,
  deck: [
    { ...cards.find((card) => card.info.name === 'Skeleton Archer')!, owner: { board: 'opponent', characterIndex: 0 } },
  ].filter((card): card is Card => card !== undefined).map((card, index) => ({ ...card, index: index })),
  inventory: [
    cards.find((card) => card.info.name === 'Alien Halls'),
    cards.find((card) => card.info.name === 'Abandoned Halls'),
  ].filter((card): card is Card => card !== undefined),
}

export { user, bot }
