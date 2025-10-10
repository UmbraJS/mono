import type { Card, CardEffect, CardOwner } from '../../types/card'
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

const hasteYourSibling: CardEffect = {
  name: 'Haste Your Sibling',
  description: 'Haste your siblings 1 second',
  image: {
    default: 'hasteYourSibling.jpg',
  },
  action: ({ card }) => {
    const rightSiblingIndex = card.index + card.size;
    return {
      sourceIndex: card.index,
      timeType: 'haste',
      value: 1,
      trigger: {
        triggerType: 'cooldown',
        playerTriggerIndexes: [card.index],
      },
      target: {
        playerTargetIndexes: [rightSiblingIndex],
        opponentTargetIndexes: [],
      },
    }
  }
}

// const mirrorHaste: CardEffect = ({ card }) => {
//   return {
//     sourceIndex: card.card.index,
//     timeType: 'haste',
//     value: 1,
//     trigger: {
//       triggerType: 'cooldown',
//       playerTriggerIndexes: [],
//       opponentTriggerIndexes: [card.card.index],
//     },
//     target: {
//       playerTargetIndexes: [card.card.index],
//       opponentTargetIndexes: [],
//     },
//   }
// }

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

const defaultOwner: CardOwner = {
  board: 'player',
  characterIndex: 0,
}

export const fields: Card[] = [
  {
    id: 'Swamp',
    index: 0,
    size: 3,
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
      level: 1,
      effects: [],
      tags: [],
      aspects: [aspects.water],
      slot: 'field',
      cost: 10,
      record: {},
    },
    owner: defaultOwner,
  },
  {
    id: 'AlienHalls',
    index: 0,
    size: 3,
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
      level: 1,
      effects: [],
      tags: [],
      aspects: [aspects.light],
      slot: 'field',
      cost: 10,
      record: {},
    },
    owner: defaultOwner,
  },
  {
    id: 'AbandonedHalls',
    index: 0,
    size: 3,
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
      level: 1,
      effects: [],
      tags: [],
      aspects: [aspects.shadow],
      slot: 'field',
      cost: 10,
      record: {},
    },
    owner: defaultOwner,
  },
  {
    id: 'Village',
    index: 0,
    size: 3,
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
      level: 1,
      effects: [],
      tags: [],
      aspects: [aspects.wood],
      slot: 'field',
      cost: 10,
      record: {},
    },
    owner: defaultOwner,
  }
]

const skeletonSoldier: Card = {
  id: 'skeleton-soldier',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { attack: 2, shield: 5, cooldown: 2, castTime: 1, actionCount: 1 },
    slot: 'army',
    effects: [],
    tags: ['guard', 'undead'],
    aspects: [aspects.shadow],
    record: {},
  },
  owner: defaultOwner,
}

const skeletonArcher: Card = {
  id: 'skeleton-archer',
  index: 0,
  size: 1,
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
    level: 1,
    cost: 10,
    bash: { attack: 7, shield: 3, cooldown: 3, castTime: 1, actionCount: 1 },
    effects: [],
    slot: 'army',
    tags: ['guard', 'undead'],
    aspects: [aspects.shadow],
    record: {},
  },
  owner: defaultOwner,
}

const archer: Card = {
  id: 'archer',
  index: 0,
  size: 2,
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
    level: 1,
    cost: 10,
    bash: { attack: 7, cooldown: 2, castTime: 1, actionCount: 1 },
    slot: 'army',
    effects: [],
    tags: ['guard'],
    aspects: [aspects.wood],
    record: {},
  },
  owner: defaultOwner,
}


const halberdier: Card = {
  id: 'halberdier',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { attack: 10, shield: 10, cooldown: 5, castTime: 1, actionCount: 1 },
    effects: [hasteYourSibling],
    slot: 'army',
    tags: ['guard'],
    aspects: [aspects.metal],
    record: {},
  },
  owner: defaultOwner,
}

const doomCloak: Card = {
  id: 'DoomCloak',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { attack: 20, shield: 20, cooldown: 10, castTime: 1, actionCount: 1 },
    effects: [],
    slot: 'cloak',
    tags: ['guard'],
    aspects: [aspects.shadow],
    record: {},
  },
  owner: defaultOwner,
}

const skeletonHealer: Card = {
  id: 'Skeleton Healer',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { heal: 10, cooldown: 3, castTime: 1, actionCount: 1 },
    slot: 'army',
    effects: [],
    tags: ['guard', 'undead'],
    aspects: [aspects.shadow],
    record: {},
  },
  owner: defaultOwner,
}

const skeletonHorseman: Card = {
  id: 'Skeleton Horseman',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { attack: 7, shield: 5, cooldown: 3.5, castTime: 1, actionCount: 1 },
    slot: 'army',
    effects: [],
    tags: ['guard', 'undead'],
    aspects: [aspects.shadow],
    record: {},
  },
  owner: defaultOwner,
}

export const gauntletOfSigmar: Card = {
  id: 'Gauntlet of Sigmar',
  index: 0,
  size: 3,
  info: {
    name: 'Gauntlet of Sigmar',
    description: 'Once worn by the Stormwarden, the gauntlet now chooses its bearer. It pulses with crimson sigils – runes of ancient power that glow only in the presence of true resolve or immense wrath. The one who dons it is said to become a conduit of divine judgment, capable of turning the tide of any battle – or collapsing entire armies in a single strike.',
    quote: '"You deserve this." — Inquisitor Varran, last bearer of the Gauntlet',
    levels: [],
    rarity: 1,
    unique: false,
    image: {
      default: 'sigmarGauntlet.jpg',
    },
  },
  stats: {
    level: 1,
    cost: 10,
    bash: { attack: 20, shield: 10, actionCount: 1, cooldown: 5, castTime: 1, },
    slot: 'hands',
    effects: [hasteYourSibling],
    tags: ['weapon'],
    aspects: [aspects.metal],
    record: {},
  },
  owner: defaultOwner,
}

export const glimmerCloak: Card = {
  id: 'Glimmer Cloak',
  index: 0,
  size: 2,
  info: {
    name: 'Glimmer Cloak',
    description: `
    The Glimmer Cloak carries the shimmer of forgotten constellations. It is not merely reflective—it radiates echoes of a sky that no longer exists, as if the birth of the universe itself were woven into its fibers. The starlight clinging to its folds doesn’t illuminate; it remembers. Some say it does not shine—it mourns.
    Its origin is unknown. Some claim it was stitched by void-born spirits; others believe it was never made, only found—wrapped around a nameless, kneeling corpse at the threshold of a collapsed temple. The one who dared touch it vanished. Those who wear it speak of cold voices like wind through crystal, of stars that seem to blink in response to questions never asked aloud.
    And always, they see it:
    A single pale dot, alone in the dark.
    They do not know what it is. Only that it contains everything they've ever feared to lose.
    To the naked eye, it is mesmerizing.
    To those attuned to magic, it is disturbing.
    For within its shimmer, something watches back.
    `,
    quote: '"The stars are not dead. They are waiting." — Muttered by a mad-man close to where the Glimmer Cloak was found',
    levels: [],
    rarity: 4,
    unique: true,
    image: {
      default: 'glimmerCloak.png',
    },
  },
  stats: {
    level: 1,
    cost: 100,
    bash: { attack: 10, banter: 10, heal: 10, shield: 10, cooldown: 3, castTime: 1, actionCount: 1 },
    slot: 'cloak',
    effects: [],
    tags: ['artifact'],
    aspects: [aspects.light],
    record: {},
  },
  owner: defaultOwner,
}

export const viking: Card = {
  id: 'viking',
  index: 0,
  size: 2,
  info: {
    name: 'Fenrir Viking',
    description: 'A basic viking',
    levels: [],
    rarity: 2,
    unique: false,
    image: {
      default: 'fenrirViking.png',
    },
  },
  stats: {
    level: 1,
    cost: 10,
    bash: { attack: 2, shield: 2, actionCount: 2, cooldown: 2, castTime: 1, },
    slot: 'army',
    effects: [],
    tags: ['guard'],
    aspects: [aspects.metal],
    record: {},
  },
  owner: defaultOwner,
}

const thunderCannon: Card = {
  id: 'Thunder Cannon',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { attack: 20, actionCount: 1, cooldown: 5, castTime: 1 },
    slot: 'building',
    effects: [],
    tags: ['weapon'],
    aspects: [aspects.charge],
    record: {},
  },
  owner: defaultOwner,
}

const treasure: Card = {
  id: 'Treasure',
  index: 0,
  size: 3,
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
    level: 1,
    cost: 10,
    bash: { cooldown: 5, castTime: 1, actionCount: 1 },
    slot: 'utility',
    effects: [],
    tags: ['artifact'],
    aspects: [aspects.metal],
    record: {},
  },
  owner: defaultOwner,
}


export const saintDenis: Card = {
  id: 'Saint Denis',
  index: 0,
  size: 3,
  info: {
    name: 'Saint Denis',
    description: `
    Denis was born with a rare condition: his body grew quickly—tall, broad, and powerful—but he could not feel pain. Nor exhaustion. Nor even the heat of a flame against his skin. A monster’s blessing, some would say. But along with this came something stranger still—a hypersensitive empathy and a violent aversion to causing harm. His nerves did not register agony, but his heart felt everything.
    His parents, both addicts, abandoned him not long after birth. He was raised by other street children who mocked his silence and exploited his gentleness. He craved affection but received none. And when the cruelty of others grew too much, Denis’s mind shut the door. Emotionally numbed, he let go of gentleness and survived instead by letting others fear him.
    When a drunken adult once tried to rob him, Denis struck back without thinking. The man died instantly. It was his first taste of violence. It would not be his last. Denis drifted to the edges of villages and camps, keeping to himself, surviving off fear and detachment.
    Then came the famine.
    As the world starved, Denis did not weaken. His strength made him untouchable. One by one, the others around him perished. He buried no one. He mourned no one. He simply endured. He scavenged the remains of his village, until he came across the body of a traveling priest—beaten, half-eaten, and lying in a gutter. Denis took his robes. They were the finest clothes he had ever seen.
    Wearing them, he wandered.
    Soon, he encountered a migrating band of starving farmers—families and stragglers seeking better lands in the south. They saw the robe and fell to their knees. “Father,” they called him. “We are saved.” Denis said nothing. He was too stunned. And too afraid to correct them.
    Then something happened that Denis had never known. They trusted him. They offered him their bread. They looked to him with hope, not fear. Children reached for his hand without flinching. In that moment—cracked open by unexpected kindness—something in Denis returned. Not fully. Not with ease. But he began to serve. And he never stopped.`,
    quote: '"Im not hungry." — Saint Denis, comforting a child crying for him to eat',
    levels: [],
    rarity: 10,
    unique: true,
    image: {
      default: 'saintDeni.png',
    },
  },
  stats: {
    level: 1,
    cost: 10,
    bash: { attack: 0, shield: 50, cooldown: 4, castTime: 1, actionCount: 1 },
    effects: [],
    tags: ['saint'],
    aspects: [aspects.light],
    slot: 'character',
    record: {},
  },
  owner: defaultOwner,
}

export const cards: Card[] = [
  skeletonSoldier,
  skeletonArcher,
  archer,
  halberdier,
  doomCloak,
  skeletonHealer,
  skeletonHorseman,
  gauntletOfSigmar,
  glimmerCloak,
  viking,
  thunderCannon,
  treasure,
  saintDenis
]
