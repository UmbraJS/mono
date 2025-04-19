import type { Character } from '../../types'
import { gsap } from 'gsap'

export interface ValueLogCore {
  actualChange: number
  attemptedChange: number
  timestamp: number
  index: number
  type: 'banter' | 'attack' | 'shield' | 'heal'
  banter: {
    debuffs: ValueLogCore[]
    buffs: ValueLogCore[]
  }
}

export interface ValueLog extends ValueLogCore {
  oldValue: number
  newValue: number
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

  function heal({ actualChange, timestamp, index, banter }: ValueLogCore) {
    const healthDeficit = maxHealth - health.value
    const valueLog: ValueLog = {
      actualChange: Math.min(healthDeficit, actualChange),
      attemptedChange: actualChange,
      oldValue: health.value,
      newValue: Math.min(maxHealth, health.value + actualChange),
      type: 'heal',
      banter,
      timestamp,
      index,
    }
    healthLog.value.push(valueLog)
  }

  function hurt({ actualChange, attemptedChange, timestamp, index, banter }: ValueLogCore) {
    healthLog.value.push({
      actualChange: Math.max(0, actualChange),
      attemptedChange: attemptedChange,
      oldValue: health.value,
      newValue: health.value - actualChange,
      type: 'attack',
      banter,
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
    let shieldCounter = 0
    const updateShieldLog = shieldLog.value.map((entry) => {
      shieldCounter += entry.actualChange
      return {
        ...entry,
        newValue: shieldCounter,
      }
    })
    const lastLog = updateShieldLog[shieldLog.value.length - 1]?.newValue || 0
    shield.value = lastLog
    shieldLog.value = updateShieldLog
  }

  function shieldUp({ actualChange, timestamp, index, banter }: ValueLogCore) {
    if (actualChange < 0) console.error('Shield up called with negative change', actualChange)
    const lastLog = shieldLog.value[shieldLog.value.length - 1]?.newValue || 0

    shieldLog.value.push({
      actualChange: actualChange,
      attemptedChange: actualChange,
      oldValue: lastLog,
      newValue: Math.max(0, lastLog + actualChange),
      type: 'shield',
      banter,
      timestamp,
      index,
    })
    updateShield()
  }

  function shieldDown({
    actualChange,
    index,
    timestamp,
    type,
    attemptedChange,
    banter,
  }: ValueLogCore) {
    if (shield.value <= 0) return

    let remainingDebuff = actualChange

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
        banter: {
          buffs: entry.banter.buffs,
          debuffs: [
            ...entry.banter.debuffs,
            {
              attemptedChange: attemptedChange,
              actualChange: appliedDebuff,
              index: index,
              type: type,
              timestamp: timestamp,
              banter,
            },
          ],
        },
        actualChange: entry.actualChange - appliedDebuff,
        newValue: Math.max(0, entry.newValue - Math.max(0, potentialChangeAfterDebuff)),
        oldValue: entry.oldValue,
      }
    })

    updateShield()
  }

  return { shield, shieldLog, shieldUp, shieldDown }
}

export function useMorale() {
  const moraleLog = ref<ValueLog[]>([])
  const morale = computed(() => moraleLog.value.reduce((acc, entry) => acc + entry.actualChange, 0))

  function banter({ actualChange, timestamp, index, banter }: ValueLogCore) {
    moraleLog.value.push({
      actualChange: actualChange,
      attemptedChange: actualChange,
      oldValue: morale.value,
      newValue: Math.max(0, morale.value + actualChange),
      banter,
      type: 'banter',
      timestamp,
      index,
    })
  }

  return { morale, moraleLog, banter }
}
