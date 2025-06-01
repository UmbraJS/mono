import type { ValueLog, ValueLogCore } from './types'

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
