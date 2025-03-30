import { ref, computed } from 'vue'
import { timeStates } from '../../types'
import type { Card, Player, Character, GameTime, GameState } from '../../types'

const defaultEndurance = 100

const stats: Player['stats'] = {
  charisma: 5,
  strength: 5,
  speed: 5,
  constitution: 5,
  intelligence: 5,
  dexterity: 5,
  faith: 5,
  luck: 5,
}

const initialPlayer: Player = {
  id: 'player',
  name: 'Bob',
  description: 'A brave adventurer',
  health: 100,
  maxHealth: 100,
  money: 50,
  interest: 5,
  endurance: defaultEndurance,
  deck: [],
  experience: 0,
  level: 1,
  inventory: [],
  image: {
    default: 'https://example.com/player.png',
  },
  perks: [],
  stats: stats,
  age: {
    years: 20,
    stage: 'adult',
  },
}

export const useGameStore = () => {
  const gameState = ref<GameState>({
    player: initialPlayer,
    maxEndurance: defaultEndurance,
    availableNPCs: [],
  })

  const timeState = ref<GameTime>({
    day: 1,
    hour: 1,
    state: 'morning',
  })

  const isGameOver = computed(() => gameState.value.player.endurance <= 0)

  const startNewGame = () => {
    gameState.value = {
      maxEndurance: defaultEndurance,
      player: initialPlayer,
      availableNPCs: generateInitialNPCs(),
    }

    timeState.value = {
      day: 1,
      hour: 1,
      state: 'morning',
    }
  }

  const advanceHour = () => {
    gameState.value.player.money += gameState.value.player.interest
    if (timeState.value.state === timeStates[timeStates.length - 1]) {
      timeState.value.day += 1
      timeState.value.hour = 1
      timeState.value.state = timeStates[0]
    } else {
      timeState.value.hour += 1
      timeState.value.state = timeStates[timeState.value.hour]
    }
  }

  const generateInitialNPCs = (): Character[] => {
    // Placeholder - implement NPC generation logic
    return []
  }

  const generateShopInventory = (): Card[] => {
    // Placeholder - implement shop inventory generation logic
    return []
  }

  return {
    gameState,
    isGameOver,
    startNewGame,
    advanceHour,
  }
}
