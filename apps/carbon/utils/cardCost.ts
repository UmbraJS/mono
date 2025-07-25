import type { Card } from '../types'
import { performanceSimulator } from './matchSimulator'

// Constants
const MINIMUM_CARD_COST = 10
const DEFAULT_STAT_VALUE = 0

/**
 * Calculates the cost of a card based on its simulated performance
 * @param card - The card to calculate cost for
 * @returns Card with updated cost in stats
 */
export function getCardCost(card: Card): Card {
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
      cost: cardCost,
    },
  }

}

/**
 * Calculates the total cost of a deck based on simulated performance with card synergies
 * @param deck - Array of cards to calculate total cost for
 * @returns Object containing total deck cost and individual card costs with synergy bonuses
 */
export function getDeckCost(deck: Card[]): {
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
      const cardCost = getCardCost(card)
      return {
        card: cardCost,
        individualCost: cardCost.stats.cost || MINIMUM_CARD_COST
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
          cost: synergyAdjustedCost,
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
    const fallbackCards = deck.map(card => getCardCost(card))
    const fallbackTotalCost = fallbackCards.reduce(
      (sum, card) => sum + (card.stats.cost || MINIMUM_CARD_COST),
      0
    )

    return {
      totalCost: Math.max(deck.length * MINIMUM_CARD_COST, fallbackTotalCost),
      cardsWithCost: fallbackCards,
      synergyBonus: 0
    }
  }
}
