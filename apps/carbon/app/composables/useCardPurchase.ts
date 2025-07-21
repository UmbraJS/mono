import type { Card } from '../../types'
import { toast } from '@nobel/core'

/**
 * Result interface for purchase validation
 */
export interface PurchaseValidationResult {
  valid: boolean
  error: string | null
}

/**
 * Composable for handling card purchases in the shop
 * Provides validation, purchase logic, and reactive state management
 */
export function useCardPurchase({
  remainingSlots,
  availableFunds
}: {
  remainingSlots: Ref<{
    inventory: number;
    deck: number;
  }>,
  availableFunds: Ref<{
    value: number
    income: number
  }>
}) {
  const store = useStore()
  const quest = useQuest()
  const view = useView()
  const audio = useAudio()

  // Reactive state
  const purchaseError = ref<string | null>(null)

  // Auto-clear error after 5 seconds
  watchEffect(() => {
    if (!purchaseError.value) return
    setTimeout(() => {
      purchaseError.value = null
    }, 5000)
  })

  /**
   * Validates if a card can be purchased
   * @param card - The card to validate
   * @returns Validation result with error message if invalid
   */
  function validatePurchase(card: Card): PurchaseValidationResult {
    const pick = validatePick(card)
    if (!pick.valid) return pick

    const cardCost = view.getCardStats(card).cost

    // Check funds
    if (availableFunds.value.value < cardCost) {
      return {
        valid: false,
        error: 'Not enough funds to buy this card.'
      }
    }

    return {
      valid: true,
      error: null
    }
  }

  function validatePick(card: Card): PurchaseValidationResult {
    const cardSize = card.size

    // Check space availability
    const hasInventorySpace = remainingSlots.value.inventory >= cardSize
    const hasDeckSpace = remainingSlots.value.deck >= cardSize
    const hasAnySpace = hasInventorySpace || hasDeckSpace

    if (!hasAnySpace) {
      return {
        valid: false,
        error: 'Not enough space in inventory or deck to place this card.'
      }
    }

    return {
      valid: true,
      error: null
    }
  }

  /**
   * Attempts to purchase a card
   * @param card - The card to purchase
   * @returns Purchase result with success status and error message if failed
   */
  function purchaseCard(card: Card, validation: PurchaseValidationResult): { success: boolean; error?: string } {
    // const purchase = validatePurchase(card)

    if (!validation.valid) {
      toast.error(validation.error!)
      return { success: false, error: validation.error! }
    }

    const remainingInventorySlots = store.user.remainingSlots.inventory
    const cardSize = card.size
    const preferInventory = remainingInventorySlots >= cardSize

    // Try to insert the card
    const insertResult = store.user.insertAcquiredCard(
      card,
      preferInventory ? 'inventory' : 'deck'
    )

    if (!insertResult.success) {
      const errorMessage = 'Not enough space to place this card.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }

    return { success: true }
  }

  /**
   * Attempts to purchase a card with full state management
   * @param card - The card to purchase
   * @returns Promise that resolves when purchase is complete
   */
  async function buyCard(card: Card): Promise<string | null> {
    purchaseError.value = null
    const validation = validatePurchase(card)
    const result = purchaseCard(card, validation)

    if (!result.success) {
      purchaseError.value = result.error || 'Purchase failed'
    }

    // Complete the purchase
    quest.shop.removeFromShop(card)
    audio.playCoinSound()
    store.money.setMoney(
      store.money.value - view.getCardStats(card).cost
    )

    return purchaseError.value
  }

  async function getCard(card: Card) {
    purchaseError.value = null
    const validation = validatePick(card)
    const result = purchaseCard(card, validation)

    if (!result.success) {
      purchaseError.value = result.error || 'Purchase failed'
    }

    quest.gift.removeFromShop(card)
    audio.playCardFlip()

    return purchaseError.value
  }

  return {
    purchaseError: readonly(purchaseError),
    validatePurchase,
    purchaseCard,
    buyCard,
    getCard,
  }
}
