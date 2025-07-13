import { defineStore } from 'pinia'
import { user, bot } from '../data/character'
import type { Card, CardStatRealms } from '../../types'
import { matchSimulator } from '../../utils/matchSimulator'
import { gsap } from 'gsap'
import { usePerson } from '../composables/usePerson'
import type { UsePerson } from '../composables/usePerson'

export const useStore = defineStore('store', () => {
  const realm = ref<keyof CardStatRealms>('base')

  const userStore = usePerson(user)
  const botStore = usePerson(bot)
  const simulation = useSimulation(userStore, botStore)

  const money = useMoney({
    removeDraggedCard: userStore.removeDraggedCard,
    realm: realm.value
  })

  return {
    user: userStore,
    bot: botStore,
    simulation,
    money
  }
})

function useMoney(props: {
  removeDraggedCard: (props: {
    originBoard: 'deck' | 'inventory',
    cardIndex: number
  }) => Card | undefined, realm: keyof CardStatRealms
}) {
  const money = reactive({
    value: 0,
    income: 2,
  })

  return {
    value: computed(() => money.value),
    income: computed(() => money.income),
    setMoney: (newMoney: number) => {
      money.value = newMoney
    },
    setIncome: (newIncome: number) => {
      money.income = newIncome
    },
    sellDraggedCard: (passedProps: {
      originBoard: 'deck' | 'inventory',
      cardIndex: number
    }) => {
      const card = props.removeDraggedCard(passedProps)
      const cardStats = card?.stats[props.realm]
      if (!cardStats) return
      money.value += cardStats.cost
    }
  }

}

function useSimulation(userStore: UsePerson, botStore: UsePerson) {
  const time = ref(0)

  const timeline = markRaw(gsap.timeline({
    paused: true,
    onUpdate: () => {
      time.value = timeline.time()
    },
  }))

  const cardTimeline = matchSimulator({
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
    cardTimeline: cardTimeline.time,
  }
}

export const useView = defineStore('view', () => {
  const view = ref<null | 'inventory'>(null)
  const realm = ref<keyof CardStatRealms>('base')

  function getCardStats(card: Card) {
    const cardStats = card.stats[realm.value]
    if (!cardStats) return card.stats.base
    return cardStats
  }

  function setView(newView: 'inventory' | null) {
    view.value = newView
  }

  return {
    view,
    realm,
    getCardStats,
    setView,
  }
})
