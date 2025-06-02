import type { ValueLog, ValueLogCore } from './types'

export function shieldStore() {
  let shieldLog: ValueLog[] = []

  function getShield() {
    const lastLog = shieldLog[shieldLog.length - 1]
    if (lastLog?.newValue === undefined) return 0
    return lastLog.newValue
  }

  function updateShield() {
    let shieldCounter = 0
    const updateShieldLog = shieldLog.map((entry) => {
      shieldCounter += entry.actualChange
      return {
        ...entry,
        newValue: shieldCounter,
      }
    })
    shieldLog = updateShieldLog
  }

  function shieldUp({ actualChange, timestamp, index, banter }: ValueLogCore) {
    if (actualChange < 0) console.error('Shield up called with negative change', actualChange)
    const lastLog = shieldLog[shieldLog.length - 1]?.newValue || 0

    shieldLog.push({
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
    if (getShield() <= 0) return

    let remainingDebuff = actualChange

    shieldLog = shieldLog.map((entry) => {
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

  return { getShield, shieldLog, shieldUp, shieldDown }
}
