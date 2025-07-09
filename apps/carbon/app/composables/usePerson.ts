import type { User, Card } from '../../types'
import type { CardSegment, DraggedCard, SpaceBoards } from '../../types/cardDrag'

import { getInsertedCard } from '../../utils/cardSwap/insertCard'

const MAX_BOARD_SLOTS = 12

export function usePerson(user: User) {
  const deck = ref(user.deck)
  const inventory = ref(user.inventory)
  const characters = ref(user.characters)

  watch(deck, (newDeck) => {
    console.log('Deck updated:', newDeck)
  })

  const remainingSlots = computed(() => {
    const remainingDeckSlots = MAX_BOARD_SLOTS - deck.value.length
    const remainingInventorySlots = MAX_BOARD_SLOTS - inventory.value.length
    const allRemainingSlots = remainingDeckSlots + remainingInventorySlots
    return {
      deck: remainingDeckSlots,
      inventory: remainingInventorySlots,
      all: allRemainingSlots
    }
  })



  const hoveredSpace = ref<SpaceBoards | null>(null)
  const draggedCard = ref<DraggedCard | null>(null)

  function setDraggedCard(dc: DraggedCard | null) {
    draggedCard.value = dc
  }

  function setHoveredSpace(space: SpaceBoards | null) {
    hoveredSpace.value = space
  }

  const remapCardsToSegments = (cards: Card[]): CardSegment[] => {
    return cards.map(card => remapCardToSegment(card))
  }

  function remapSegmentsToCards(segments: CardSegment[]): Card[] {
    const allCardsThatBelongToUser = [...inventory.value, ...deck.value]
    return segments.map(segment => {
      // I'm not a huge fan of typecasting here, but I'm pretty sure we can guarantee that there is a card with the same id in the user's inventory or deck
      const card = allCardsThatBelongToUser.find(c => c.id === segment.id) as Card
      return {
        ...card,
        index: segment.start,
      }
    })
  }

  function insertCard(newCard: Card, deck: Card[]) {
    return getInsertedCard({
      deck: remapCardsToSegments(deck),
      newCard: remapCardToSegment(newCard),
      maxSlots: MAX_BOARD_SLOTS
    })
  }

  function insertAcquiredCard(card: Card, target: 'deck' | 'inventory') {
    const insertedCards = insertCard({
      ...card,
      index: target === 'deck' ? deck.value.length : inventory.value.length,
    }, target === 'deck' ? deck.value : inventory.value)

    if (!insertedCards.success) return insertedCards
    if (target === 'deck') {
      deck.value = remapSegmentsToCards(insertedCards.cards)
    } else {
      inventory.value = remapSegmentsToCards(insertedCards.cards)
    }
    return insertedCards
  }

  function insertCardFromDeck(props: { deckIndex: number, inventoryIndex: number }) {
    const card = deck.value.find(card => card.index === props.deckIndex)
    if (!card) return
    const insertedCards = insertCard({
      ...card,
      index: props.inventoryIndex,
    }, inventory.value)
    if (!insertedCards.success) return
    inventory.value = remapSegmentsToCards(insertedCards.cards)
    deck.value = deck.value.filter(card => card.index !== props.deckIndex)
  }

  function insertCardFromInventory(props: { inventoryIndex: number, deckIndex: number }) {
    const card = inventory.value.find(card => card.index === props.inventoryIndex)
    if (!card) return
    const insertedCards = insertCard({
      ...card,
      index: props.deckIndex,
    }, deck.value)
    if (!insertedCards.success) return
    deck.value = remapSegmentsToCards(insertedCards.cards)
    inventory.value = inventory.value.filter(card => card.index !== props.inventoryIndex)
  }

  function moveCardInsideInventory(props: { index: number, newIndex: number }) {
    const inventoryWithputMovingCard = inventory.value.filter(card => card.index !== props.index)
    const card = inventory.value.find(card => card.index === props.index)
    if (!card) return

    const insertedCards = insertCard({
      ...card,
      index: props.newIndex,
    }, inventoryWithputMovingCard)

    if (!insertedCards.success) return
    inventory.value = remapSegmentsToCards(insertedCards.cards)
  }

  function moveCardInsideDeck(props: { index: number, newIndex: number }) {
    const deckWithoutMovingCard = deck.value.filter(card => card.index !== props.index)
    const card = deck.value.find(card => card.index === props.index)
    if (!card) return

    const insertedCards = insertCard({
      ...card,
      index: props.newIndex,
    }, deckWithoutMovingCard)

    if (!insertedCards.success) return
    deck.value = remapSegmentsToCards(insertedCards.cards)
  }

  function moveCardFromDeckToInventory(props: { deckIndex: number, inventoryIndex: number }) {
    insertCardFromDeck(props)
  }

  function moveCardFromInventoryToDeck(props: { inventoryIndex: number, deckIndex: number }) {
    insertCardFromInventory(props)
  }

  function removeDraggedCard(props: {
    originBoard: 'deck' | 'inventory',
    cardIndex: number
  }) {
    let removedCard: Card | undefined = undefined
    if (props.originBoard === 'deck') {
      removedCard = deck.value.find(card => card.index === props.cardIndex)
      deck.value = deck.value.filter(card => card.index !== props.cardIndex)
    } else {
      removedCard = inventory.value.find(card => card.index === props.cardIndex)
      inventory.value = inventory.value.filter(card => card.index !== props.cardIndex)
    }
    return removedCard
  }

  return {
    deck,
    inventory,
    characters,
    draggedCard,
    hoveredSpace,
    remainingSlots,
    setDraggedCard,
    setHoveredSpace,
    insertAcquiredCard,
    moveCardInsideDeck,
    moveCardInsideInventory,
    moveCardFromDeckToInventory,

    moveCardFromInventoryToDeck,
    removeDraggedCard,
  }
}

export type UsePerson = ReturnType<typeof usePerson>

const remapCardToSegment = (card: Card): CardSegment => ({
  id: card.id,
  start: card.index,
  end: card.index + card.size - 1,
  size: card.size,
  empty: false
})
