import type { User, Card, Character } from '../../types'
import type { CardSegment, DraggedCard, SpaceBoards } from '../../types/cardDrag'
import { createCardCostCalculator } from '../../utils/cardCost'

import { getInsertedCard } from '../../utils/cardSwap/insertCard'

// Constants - should remain 12
const MAX_BOARD_SLOTS = 12

// Types
interface MoveCardProps {
  index: number
  newIndex: number
}

interface CrossBoardMoveProps {
  deckIndex: number
  inventoryIndex: number
}

interface RemoveCardProps {
  originBoard: 'deck' | 'inventory'
  cardIndex: number
}

interface InsertCardResult {
  success: boolean
  cards?: CardSegment[]
  error?: string
}

/**
 * Composable for managing a user's cards, inventory, and deck operations
 * Provides reactive state management and card manipulation methods
 */
export function usePerson(user: User) {
  const view = useView()

  // Create a card cost calculator for the current realm
  const calculateCardCost = createCardCostCalculator(view.realm)

  const deck = ref<Card[]>(user.deck.map(card => calculateCardCost(card)))
  const inventory = ref<Card[]>(user.inventory.map(card => calculateCardCost(card)))
  const maxSlots = ref(12)

  const characters = ref<Character[]>(user.characters)
  const hoveredSpace = ref<SpaceBoards | null>(null)
  const draggedCard = ref<DraggedCard | null>(null)

  const maxHealth = computed(() => {
    return characters.value.reduce((total, character) => total + character.maxHealth, 0)
  })


  const remainingSlots = computed(() => {
    const deckSpaceUsed = deck.value.reduce((total, card) => total + card.size, 0)
    const inventorySpaceUsed = inventory.value.reduce((total, card) => total + card.size, 0)

    const remainingDeckSlots = maxSlots.value - deckSpaceUsed
    const remainingInventorySlots = MAX_BOARD_SLOTS - inventorySpaceUsed
    const allRemainingSlots = remainingDeckSlots + remainingInventorySlots

    return {
      deck: remainingDeckSlots,
      inventory: remainingInventorySlots,
      all: allRemainingSlots,
    }
  })

  // Drag & Drop state management
  function setDraggedCard(dc: DraggedCard | null): void {
    draggedCard.value = dc
  }

  function setHoveredSpace(space: SpaceBoards | null): void {
    hoveredSpace.value = space
  }

  // === UTILITY FUNCTIONS ===

  /**
   * Converts a card to a CardSegment representation
   */
  function remapCardToSegment(card: Card): CardSegment {
    return {
      id: card.id,
      start: card.index,
      end: card.index + card.size - 1,
      size: card.size,
      empty: false
    }
  }

  /**
   * Converts an array of cards to CardSegment representations
   */
  function remapCardsToSegments(cards: Card[]): CardSegment[] {
    return cards.map(card => remapCardToSegment(card))
  }

  /**
   * Converts CardSegments back to Cards with updated positions
   * @param segments - Array of card segments
   * @param newCard - Optional new card to include in lookup
   */
  function remapSegmentsToCards(segments: CardSegment[], newCard?: Card): Card[] {
    const allAvailableCards = [...inventory.value, ...deck.value]

    if (newCard) {
      allAvailableCards.push(newCard)
    }

    return segments.map(segment => {
      const card = allAvailableCards.find(c => c.id === segment.id)
      if (!card) {
        console.error(`Card with id ${segment.id} not found in user inventory or deck`)
        throw new Error(`Card with id ${segment.id} not found`)
      }
      return {
        ...card,
        index: segment.start,
      }
    })
  }

  /**
   * Generic card insertion function
   * @param newCard - Card to insert
   * @param targetDeck - Target deck to insert into
   * @param maxSlots - Maximum slots available for the target deck
   */
  function insertCard(newCard: Card, targetDeck: Card[], maxSlots: number): InsertCardResult {
    const result = getInsertedCard({
      deck: remapCardsToSegments(targetDeck),
      newCard: remapCardToSegment(newCard),
      maxSlots
    })

    return {
      success: result.success,
      cards: result.cards,
      error: result.success ? undefined : 'Failed to insert card'
    }
  }

  // === CARD OPERATIONS ===

  /**
   * Inserts a newly acquired card into the specified target (deck or inventory)
   * @param card - Card to insert
   * @param target - Target location ('deck' or 'inventory')
   */
  function insertAcquiredCard(card: Card, target: 'deck' | 'inventory'): InsertCardResult {
    const targetDeck = target === 'deck' ? deck.value : inventory.value
    const targetIndex = targetDeck.length
    const targetMaxSlots = target === 'deck' ? maxSlots.value : MAX_BOARD_SLOTS

    const cardToInsert = {
      ...card,
      index: targetIndex,
    }

    const result = insertCard(cardToInsert, targetDeck, targetMaxSlots)

    if (result.success && result.cards) {
      const updatedCards = remapSegmentsToCards(result.cards, card)

      if (target === 'deck') {
        deck.value = updatedCards
      } else {
        inventory.value = updatedCards
      }
    }

    return result
  }

  /**
   * Moves a card from deck to inventory
   */
  function moveCardFromDeckToInventory(props: CrossBoardMoveProps): boolean {
    const card = deck.value.find(c => c.index === props.deckIndex)
    if (!card) return false

    const cardToMove = {
      ...card,
      index: props.inventoryIndex,
    }

    const result = insertCard(cardToMove, inventory.value, MAX_BOARD_SLOTS)

    if (result.success && result.cards) {
      inventory.value = remapSegmentsToCards(result.cards)
      deck.value = deck.value.filter(c => c.index !== props.deckIndex)
      return true
    }

    return false
  }

  /**
   * Moves a card from inventory to deck
   */
  function moveCardFromInventoryToDeck(props: CrossBoardMoveProps): boolean {
    const card = inventory.value.find(c => c.index === props.inventoryIndex)
    if (!card) return false

    const cardToMove = {
      ...card,
      index: props.deckIndex,
    }

    const result = insertCard(cardToMove, deck.value, maxSlots.value)

    if (result.success && result.cards) {
      deck.value = remapSegmentsToCards(result.cards)
      inventory.value = inventory.value.filter(c => c.index !== props.inventoryIndex)
      return true
    }

    return false
  }

  /**
   * Moves a card within the inventory
   */
  function moveCardInsideInventory(props: MoveCardProps): boolean {
    const card = inventory.value.find(c => c.index === props.index)
    if (!card) return false

    const otherCards = inventory.value.filter(c => c.index !== props.index)
    const cardToMove = {
      ...card,
      index: props.newIndex,
    }

    const result = insertCard(cardToMove, otherCards, MAX_BOARD_SLOTS)

    if (result.success && result.cards) {
      inventory.value = remapSegmentsToCards(result.cards)
      return true
    }

    return false
  }

  /**
   * Moves a card within the deck
   */
  function moveCardInsideDeck(props: MoveCardProps): boolean {
    const card = deck.value.find(c => c.index === props.index)
    if (!card) return false

    const otherCards = deck.value.filter(c => c.index !== props.index)
    const cardToMove = {
      ...card,
      index: props.newIndex,
    }

    const result = insertCard(cardToMove, otherCards, maxSlots.value)

    if (result.success && result.cards) {
      deck.value = remapSegmentsToCards(result.cards)
      return true
    }

    return false
  }

  /**
   * Removes a card from the specified board and returns it
   */
  function removeDraggedCard(props: RemoveCardProps): Card | undefined {
    let removedCard: Card | undefined

    if (props.originBoard === 'deck') {
      removedCard = deck.value.find(card => card.index === props.cardIndex)
      deck.value = deck.value.filter(card => card.index !== props.cardIndex)
    } else {
      removedCard = inventory.value.find(card => card.index === props.cardIndex)
      inventory.value = inventory.value.filter(card => card.index !== props.cardIndex)
    }

    return removedCard
  }

  // === PUBLIC API ===
  return {
    // Reactive state
    deck: deck,
    inventory: inventory,
    characters: characters,
    draggedCard: draggedCard,
    hoveredSpace: hoveredSpace,
    remainingSlots,
    maxSlots: maxSlots,
    maxHealth,

    // Drag & Drop
    setDraggedCard,
    setHoveredSpace,

    // Card operations
    insertAcquiredCard,
    moveCardInsideDeck,
    moveCardInsideInventory,
    moveCardFromDeckToInventory,
    moveCardFromInventoryToDeck,
    removeDraggedCard,
  }
}

/**
 * Type helper for the usePerson composable return type
 */
export type UsePerson = ReturnType<typeof usePerson>
