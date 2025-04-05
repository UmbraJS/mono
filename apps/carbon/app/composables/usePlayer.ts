import type { CardAction, Character } from '../../types'
import { useHealth, useShield, useMorale } from './useBash'

interface UsePlayerProps {
  character: Character
  onAttack: (attack: number) => void
}

export function usePlayer({ character, onAttack }: UsePlayerProps) {
  const health = useHealth(character)
  const shields = useShield()
  const morale = useMorale()

  const deck = ref(character.deck)

  function attack(attack: number) {
    const remainingAttack = Math.max(0, attack - shields.shield.value)
    shields.shieldChange({
      change: -attack,
      timestamp: Date.now(),
      index: 0,
    })

    health.hurt({
      change: remainingAttack,
      attemptedChange: attack,
      timestamp: Date.now(),
      index: 0,
    })
  }

  function bash(entry: CardAction) {
    const bash = entry.bash

    if (bash.banter)
      morale.banter({
        change: bash.banter,
        timestamp: entry.timestamp,
        index: entry.index,
      })
    if (bash.attack) onAttack(bash.attack)
    if (bash.shield)
      shields.shieldChange({
        change: bash.shield,
        timestamp: entry.timestamp,
        index: entry.index,
      })
    if (bash.heal)
      health.heal({
        change: bash.heal,
        timestamp: entry.timestamp,
        index: entry.index,
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
