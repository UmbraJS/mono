import type { CardAction, Character } from '../../types'
import { useHealth, useShield, useMorale } from './useBash'

interface UsePlayerProps {
  character: Character
  onAttack: (attack: number, index: number) => void
}

export function usePlayer({ character, onAttack }: UsePlayerProps) {
  const health = useHealth(character)
  const shields = useShield()
  const morale = useMorale()

  const deck = ref(character.deck)

  function attack(attack: number, timestamp: number, index: number) {
    const shieldPierce = attack - shields.shield.value
    if (shields.shield.value > 0) {
      shields.shieldDown({
        actualChange: attack,
        attemptedChange: attack,
        timestamp: timestamp,
        type: 'attack',
        index: index,
        banter: {
          buffs: [],
          debufs: [],
        },
      })
    }
    if (shieldPierce > 0) {
      health.hurt({
        actualChange: Math.max(0, shieldPierce),
        attemptedChange: attack,
        timestamp: timestamp,
        type: 'attack',
        index: index,
        banter: {
          buffs: [],
          debufs: [],
        },
      })
    }
  }

  function bash(entry: CardAction) {
    const bash = entry.bash

    if (bash.banter)
      morale.banter({
        actualChange: bash.banter,
        attemptedChange: bash.banter,
        timestamp: entry.timestamp,
        index: entry.index,
        type: 'banter',
        banter: {
          buffs: [],
          debufs: [],
        },
      })
    if (bash.attack) onAttack(bash.attack, entry.index)
    if (bash.shield)
      shields.shieldUp({
        actualChange: bash.shield,
        attemptedChange: bash.shield,
        timestamp: entry.timestamp,
        type: 'shield',
        index: entry.index,
        banter: {
          buffs: [],
          debufs: [],
        },
      })
    if (bash.heal && health.health.value < character.maxHealth)
      health.heal({
        actualChange: bash.heal,
        attemptedChange: bash.heal,
        timestamp: entry.timestamp,
        type: 'heal',
        index: entry.index,
        banter: {
          buffs: [],
          debufs: [],
        },
      })
  }

  return {
    deck,
    ...shields,
    ...morale,
    ...health,
    hurt: attack,
    bash,
  }
}

export type UsePlayerReturn = ReturnType<typeof usePlayer>
