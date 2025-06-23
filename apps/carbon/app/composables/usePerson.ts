import type { User, Card } from '../../types'
import type { CardSegment, DraggedCard, SpaceBoards } from '../../types/cardDrag'

import { getInsertedCard } from '../../utils/cardSwap/insertCard'

const MAX_BOARD_SLOTS = 12

export function usePerson(user: User) {
  const deck = ref(user.deck)
  const inventory = ref(user.inventory)
  const characters = ref(user.characters)

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

  function removeDraggedCard() {
    const cardIndex = draggedCard.value?.cardIndex
    if (draggedCard.value?.originBoard === 'deck') {
      deck.value = deck.value.filter(card => card.index !== cardIndex)
      return deck.value.find(card => card.index === cardIndex)
    } else if (draggedCard.value?.originBoard === 'inventory') {
      inventory.value = inventory.value.filter(card => card.index !== cardIndex)
      return inventory.value.find(card => card.index === cardIndex)
    }
  }

  return {
    deck,
    inventory,
    characters,
    draggedCard,
    hoveredSpace,
    setDraggedCard,
    setHoveredSpace,
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
