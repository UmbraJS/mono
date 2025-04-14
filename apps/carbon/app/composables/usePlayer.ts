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
    shields.shieldDown({
      change: attack,
      timestamp: timestamp,
      index: index,
      banter: {
        buffs: [],
        debufs: [],
      },
    })

    health.hurt({
      change: Math.max(0, attack - shields.shield.value),
      attemptedChange: attack,
      timestamp: timestamp,
      index: index,
      banter: {
        buffs: [],
        debufs: [],
      },
    })
  }

  function bash(entry: CardAction) {
    const bash = entry.bash

    if (bash.banter)
      morale.banter({
        change: bash.banter,
        timestamp: entry.timestamp,
        index: entry.index,
        banter: {
          buffs: [],
          debufs: [],
        },
      })
    if (bash.attack) onAttack(bash.attack, entry.index)
    if (bash.shield)
      shields.shieldUp({
        change: bash.shield,
        timestamp: entry.timestamp,
        index: entry.index,
        banter: {
          buffs: [],
          debufs: [],
        },
      })
    if (bash.heal)
      health.heal({
        change: bash.heal,
        timestamp: entry.timestamp,
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
