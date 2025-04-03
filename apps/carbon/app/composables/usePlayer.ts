import type { Card, CardAction, Character } from '../../types'

interface BanterAction {
  card: Card
  value: number
  index: number
}

interface UsePlayerProps {
  character: Character
  onAttack: (attack: number) => void
}

export function usePlayer({ character, onAttack }: UsePlayerProps) {
  const shield = ref(0)
  const health = ref(100)
  const moraleEntries = ref<BanterAction[]>([])
  const morale = computed(() => moraleEntries.value.reduce((acc, entry) => acc + entry.value, 0))
  const deck = ref(character.deck)

  // ========== B.A.S.H ========== //
  // These 4 functions should be the only way to modify the player's state
  function banter(moraleEntry: BanterAction) {
    moraleEntries.value.push(moraleEntry)
  }

  function attack(attack: number) {
    const remainingAttack = Math.max(0, attack - shield.value)
    shield.value = Math.max(0, shield.value - attack)
    health.value = Math.max(0, health.value - remainingAttack)
  }

  function shieldUp(value: number) {
    shield.value = shield.value + value
  }

  function heal(heal: number) {
    const maxHealth = character.maxHealth
    health.value = Math.min(maxHealth, health.value + heal)
  }
  // ========== B.A.S.H ========== //

  function bash(entry: CardAction) {
    const bash = entry.bash
    const moraleLog: BanterAction = {
      card: entry.card,
      value: bash.banter || 0,
      index: entry.index,
    }

    if (moraleLog.value) banter(moraleLog)
    if (bash.attack) onAttack(bash.attack)
    if (bash.shield) shieldUp(bash.shield)
    if (bash.heal) heal(bash.heal)
  }

  return {
    deck,
    health: health,
    shield: shield,
    morale: morale,
    terror: banter,
    hurt: attack,
    bash,
  }
}
