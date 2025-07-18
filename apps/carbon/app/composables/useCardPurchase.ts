import type { Card } from '../../types'

/**
 * Result interface for purchase validation
 */
export interface PurchaseValidationResult {
  canPurchase: boolean
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
  const isPurchasing = ref(false)

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
    const cardSize = card.size
    const cardCost = view.getCardStats(card).cost

    // Check space availability
    const hasInventorySpace = remainingSlots.value.inventory >= cardSize
    const hasDeckSpace = remainingSlots.value.deck >= cardSize
    const hasAnySpace = hasInventorySpace || hasDeckSpace

    if (!hasAnySpace) {
      return {
        canPurchase: false,
        error: 'Not enough space in inventory or deck to place this card.'
      }
    }

    // Check funds
    if (availableFunds.value.value < cardCost) {
      return {
        canPurchase: false,
        error: 'Not enough funds to buy this card.'
      }
    }

    return {
      canPurchase: true,
      error: null
    }
  }

  /**
   * Attempts to purchase a card
   * @param card - The card to purchase
   * @returns Purchase result with success status and error message if failed
   */
  function purchaseCard(card: Card): { success: boolean; error?: string } {
    const validation = validatePurchase(card)

    if (!validation.canPurchase) {
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
      return { success: false, error: 'Not enough space to place this card.' }
    }

    // Complete the purchase
    quest.shop.buyCard(card)
    audio.playCoinSound()
    store.money.setMoney(
      store.money.value - view.getCardStats(card).cost
    )
    return { success: true }
  }

  /**
   * Attempts to purchase a card with full state management
   * @param card - The card to purchase
   * @returns Promise that resolves when purchase is complete
   */
  async function buyCard(card: Card): Promise<string | null> {
    if (isPurchasing.value) return purchaseError.value

    isPurchasing.value = true
    purchaseError.value = null

    try {
      const result = purchaseCard(card)

      if (!result.success) {
        purchaseError.value = result.error || 'Purchase failed'
      }
    } catch (error) {
      purchaseError.value = 'An unexpected error occurred during purchase'
      console.error('Purchase error:', error)
    } finally {
      isPurchasing.value = false
    }

    return purchaseError.value
  }


  return {
    // State
    purchaseError: readonly(purchaseError),
    isPurchasing: readonly(isPurchasing),

    // Methods
    validatePurchase,
    purchaseCard,
    buyCard
  }
}
