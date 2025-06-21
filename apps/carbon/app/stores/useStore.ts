import { defineStore } from 'pinia'
import { user, bot } from '../data/character'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { gsap } from 'gsap'
import { usePerson } from '../composables/usePerson'
import type { UsePerson } from '../composables/usePerson'
import { set } from '@vueuse/core'

interface Space {
  start: number
  end: number
}

interface SpaceBoard extends Space {
  board: 'deck' | 'inventory'
}

export interface SpaceBoards {
  size: number
  origin: SpaceBoard,
  immigrant: SpaceBoard
}

export const useStore = defineStore('store', () => {
  const userStore = usePerson(user)
  const botStore = usePerson(bot)
  const simulation = useSimulation(userStore, botStore)
  return {
    user: userStore,
    bot: botStore,
    simulation
  }
})

function useSimulation(userStore: UsePerson, botStore: UsePerson) {
  const time = ref(0)

  const timeline = gsap.timeline({
    paused: true,
    onUpdate: () => {
      time.value = timeline.time()
    },
  })

  const cardTimeline = spaceTimeSimulation({
    playerDeck: userStore.deck.value,
    opponentDeck: botStore.deck.value,
    playerCharacters: userStore.characters.value,
    opponentCharacters: botStore.characters.value,
    matchDuration: 30
  })

  return {
    time,
    timeline,
    user: useSpace(timeline, cardTimeline.space.player, user.characters),
    bot: useSpace(timeline, cardTimeline.space.opponent, bot.characters),
  }
}

export const useView = defineStore('view', () => {
  const view = ref<null | 'inventory'>(null)

  function setView(newView: 'inventory' | null) {
    view.value = newView
  }

  return {
    view,
    setView,
  }
})
