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
 *
 * // For calculating deck costs with synergies, use getDeckCost instead
 * const deckCost = getDeckCost(myDeck, 'base')
 */
export function getCardCost(card: Card, realm: keyof Card['stats']): Card {
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

  const totalValue = attackValue + shieldValue + healthValue


  const cardCost = Math.max(MINIMUM_CARD_COST, totalValue)

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

}

/**
 * Calculates the total cost of a deck based on simulated performance with card synergies
 * @param deck - Array of cards to calculate total cost for
 * @param realm - The realm for which to calculate the cost
 * @returns Object containing total deck cost and individual card costs with synergy bonuses
 *
 * Example usage:
 *
 * // Calculate deck cost for a specific realm
 * const deckCost = getDeckCost(myDeck, 'base')
 * console.log(`Total deck cost: ${ deckCost.totalCost }`)
 *
 * // Access individual card costs with synergy
 * deckCost.cardsWithCost.forEach(card => {
 *   console.log(`${ card.info.name }: ${ card.stats[realm].cost }`)
 * })
 */
export function getDeckCost(deck: Card[], realm: keyof Card['stats']): {
  totalCost: number
  cardsWithCost: Card[]
  synergyBonus: number
} {
  if (deck.length === 0) {
    return {
      totalCost: 0,
      cardsWithCost: [],
      synergyBonus: 0
    }
  }

  try {
    // Simulate the entire deck together to capture synergies
    const deckSim = performanceSimulator({
      opponentDeck: [],
      playerDeck: deck,
    })

    // Extract performance metrics from the deck simulation
    const deckAttackValue = Math.abs(
      deckSim.space.opponent.healthLog[deckSim.space.opponent.healthLog.length - 1]?.newValue || DEFAULT_STAT_VALUE
    )
    const deckShieldValue = Math.abs(
      deckSim.space.player.shieldLog[deckSim.space.player.shieldLog.length - 1]?.newValue || DEFAULT_STAT_VALUE
    )
    const deckHealthValue = Math.abs(
      deckSim.space.player.healthLog[deckSim.space.player.healthLog.length - 1]?.newValue || DEFAULT_STAT_VALUE
    )

    // Calculate the total deck performance value
    const totalDeckPerformance = deckAttackValue + deckShieldValue + deckHealthValue

    // Calculate individual card costs (without synergy)
    const individualCardCosts = deck.map(card => {
      const cardCost = getCardCost(card, realm)
      return {
        card: cardCost,
        individualCost: cardCost.stats[realm]?.cost || MINIMUM_CARD_COST
      }
    })

    // Sum of individual costs
    const sumOfIndividualCosts = individualCardCosts.reduce((sum, { individualCost }) => sum + individualCost, 0)

    // Calculate synergy bonus (how much more valuable the deck is together vs individual cards)
    const synergyMultiplier = sumOfIndividualCosts > 0 ? totalDeckPerformance / sumOfIndividualCosts : 1
    const synergyBonus = Math.max(0, totalDeckPerformance - sumOfIndividualCosts)

    // Distribute the synergy bonus proportionally across cards
    const cardsWithSynergyAdjustedCost = individualCardCosts.map(({ card, individualCost }) => {
      const synergyAdjustedCost = Math.max(
        MINIMUM_CARD_COST,
        Math.round(individualCost * synergyMultiplier)
      )

      return {
        ...card,
        stats: {
          ...card.stats,
          [realm]: {
            ...card.stats[realm],
            cost: synergyAdjustedCost,
          },
        },
      }
    })

    const totalCost = Math.max(
      deck.length * MINIMUM_CARD_COST,
      Math.round(totalDeckPerformance)
    )

    return {
      totalCost,
      cardsWithCost: cardsWithSynergyAdjustedCost,
      synergyBonus
    }
  } catch (error) {
    console.error('Error calculating deck cost:', error)

    // Fallback: return individual card costs without synergy
    const fallbackCards = deck.map(card => getCardCost(card, realm))
    const fallbackTotalCost = fallbackCards.reduce(
      (sum, card) => sum + (card.stats[realm]?.cost || MINIMUM_CARD_COST),
      0
    )

    return {
      totalCost: Math.max(deck.length * MINIMUM_CARD_COST, fallbackTotalCost),
      cardsWithCost: fallbackCards,
      synergyBonus: 0
    }
  }
}

/**
 * Creates a deck cost calculator for a specific realm
 * @param realm - The realm for which to calculate costs
 * @returns A function that calculates cost for decks in the specified realm
 */
export function createDeckCostCalculator(realm: keyof Card['stats']) {
  return (deck: Card[]) => {
    return getDeckCost(deck, realm)
  }
}

/**
 * Creates a card cost calculator for a specific realm
 * @param realm - The realm for which to calculate costs
 * @returns A function that calculates cost for cards in the specified realm
 */
export function createCardCostCalculator(realm: keyof Card['stats']) {
  return (card: Card) => {
    return getCardCost(card, realm)
  }
}
