import { defineStore } from 'pinia'
import { user, bot } from '../data/character'
import type { User, Card } from '../../types'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { gsap } from 'gsap'

const MAX_BOARD_SLOTS = 12

interface Space {
  start: number
  end: number
}

interface SpaceBoard {
  board: 'deck' | 'inventory'
  origin: Space,
  hovered: Space
}

function usePerson(user: User) {
  const deck = ref(user.deck)
  const inventory = ref(user.inventory)
  const characters = ref(user.characters)

  const hoveredSpace = ref<SpaceBoard | null>(null)

  const availableInventorySpace = computed(() => {
    const totalSpaceUsed = inventory.value.reduce((acc, card) => acc + card.size, 0)
    return MAX_BOARD_SLOTS - totalSpaceUsed
  })

  const avialableDeckSpace = computed(() => {
    const totalSpaceUsed = deck.value.reduce((acc, card) => acc + card.size, 0)
    return MAX_BOARD_SLOTS - totalSpaceUsed
  })

  function setHoveredSpace(space: SpaceBoard | null) {
    hoveredSpace.value = space
  }

  function tempDragAndReturn({ index, board }: {
    index: number, board: 'deck' | 'inventory'
  }) {
    let card: Card | null = null

    function removeDraggingElement() {
      if (board === 'deck') {
        const c = deck.value.find(card => card.index === index)
        if (!c) return
        card = c
        deck.value = deck.value.filter(card => card.index !== index)
      } else if (board === 'inventory') {
        const c = inventory.value.find(card => card.index === index)
        if (!c) return
        card = c
        inventory.value = inventory.value.filter(card => card.index !== index)
      }
      sortBoards()
    }

    function returnDraggingElement() {
      if (!card) return
      if (board === 'deck') {
        deck.value = [...deck.value, card]
      } else if (board === 'inventory') {
        inventory.value = [...inventory.value, card]
      }
      sortBoards()
    }

    return {
      removeDraggingElement,
      returnDraggingElement
    }
  }

  function sortBoards() {
    inventory.value.sort((a, b) => a.index - b.index)
    deck.value.sort((a, b) => a.index - b.index)
  }

  function moveCardInsideInventory(props: {
    index: number, newIndex: number
  }) {
    inventory.value = inventory.value.map(card => {
      if (card.index !== props.index) return card
      return {
        ...card,
        index: props.newIndex
      }
    })
    sortBoards()
  }

  function moveCardInsideDeck(props: {
    index: number, newIndex: number
  }) {
    deck.value = deck.value.map(card => {
      if (card.index !== props.index) return card
      return {
        ...card,
        index: props.newIndex
      }
    })
    sortBoards()
  }

  function moveCardFromDeckToInventory(props: {
    deckIndex: number, inventoryIndex: number
  }) {
    const card = deck.value.find(card => card.index === props.deckIndex)
    if (!card) return
    deck.value = deck.value.filter(card => card.index !== props.deckIndex)
    inventory.value = [...inventory.value, { ...card, index: props.inventoryIndex }]
    sortBoards()
  }

  function moveCardFromInventoryToDeck(props: {
    inventoryIndex: number, deckIndex: number
  }) {
    const card = inventory.value.find(card => card.index === props.inventoryIndex)
    if (!card) return
    inventory.value = inventory.value.filter(card => card.index !== props.inventoryIndex)
    deck.value = [...deck.value, { ...card, index: props.deckIndex }]
    sortBoards()
  }

  function shuffleSpace({ start, end }: Space) {
    const possibleSpaceToTheRight = MAX_BOARD_SLOTS - end
    const possibleSpaceToTheLeft = start

    const cardsToTheRight = inventory.value.filter(card => card.index >= end)
    const cardsToTheLeft = inventory.value.filter(card => card.index < start)

    const firstCardToTheRight = cardsToTheLeft[cardsToTheLeft.length - 1]
    const firstCardToTheLeft = cardsToTheRight[0]

    const readilyAvailableSpaceToTheRight = firstCardToTheRight ? firstCardToTheRight.index - end : possibleSpaceToTheRight
    const readilyAvailableSpaceToTheLeft = firstCardToTheLeft ? start - firstCardToTheLeft.index : possibleSpaceToTheLeft

  }

  function getCardsInSpace({ start, end }: Space) {
    return inventory.value.filter(card => {
      const cardStart = card.index
      const cardEnd = cardStart + card.size
      if (cardStart < start || cardEnd > end) return false
      return true
    })
  }

  function shuffleSpace2({ start, end }: Space) {
    const size = end - start
    const cardsInSpace = getCardsInSpace({ start, end })


  }

  return {
    deck,
    inventory,
    characters,
    hoveredSpace,
    avialableDeckSpace,
    availableInventorySpace,
    setHoveredSpace,
    tempDragAndReturn,
    moveCardInsideDeck,
    moveCardInsideInventory,
    moveCardFromDeckToInventory,
    moveCardFromInventoryToDeck,
  }
}

type UsePerson = ReturnType<typeof usePerson>

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
