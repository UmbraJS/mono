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

  const deckEffects = computed(() => {
    const effects = deck.value
      .map((card) => card)

    return effects
  })


  console.log("rex: deckEffects", deckEffects.value);


  function handleShieldDown(shields: any, attack: number, timestamp: number, index: number) {
    if (shields.shield.value > 0) {
      shields.shieldDown({
        actualChange: attack,
        attemptedChange: attack,
        timestamp: timestamp,
        type: 'attack',
        index: index,
        banter: createBanterObject(),
      })
    }
  }

  function handleHealthDamage(health: any, shieldPierce: number, attack: number, timestamp: number, index: number) {
    if (shieldPierce > 0) {
      health.hurt({
        actualChange: Math.max(0, shieldPierce),
        attemptedChange: attack,
        timestamp: timestamp,
        type: 'attack',
        index: index,
        banter: createBanterObject(),
      })
    }
  }

  function hurt(attack: number, timestamp: number, index: number) {
    const shieldPierce = attack - shields.shield.value
    handleShieldDown(shields, attack, timestamp, index)
    handleHealthDamage(health, shieldPierce, attack, timestamp, index)
  }

  function createBanterObject() {
    return {
      buffs: [],
      debuffs: [],
    }
  }

  function handleMoraleChange(entry: CardAction) {
    const bash = entry.bash
    if (!bash.banter) return
    morale.banter({
      actualChange: bash.banter,
      attemptedChange: bash.banter,
      timestamp: entry.timestamp,
      index: entry.index,
      type: 'banter',
      banter: createBanterObject(),
    })
  }

  function handleAttack(entry: CardAction) {
    const bash = entry.bash
    if (!bash.attack) return
    onAttack(bash.attack, entry.index)
  }

  function handleShieldChange(entry: CardAction) {
    const bash = entry.bash
    if (!bash.shield) return
    shields.shieldUp({
      actualChange: bash.shield,
      attemptedChange: bash.shield,
      timestamp: entry.timestamp,
      type: 'shield',
      index: entry.index,
      banter: createBanterObject(),
    })
  }

  function handleHealing(entry: CardAction) {
    const bash = entry.bash
    if (bash.heal && health.health.value < character.maxHealth) {
      health.heal({
        actualChange: bash.heal,
        attemptedChange: bash.heal,
        timestamp: entry.timestamp,
        type: 'heal',
        index: entry.index,
        banter: createBanterObject(),
      })
    }
  }

  function bash(entry: CardAction) {
    handleMoraleChange(entry)
    handleAttack(entry)
    handleShieldChange(entry)
    handleHealing(entry)
  }

  return {
    deck,
    ...shields,
    ...morale,
    ...health,
    hurt,
    bash,
  }
}

export type UsePlayerReturn = ReturnType<typeof usePlayer>
