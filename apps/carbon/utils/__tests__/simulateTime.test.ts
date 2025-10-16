import { describe, it, expect, beforeEach } from 'vitest'
import { simulateTime } from '../simulateTime'
import type { Card, CardName } from '../../types/card'

// Mock card creator helper
function createMockCard(overrides: Partial<Card> = {}): Card {
  const defaultCard: Card = {
    id: 'test-card',
    index: 0,
    size: 1,
    info: {
      name: 'Archer' as CardName,
      description: 'A test card',
      levels: [],
      rarity: 1,
      unique: false,
      image: { default: 'test.png' }
    },
    stats: {
      level: 1,
      cost: 1,
      bash: {
        attack: 5,
        cooldown: 2,
        castTime: 1,
        actionCount: 1
      },
      slot: 'army',
      effects: [],
      tags: [],
      aspects: [],
      record: {}
    },
    owner: {
      board: 'player' as const,
      characterIndex: 0
    }
  }

  const result = {
    ...defaultCard,
    ...overrides,
    info: {
      ...defaultCard.info,
      ...overrides.info
    },
    stats: {
      ...defaultCard.stats,
      ...overrides.stats
    },
    owner: {
      ...defaultCard.owner,
      ...overrides.owner
    }
  }

  // Handle bash stats separately to allow explicit undefined override
  if (overrides.stats?.bash !== undefined) {
    result.stats.bash = overrides.stats.bash === undefined ? undefined : {
      ...defaultCard.stats.bash,
      ...overrides.stats.bash
    }
  }

  return result
}

// Helper to track triggered cards
interface TriggerEvent {
  cardName: CardName
  cardIndex: number
  timestamp: number
  actionNumber: number
}

interface ProcessedCard {
  card: Card
  nextCooldownEnd: number
}

describe('simulateTime', () => {
  let triggers: TriggerEvent[]
  let actionCounter: number

  beforeEach(() => {
    triggers = []
    actionCounter = 0
  })

  const createOnTrigger = () => (triggeredCard: ProcessedCard) => {
    actionCounter++
    triggers.push({
      cardName: triggeredCard.card.info.name,
      cardIndex: triggeredCard.card.index,
      timestamp: triggeredCard.nextCooldownEnd,
      actionNumber: actionCounter
    })
  }

  const defaultMatchCondition = (nextCooldownEnd: number) => nextCooldownEnd > 30

  describe('Basic Card Execution', () => {
    it('should trigger a single card at correct intervals', () => {
      const archer = createMockCard({
        info: { ...createMockCard().info, name: 'Archer' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 7, cooldown: 2, castTime: 1, actionCount: 1 }
        }
      })

      simulateTime({
        playerDeck: [archer],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: defaultMatchCondition
      })

      // Should trigger at 2s, 4s, 6s, 8s, etc.
      const expectedTimestamps = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
      const actualTimestamps = triggers.map(t => t.timestamp)

      expect(actualTimestamps).toEqual(expectedTimestamps)
      expect(triggers.every(t => t.cardName === 'Archer')).toBe(true)
    })

    it('should not create duplicate entries at same timestamp', () => {
      const archer = createMockCard({
        info: { ...createMockCard().info, name: 'Archer' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 7, cooldown: 2, castTime: 1, actionCount: 1 }
        }
      })

      simulateTime({
        playerDeck: [archer],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: defaultMatchCondition
      })

      // Group triggers by timestamp and ensure no duplicates
      const triggersByTimestamp = triggers.reduce((acc, trigger) => {
        acc[trigger.timestamp] = (acc[trigger.timestamp] || 0) + 1
        return acc
      }, {} as Record<number, number>)

      // Each timestamp should have exactly 1 trigger
      Object.values(triggersByTimestamp).forEach(count => {
        expect(count).toBe(1)
      })
    })
  })

  describe('ActionCount Behavior', () => {
    it('should trigger multiple actions per cooldown when actionCount > 1', () => {
      const fenrirViking = createMockCard({
        info: { ...createMockCard().info, name: 'Fenrir Viking' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 2, shield: 2, cooldown: 2, castTime: 1, actionCount: 2 }
        }
      })

      simulateTime({
        playerDeck: [fenrirViking],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 6 // Stop after 3 cooldown cycles
      })

      // Should trigger twice at each timestamp: 2s, 4s, 6s
      expect(triggers).toHaveLength(6) // 2 actions × 3 timestamps

      // Group by timestamp
      const triggersByTimestamp = triggers.reduce((acc, trigger) => {
        if (!acc[trigger.timestamp]) acc[trigger.timestamp] = []
        acc[trigger.timestamp]!.push(trigger)
        return acc
      }, {} as Record<number, TriggerEvent[]>)

      // Each timestamp should have exactly 2 triggers
      expect(Object.keys(triggersByTimestamp)).toEqual(['2', '4', '6'])
      Object.values(triggersByTimestamp).forEach(timestampTriggers => {
        expect(timestampTriggers).toHaveLength(2)
        expect(timestampTriggers.every(t => t.cardName === 'Fenrir Viking')).toBe(true)
      })
    })
  })

  describe('Multiple Cards', () => {
    it('should handle multiple cards with different cooldowns correctly', () => {
      const archer = createMockCard({
        index: 0,
        info: { ...createMockCard().info, name: 'Archer' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 7, cooldown: 2, castTime: 1, actionCount: 1 }
        }
      })

      const halberdier = createMockCard({
        index: 1,
        info: { ...createMockCard().info, name: 'Halberdier' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 10, cooldown: 5, castTime: 1, actionCount: 1 }
        }
      })

      simulateTime({
        playerDeck: [archer, halberdier],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 20
      })

      // Archer should trigger at: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
      // Halberdier should trigger at: 5, 10, 15, 20
      const archerTriggers = triggers.filter(t => t.cardName === 'Archer')
      const halberdierTriggers = triggers.filter(t => t.cardName === 'Halberdier')

      expect(archerTriggers.map(t => t.timestamp)).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20])
      expect(halberdierTriggers.map(t => t.timestamp)).toEqual([5, 10, 15, 20])

      // Ensure no duplicates at shared timestamps (10, 20)
      const triggersAt10 = triggers.filter(t => t.timestamp === 10)
      const triggersAt20 = triggers.filter(t => t.timestamp === 20)

      expect(triggersAt10).toHaveLength(2) // One archer, one halberdier
      expect(triggersAt20).toHaveLength(2) // One archer, one halberdier
    })
  })

  describe('Different Cooldowns', () => {
    it('should handle cards with different cooldown durations', () => {
      const fastCard = createMockCard({
        index: 0,
        info: { ...createMockCard().info, name: 'Bow' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 1, cooldown: 1, castTime: 1, actionCount: 1 }
        }
      })

      const slowCard = createMockCard({
        index: 1,
        info: { ...createMockCard().info, name: 'Thunder Cannon' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 10, cooldown: 10, castTime: 1, actionCount: 1 }
        }
      })

      simulateTime({
        playerDeck: [fastCard, slowCard],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 10
      })

      const fastTriggers = triggers.filter(t => t.cardName === 'Bow')
      const slowTriggers = triggers.filter(t => t.cardName === 'Thunder Cannon')

      // Fast card should trigger 10 times (1s, 2s, ..., 10s)
      expect(fastTriggers).toHaveLength(10)
      expect(fastTriggers.map(t => t.timestamp)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

      // Slow card should trigger once (10s)
      expect(slowTriggers).toHaveLength(1)
      expect(slowTriggers[0]?.timestamp).toBe(10)
    })
  })

  describe('Cards Without Bash Stats', () => {
    it('should ignore cards without bash stats', () => {
      const normalCard = createMockCard({
        info: { ...createMockCard().info, name: 'Sword' }
      })

      const cardWithoutBash = createMockCard({
        info: { ...createMockCard().info, name: 'Treasure' },
        stats: {
          ...createMockCard().stats,
          bash: undefined
        }
      })

      simulateTime({
        playerDeck: [normalCard, cardWithoutBash],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 10
      })

      // Should have some triggers (from the sword card)
      expect(triggers.length).toBeGreaterThan(0)

      // Count triggers by card name
      const swordTriggers = triggers.filter(t => t.cardName === 'Sword')
      const treasureTriggers = triggers.filter(t => t.cardName === 'Treasure')

      // Only sword should trigger
      expect(swordTriggers.length).toBeGreaterThan(0)
      expect(treasureTriggers.length).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero actionCount gracefully', () => {
      const zeroActionCard = createMockCard({
        info: { ...createMockCard().info, name: 'Wooden Shield' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 5, cooldown: 2, castTime: 1, actionCount: 0 }
        }
      })

      simulateTime({
        playerDeck: [zeroActionCard],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 10
      })

      // Should not trigger any actions
      expect(triggers).toHaveLength(0)
    })

    it('should stop when match condition is met', () => {
      const archer = createMockCard({
        info: { ...createMockCard().info, name: 'Archer' },
        stats: {
          ...createMockCard().stats,
          bash: { attack: 7, cooldown: 2, castTime: 1, actionCount: 1 }
        }
      })

      simulateTime({
        playerDeck: [archer],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 6 // Stop after 6 seconds
      })

      // Should only trigger at 2s, 4s, 6s
      expect(triggers.map(t => t.timestamp)).toEqual([2, 4, 6])
    })

    it('should handle empty decks', () => {
      simulateTime({
        playerDeck: [],
        opponentDeck: [],
        onTrigger: createOnTrigger(),
        matchCondition: defaultMatchCondition
      })

      expect(triggers).toHaveLength(0)
    })
  })

  describe('Opponent vs Player Cards', () => {
    it('should distinguish between player and opponent cards', () => {
      const playerCard = createMockCard({
        index: 0,
        info: { ...createMockCard().info, name: 'Soldier' },
        owner: { board: 'player', characterIndex: 0 }
      })

      const opponentCard = createMockCard({
        index: 0,
        info: { ...createMockCard().info, name: 'Skeleton Soldier' },
        owner: { board: 'opponent', characterIndex: 0 }
      })

      simulateTime({
        playerDeck: [playerCard],
        opponentDeck: [opponentCard],
        onTrigger: createOnTrigger(),
        matchCondition: (nextCooldownEnd) => nextCooldownEnd > 6
      })

      const playerTriggers = triggers.filter(t => t.cardName === 'Soldier')
      const opponentTriggers = triggers.filter(t => t.cardName === 'Skeleton Soldier')

      expect(playerTriggers.length).toBeGreaterThan(0)
      expect(opponentTriggers.length).toBeGreaterThan(0)
      expect(playerTriggers.map(t => t.timestamp)).toEqual([2, 4, 6])
      expect(opponentTriggers.map(t => t.timestamp)).toEqual([2, 4, 6])
    })
  })
})
