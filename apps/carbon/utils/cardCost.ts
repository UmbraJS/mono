import type { Card } from '../types'
import { performanceSimulator } from './matchSimulator'

// Constants
const MINIMUM_CARD_COST = 10
const DEFAULT_STAT_VALUE = 0

/**
 * Calculates the cost of a card based on its simulated performance
 * @param card - The card to calculate cost for
 * @param realm - The realm for which to calculate the cost
 * @returns Card with updated cost in stats
 *
 * Example usage:
 *
 * // For calculating cost for a specific realm
 * const cardWithCost = getCardCost(myCard, 'base')
 *
 * // For calculating costs for multiple cards in the same realm
 * const calculateBaseCost = createCardCostCalculator('base')
 * const cardsWithCosts = cards.map(calculateBaseCost)
 *
 * // In a shop context where realm changes dynamically
 * const view = useView()
 * const calculateCurrentRealmCost = createCardCostCalculator(view.realm)
 * const inventoryWithCosts = inventory.map(calculateCurrentRealmCost)
 */
export function getCardCost(card: Card, realm: keyof Card['stats']): Card {
  try {
    const sim = performanceSimulator({
      opponentDeck: [],
      playerDeck: [card],
    })

    const attackValue = Math.abs(
      sim.space.opponent.healthLog[sim.space.opponent.healthLog.length - 1]?.newValue || DEFAULT_STAT_VALUE
    )
    const shieldValue = Math.abs(
      sim.space.player.shieldLog[sim.space.player.shieldLog.length - 1]?.newValue || DEFAULT_STAT_VALUE
    )
    const healthValue = Math.abs(
      sim.space.player.healthLog[sim.space.player.healthLog.length - 1]?.newValue || DEFAULT_STAT_VALUE
    )

    const cardCost = Math.max(MINIMUM_CARD_COST, attackValue + shieldValue + healthValue)

    return {
      ...card,
      stats: {
        ...card.stats,
        [realm]: {
          ...card.stats[realm],
          cost: cardCost,
        },
      },
    }
  } catch (error) {
    console.error('Error calculating card cost:', error)
    // Return card with minimum cost as fallback
    return {
      ...card,
      stats: {
        ...card.stats,
        [realm]: {
          ...card.stats[realm],
          cost: MINIMUM_CARD_COST,
        },
      },
    }
  }
}

/**
 * Creates a card cost calculator for a specific realm
 * @param realm - The realm for which to calculate costs
 * @returns A function that calculates cost for cards in the specified realm
 */
export function createCardCostCalculator(realm: keyof Card['stats']) {
  return (card: Card) => getCardCost(card, realm)
}
