import type { ValueLog, ValueLogCore } from './types'

export function healthStore(maxHealth: number) {
  const healthLog: ValueLog[] = []

  function getHealth() {
    const lastLog = healthLog[healthLog.length - 1]
    if (lastLog?.newValue === undefined) return maxHealth
    return lastLog.newValue
  }

  function heal({ actualChange, timestamp, index, banter }: ValueLogCore) {
    const currentHealth = getHealth()
    const healthDeficit = maxHealth - currentHealth
    healthLog.push({
      actualChange: Math.min(healthDeficit, actualChange),
      attemptedChange: actualChange,
      oldValue: currentHealth,
      newValue: Math.min(maxHealth, currentHealth + actualChange),
      type: 'heal',
      banter,
      timestamp,
      index,
    })
  }

  function hurt({ actualChange, attemptedChange, timestamp, index, banter }: ValueLogCore) {
    const currentHealth = getHealth()
    healthLog.push({
      actualChange: Math.max(0, actualChange),
      attemptedChange: attemptedChange,
      oldValue: currentHealth,
      newValue: currentHealth - actualChange,
      type: 'attack',
      banter,
      timestamp,
      index,
    })
  }

  return { getHealth, healthLog, heal, hurt }
}
