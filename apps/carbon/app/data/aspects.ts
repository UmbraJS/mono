import type { Aspect } from '../../types/card'

const ember: Aspect = {
  name: 'ember',
  description: 'A chemical reaction that produces heat and light',
  type: 'fire',
  level: 1,
  image: {
    default: 'https://example.com/ember.png',
  },
}

const water: Aspect = {
  name: 'water',
  description: 'A chemical compound that is essential for life',
  type: 'water',
  level: 1,
  image: {
    default: 'https://example.com/water.png',
  },
}

const rock: Aspect = {
  name: 'rock',
  description: 'The solid surface of the planet we live on',
  type: 'earth',
  level: 1,
  image: {
    default: 'https://example.com/earth.png',
  },
}

const air: Aspect = {
  name: 'air',
  description: 'The invisible mixture of gases that surrounds the Earth',
  type: 'air',
  level: 1,
  image: {
    default: 'https://example.com/air.png',
  },
}

const light: Aspect = {
  name: 'light',
  description: 'The natural agent that stimulates sight and makes things visible',
  type: 'light',
  level: 1,
  image: {
    default: 'https://example.com/light.png',
  },
}

const shadow: Aspect = {
  name: 'shadow',
  description: 'The dark shape produced by a body coming between rays of light and a surface',
  type: 'darkness',
  level: 1,
  image: {
    default: 'https://example.com/shadow.png',
  },
}

const wood: Aspect = {
  name: 'wood',
  description: 'The hard fibrous material that forms the trunk and branches of a tree',
  type: 'wood',
  level: 1,
  image: {
    default: 'https://example.com/wood.png',
  },
}

const ice: Aspect = {
  name: 'ice',
  description: 'Frozen water',
  type: 'ice',
  level: 1,
  image: {
    default: 'https://example.com/ice.png',
  },
}

const charge: Aspect = {
  name: 'charge',
  description:
    'A property of matter that causes it to experience a force when placed in an electromagnetic field',
  type: 'electricity',
  level: 1,
  image: {
    default: 'https://example.com/charge.png',
  },
}

const warpWeave: Aspect = {
  name: 'warpWeave',
  description: 'A fabric that is woven with threads of different colors',
  type: 'psychic',
  level: 1,
  image: {
    default: 'https://example.com/warp-weave.png',
  },
}

const slash: Aspect = {
  name: 'slash',
  description: 'A quick and sharp cut',
  type: 'kinetic',
  level: 1,
  image: {
    default: 'https://example.com/slash.png',
  },
}

const metal: Aspect = {
  name: 'metal',
  description: 'A solid material that is typically hard, shiny, and malleable',
  type: 'metal',
  level: 1,
  image: {
    default: 'https://example.com/metal.png',
  },
}

const hardMetal: Aspect = {
  name: 'Hard Metal',
  description: 'A solid material that is typically hard, shiny, and malleable',
  type: 'metal',
  level: 2,
  image: {
    default: 'https://example.com/hard-metal.png',
  },
}

export const aspects = {
  ember,
  water,
  rock,
  air,
  light,
  shadow,
  wood,
  ice,
  charge,
  warpWeave,
  slash,
  metal,
  hardMetal,
} as const
