import type { Character } from '../../types'
import { gsap } from 'gsap'

interface ValueChangeSource {
  amount: number
  sourceIndex: number
}

interface ValueLog {
  actualChange: number
  attemptedChange: number
  oldValue: number
  newValue: number
  timestamp: number
  index: number
  debufs: ValueChangeSource[]
  buffs: ValueChangeSource[]
}

interface ValueChange {
  change: number
  timestamp: number
  index: number
  banter: {
    debufs: ValueChangeSource[]
    buffs: ValueChangeSource[]
  }
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

  const healthDelayed = ref(maxHealth)

  watch(health, (newValue) => {
    gsap.to(healthDelayed, {
      duration: 0.5,
      value: newValue,
    })
  })

  function heal({ change, timestamp, index, banter }: ValueChange) {
    const healthDeficit = maxHealth - health.value
    const valueLog: ValueLog = {
      actualChange: Math.min(healthDeficit, change),
      attemptedChange: change,
      oldValue: health.value,
      newValue: Math.min(maxHealth, health.value + change),
      debufs: banter.buffs,
      buffs: banter.debufs,
      timestamp,
      index,
    }
    healthLog.value.push(valueLog)
  }

  function hurt({ change, attemptedChange, timestamp, index, banter }: ValueChangeAttempt) {
    healthLog.value.push({
      actualChange: Math.max(0, change),
      attemptedChange: attemptedChange,
      oldValue: health.value,
      newValue: health.value - change,
      buffs: banter.buffs,
      debufs: banter.debufs,
      timestamp,
      index,
    })
  }

  return { healthDelayed, health, healthLog, heal, hurt }
}

export function useShield() {
  const shieldLog = shallowRef<ValueLog[]>([])
  const shield = shallowRef(0)

  function updateShield() {
    const lastLog = shieldLog.value[shieldLog.value.length - 1]?.newValue || 0
    shield.value = lastLog
    return lastLog
  }

  function shieldUp({ change, timestamp, index, banter }: ValueChange) {
    if (change < 0) console.error('Shield up called with negative change', change)
    const lastLog = shieldLog.value[shieldLog.value.length - 1]?.newValue || 0

    shieldLog.value.push({
      actualChange: change,
      attemptedChange: change,
      oldValue: lastLog,
      newValue: Math.max(0, lastLog + change),
      debufs: banter.debufs,
      buffs: banter.buffs,
      timestamp,
      index,
    })
    updateShield()
  }

  function shieldDown({ change, index }: ValueChange) {
    if (shield.value <= 0) return

    let remainingDebuff = change

    shieldLog.value = shieldLog.value.map((entry) => {
      // Skip entries that cannot be debuffed
      if (remainingDebuff <= 0 || entry.newValue <= 0 || entry.actualChange <= 0) {
        return entry
      }

      // Calculate the debuff to apply to this entry
      const potentialChangeAfterDebuff = entry.actualChange - remainingDebuff
      const appliedDebuff = potentialChangeAfterDebuff < 0 ? entry.actualChange : remainingDebuff

      // Update the remaining debuff for subsequent entries
      remainingDebuff = Math.max(0, remainingDebuff - entry.actualChange)

      // Return the updated entry with the debuff applied
      return {
        ...entry,
        debufs: [
          ...entry.debufs,
          {
            amount: appliedDebuff,
            sourceIndex: index,
          },
        ],
        actualChange: entry.actualChange - appliedDebuff,
        newValue: Math.max(0, entry.newValue - Math.max(0, potentialChangeAfterDebuff)),
      }
    })

    updateShield()
  }

  return { shield, shieldLog, shieldUp, shieldDown }
}

export function useMorale() {
  const moraleLog = ref<ValueLog[]>([])
  const morale = computed(() => moraleLog.value.reduce((acc, entry) => acc + entry.actualChange, 0))

  function banter({ change, timestamp, index, banter }: ValueChange) {
    moraleLog.value.push({
      actualChange: change,
      attemptedChange: change,
      oldValue: morale.value,
      newValue: Math.max(0, morale.value + change),
      buffs: banter.buffs,
      debufs: banter.debufs,
      timestamp,
      index,
    })
  }

  return { morale, moraleLog, banter }
}
