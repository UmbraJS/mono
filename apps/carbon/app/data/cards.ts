import type { Card, CardEffect } from '../../types/card'
import { aspects } from './aspects'

// const stumble: CardEffect = ({ card }) => {
//   return {
//     sourceIndex: card.index,
//     timeType: 'slow',
//     value: 2,
//     trigger: {
//       type: 'start',
//       playerTriggerIndexes: [card.index],
//       opponentTriggerIndexes: [],
//     },
//   }
// }

// const leap: CardEffect = ({ card }) => {
//   return {
//     sourceIndex: card.index,
//     timeType: 'haste',
//     value: 1,
//     trigger: {
//       type: 'start',
//       playerTriggerIndexes: [card.index],
//       opponentTriggerIndexes: [],
//     },
//   }
// }

// const hasteYourself: CardEffect = ({ card }) => {
//   return {
//     sourceIndex: card.index,
//     timeType: 'haste',
//     value: 1,
//     trigger: {
//       type: 'cooldown',
//       playerTriggerIndexes: [card.index],
//       opponentTriggerIndexes: [],
//     },
//   }
// }

const hasteYourSibling: CardEffect = ({ card }) => {
  return {
    sourceIndex: card.card.index,
    timeType: 'haste',
    value: 1,
    trigger: {
      triggerType: 'cooldown',
      playerTriggerIndexes: [card.card.index + 1],
    },
    target: {
      playerTargetIndexes: [card.card.index + 1],
      opponentTargetIndexes: [],
    },
  }
}

const mirrorHaste: CardEffect = ({ card }) => {
  return {
    sourceIndex: card.card.index,
    timeType: 'haste',
    value: 1,
    trigger: {
      triggerType: 'cooldown',
      playerTriggerIndexes: [],
      opponentTriggerIndexes: [card.card.index],
    },
    target: {
      playerTargetIndexes: [card.card.index],
      opponentTargetIndexes: [],
    },
  }
}

// const slowSibling: CardEffect = ({ card }) => {
//   return {
//     sourceIndex: card.index,
//     type: 'slow',
//     value: 2,
//     trigger: {
//       type: 'cooldown',
//       playerTriggerIndexes: [card.index + 1],
//       opponentTriggerIndexes: [],
//     },
//   }
// }


export const fields: Card[] = [
  {
    id: 'Swamp',
    index: 0,
    info: {
      name: 'Swamp',
      description: 'A basic swamp',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'swamp.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        effects: [],
        tags: ['location'],
        aspects: [aspects.water],
        cost: 10,
        record: {},
      }
    },
  },
  {
    id: 'AlienHalls',
    index: 0,
    info: {
      name: 'Alien Halls',
      description: 'A basic alien halls',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'alienHalls.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        effects: [],
        tags: ['location'],
        aspects: [aspects.light],
        cost: 10,
        record: {},
      }
    },
  },
  {
    id: 'AbandonedHalls',
    index: 0,
    info: {
      name: 'Abandoned Halls',
      description: 'A basic abandoned halls',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'abandonedHalls.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        effects: [],
        tags: ['location'],
        aspects: [aspects.shadow],
        cost: 10,
        record: {},
      }
    }
  },
  {
    id: 'Village',
    index: 0,
    info: {
      name: 'Village',
      description: 'A basic village',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'village.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        effects: [],
        tags: ['location'],
        aspects: [aspects.wood],
        cost: 10,
        record: {},
      }
    },
  }
]
export const cards: Card[] = [
  {
    id: 'skeleton-soldier',
    index: 0,
    info: {
      name: 'Skeleton Soldier',
      description: 'A basic skeleton',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'skeletonSoldier.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 2, shield: 5, cooldown: 2 },
        effects: [],
        tags: ['servant', 'undead'],
        aspects: [aspects.shadow],
        record: {},
      },
    },
  },
  {
    id: 'skeleton-archer',
    index: 0,
    info: {
      name: 'Skeleton Archer',
      description: 'A basic skeleton archer',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'skeletonArcher.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 7, shield: 3, cooldown: 3 },
        effects: [],
        tags: ['servant', 'undead'],
        aspects: [aspects.shadow],
        record: {},
      },
    },
  },
  {
    id: 'archer',
    index: 0,
    info: {
      name: 'Archer',
      description: 'A basic archer',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'archer.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 7, cooldown: 2 },
        effects: [],
        tags: ['servant'],
        aspects: [aspects.wood],
        record: {},
      },
    },
  },
  {
    id: 'halberdier',
    index: 0,
    info: {
      name: 'Halberdier',
      description: 'A basic halberdier',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'halberdier.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 10, shield: 10, cooldown: 5 },
        effects: [hasteYourSibling],
        tags: ['servant'],
        aspects: [aspects.metal],
        record: {},
      },
    },
  },
  {
    id: 'DoomCloak',
    index: 0,
    info: {
      name: 'Doom Cloak',
      description: 'A basic doom cloak',
      levels: [],
      rarity: 2,
      unique: false,
      image: {
        default: 'doomCloak.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 20, shield: 20, cooldown: 10 },
        effects: [],
        tags: ['friend'],
        aspects: [aspects.shadow],
        record: {},
      },
    },
  },
  {
    id: 'Skeleton Healer',
    index: 0,
    info: {
      name: 'Skeleton Healer',
      description: 'A basic skeleton healer',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'skeletonHealer.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { heal: 10, cooldown: 3 },
        effects: [],
        tags: ['servant'],
        aspects: [aspects.shadow],
        record: {},
      },
    },
  },
  {
    id: 'Skeleton Horseman',
    index: 0,
    info: {
      name: 'Skeleton Horseman',
      description: 'A basic skeleton horseman',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'skeletonCavalry.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 7, shield: 5, cooldown: 3.5 },
        effects: [],
        tags: ['servant'],
        aspects: [aspects.shadow],
        record: {},
      },
    },
  },
  {
    id: 'Gauntlet of Sigmar',
    index: 0,
    info: {
      name: 'Gauntlet of Sigmar',
      description: 'A basic gauntlet of sigmar',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'gauntletOfSigmar.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 10, shield: 10, actionCount: 1, cooldown: 5 },
        effects: [],
        tags: ['weapon'],
        aspects: [aspects.metal],
        record: {},
      },
    },
  },
  {
    id: 'Glimmer Cloak',
    index: 0,
    info: {
      name: 'Glimmer Cloak',
      description:
        'When this enchantment enters, if its your main phase, there is an additional combat phase after this phase followed by an additional main phase. When you next attack this turn, untap each creature you control.',
      levels: [],
      rarity: 1,
      unique: true,
      image: {
        default: 'glimmerCloak.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 5, banter: 5, heal: 5, shield: 10, cooldown: 3 },
        effects: [],
        tags: ['friend'],
        aspects: [aspects.light],
        record: {},
      },
    },
  },
  {
    id: 'viking',
    index: 0,
    info: {
      name: 'Viking',
      description: 'A basic viking',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'viking.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 10, shield: 5, actionCount: 1, cooldown: 5 },
        effects: [],
        tags: ['servant'],
        aspects: [aspects.metal],
        record: {},
      },
    },
  },
  {
    id: 'Thunder Cannon',
    index: 0,
    info: {
      name: 'Thunder Cannon',
      description: 'A basic thunder cannon',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'thunderCannon.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { attack: 20, actionCount: 1, cooldown: 5 },
        effects: [],
        tags: ['weapon'],
        aspects: [aspects.charge],
        record: {},
      },
    },
  },
  {
    id: 'Treasure',
    index: 0,
    info: {
      name: 'Treasure',
      description: 'A basic treasure',
      levels: [],
      rarity: 1,
      unique: false,
      image: {
        default: 'treasure.jpg',
      },
    },
    stats: {
      base: {
        level: 1,
        cost: 10,
        bash: { cooldown: 5 },
        effects: [],
        tags: ['trinket'],
        aspects: [aspects.metal],
        record: {},
      },
    },
  },
]
