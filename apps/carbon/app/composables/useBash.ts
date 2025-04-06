import type { Character } from '../../types'

interface ValueLog {
  actualChange: number
  attemptedChange: number
  oldValue: number
  newValue: number
  timestamp: number
  index: number
  reductionSources: number[]
}

interface ValueChange {
  change: number
  timestamp: number
  index: number
  reductionSources: number[]
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

  function heal({ change, timestamp, index, reductionSources }: ValueChange) {
    const healthDeficit = maxHealth - health.value
    const valueLog: ValueLog = {
      actualChange: Math.min(healthDeficit, change),
      attemptedChange: change,
      oldValue: health.value,
      newValue: Math.min(maxHealth, health.value + change),
      reductionSources,
      timestamp,
      index,
    }
    healthLog.value.push(valueLog)
  }

  function hurt({
    change,
    attemptedChange,
    timestamp,
    index,
    reductionSources,
  }: ValueChangeAttempt) {
    healthLog.value.push({
      actualChange: Math.max(0, change),
      attemptedChange: attemptedChange,
      oldValue: health.value,
      newValue: health.value - change,
      reductionSources,
      timestamp,
      index,
    })
  }

  return { health, healthLog, heal, hurt }
}

export function useShield() {
  const shieldLog = ref<ValueLog[]>([])
  const shieldChunks = ref<ValueLog[]>([])
  const shield = computed(() => shieldLog.value[shieldLog.value.length - 1]?.newValue || 0)

  function shieldEntry({ change, timestamp, index, reductionSources }: ValueChange): ValueLog {
    return {
      actualChange: change,
      attemptedChange: change,
      oldValue: shield.value,
      newValue: Math.max(0, shield.value + change),
      reductionSources,
      timestamp,
      index,
    }
  }

  function shieldUp({ change, timestamp, index, reductionSources }: ValueChange) {
    if (change < 0) console.error('Shield up called with negative change', change)
    const entry = shieldEntry({ change, timestamp, index, reductionSources })
    shieldLog.value.push(entry)
    shieldChunks.value.push(entry)
  }

  function shieldDown({ change, timestamp, index, reductionSources }: ValueChange) {
    if (change > 0) console.error('Shield down called with positive change', change)
    const entry = shieldEntry({ change, timestamp, index, reductionSources })
    shieldLog.value.push(entry)

    const indexesTouched: number[] = []

    let remainingChange = Math.abs(change) // Work with the absolute value of the change
    while (remainingChange > 0 && shieldChunks.value.length > 0) {
      const chunk = shieldChunks.value[0]
      if (chunk === undefined) break // Safety check
      if (chunk?.actualChange <= remainingChange) {
        // Remove the entire chunk if its actualChange is less than or equal to the remaining change
        remainingChange -= chunk.actualChange
        indexesTouched.push(chunk.index)
        shieldChunks.value.shift() // Remove the first chunk
      } else {
        // Reduce the actualChange of the chunk and stop the loop
        indexesTouched.push(chunk.index)
        chunk.actualChange -= remainingChange
        remainingChange = 0
      }
    }
    return indexesTouched
  }

  return { shield, shieldLog, shieldUp, shieldDown }
}

export function useMorale() {
  const moraleLog = ref<ValueLog[]>([])
  const morale = computed(() => moraleLog.value.reduce((acc, entry) => acc + entry.actualChange, 0))

  function banter({ change, timestamp, index, reductionSources }: ValueChange) {
    moraleLog.value.push({
      actualChange: change,
      attemptedChange: change,
      oldValue: morale.value,
      newValue: Math.max(0, morale.value + change),
      reductionSources,
      timestamp,
      index,
    })
  }

  return { morale, moraleLog, banter }
}
