import { defineStore } from 'pinia'
import { user, bot } from '../data/character'
import type { Card, CardStatRealms, Character } from '../../types'
import { matchSimulator } from '../../utils/matchSimulator'
import { gsap } from 'gsap'
import { usePerson } from '../composables/usePerson'

export const useStore = defineStore('store', () => {
  const realm = ref<keyof CardStatRealms>('base')

  const userStore = usePerson(user)
  const botStore = usePerson(bot)

  const money = useMoney({
    removeDraggedCard: userStore.removeDraggedCard,
    realm: realm.value,
    inventory: userStore.inventory,
    deck: userStore.deck,
    remainingSlots: userStore.remainingSlots,
  })

  return {
    user: userStore,
    bot: botStore,
    money
  }
})

function useMoney(props: {
  removeDraggedCard: (props: {
    originBoard: 'deck' | 'inventory',
    cardIndex: number
  }) => Card | undefined,
  realm: keyof CardStatRealms,
  inventory: Ref<Card[]>,
  deck: Ref<Card[]>,
  remainingSlots: Ref<{
    inventory: number;
    deck: number;
  }>,
}) {
  const soldCards = ref<Card[]>([])

  const soldCardsLimited = computed(() => {
    return soldCards.value.slice(0, 3)
  })

  const money = ref({
    value: 0,
    income: 2,
  })

  const cardPurchase = useCardPurchase({
    remainingSlots: props.remainingSlots,
    availableFunds: money
  })

  const buyBackCard = (card: Card) => {
    cardPurchase.buyCard(card)
    const purchaseError = cardPurchase.purchaseError
    if (purchaseError.value) return
    soldCards.value = soldCards.value.filter(c => c.id !== card.id)
  }

  function getTotalValue(cards: Card[]) {
    return cards.reduce((acc, card) => {
      const cardStats = card.stats[props.realm]
      return acc + (cardStats ? cardStats.cost : 0)
    }, 0)
  }

  return {
    value: computed(() => money.value.value),
    income: computed(() => money.value.income),
    inventoryValue: computed(() => getTotalValue(props.inventory.value)),
    deckValue: computed(() => getTotalValue(props.deck.value)),
    totalValue: computed(() => getTotalValue([...props.inventory.value, ...props.deck.value])),
    remainingSlots: props.remainingSlots,
    cardPurchase,
    soldCards: soldCardsLimited,
    buyBackCard,
    setMoney: (newMoney: number) => money.value.value = newMoney,
    setIncome: (newIncome: number) => money.value.income = newIncome,
    sellDraggedCard: (passedProps: {
      originBoard: 'deck' | 'inventory',
      cardIndex: number
    }) => {
      const card = props.removeDraggedCard(passedProps)
      const cardStats = card?.stats[props.realm]
      if (!cardStats) return
      soldCards.value.push(card)
      money.value.value += cardStats.cost
    }
  }
}


export function useSimulation(props: {
  userDeck: Card[],
  botDeck: Card[],
  userCharacters: Character[],
  botCharacters: Character[],
}) {
  const time = ref(0)

  const timeline = markRaw(gsap.timeline({
    paused: true,
    onUpdate: () => {
      time.value = timeline.time()
    },
  }))

  const cardTimeline = matchSimulator({
    playerDeck: props.botDeck,
    opponentDeck: props.userDeck,
    playerCharacters: props.botCharacters,
    opponentCharacters: props.userCharacters,
  })

  return {
    time,
    timeline,
    user: useSpace(timeline, cardTimeline.space.player, props.userCharacters),
    bot: useSpace(timeline, cardTimeline.space.opponent, props.botCharacters),
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
