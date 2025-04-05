import type { Character } from '../../types'

interface ValueLog {
  actualChange: number
  attemptedChange: number
  oldValue: number
  newValue: number
  timestamp: number
  index: number
}

interface ValueChange {
  change: number
  timestamp: number
  index: number
}

interface ValueChangeAttempt extends ValueChange {
  attemptedChange: number
}

export function useHealth(character: Character) {
  const maxHealth = character.maxHealth
  const healthLog = ref<ValueLog[]>([])
  const health = computed(() => {
    const lastLog = healthLog.value[healthLog.value.length - 1]
    if (lastLog?.newValue === undefined) return maxHealth
    return lastLog.newValue
  })

  function heal({ change, timestamp, index }: ValueChange) {
    const healthDeficit = maxHealth - health.value
    healthLog.value.push({
      actualChange: Math.min(healthDeficit, change),
      attemptedChange: change,
      oldValue: health.value,
      newValue: Math.min(maxHealth, health.value + change),
      timestamp,
      index,
    })
  }

  function hurt({ change, attemptedChange, timestamp, index }: ValueChangeAttempt) {
    healthLog.value.push({
      actualChange: Math.max(0, change),
      attemptedChange: attemptedChange,
      oldValue: health.value,
      newValue: health.value - change,
      timestamp,
      index,
    })
  }

  return { health, healthLog, heal, hurt }
}

export function useShield() {
  const shieldLog = ref<ValueLog[]>([])
  const shield = computed(() => shieldLog.value[shieldLog.value.length - 1]?.newValue || 0)

  function shieldChange({ change, timestamp, index }: ValueChange) {
    shieldLog.value.push({
      actualChange: change,
      attemptedChange: change,
      oldValue: shieldLog.value[shieldLog.value.length - 1]?.oldValue || 0,
      newValue: Math.max(0, shield.value + change),
      timestamp,
      index,
    })
  }

  return { shield, shieldLog, shieldChange }
}

export function useMorale() {
  const moraleLog = ref<ValueLog[]>([])
  const morale = computed(() => moraleLog.value.reduce((acc, entry) => acc + entry.actualChange, 0))

  function banter({ change, timestamp, index }: ValueChange) {
    moraleLog.value.push({
      actualChange: change,
      attemptedChange: change,
      oldValue: morale.value,
      newValue: Math.max(0, morale.value + change),
      timestamp,
      index,
    })
  }

  return { morale, moraleLog, banter }
}
