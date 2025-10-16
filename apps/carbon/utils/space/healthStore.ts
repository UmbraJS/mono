import type { ValueLog, ValueLogCore } from './types'

export function healthStore(maxHealth: number) {
  const healthLog: ValueLog[] = []

  function getHealth() {
    const lastLog = healthLog[healthLog.length - 1]
    if (lastLog?.newValue === undefined) return maxHealth
    return lastLog.newValue
  }

  function heal({ actualChange, timestamp, index, banter, board }: ValueLogCore) {
    const currentHealth = getHealth()
    const healthDeficit = maxHealth - currentHealth
    healthLog.push({
      actualChange: Math.min(healthDeficit, actualChange),
      attemptedChange: actualChange,
      oldValue: currentHealth,
      newValue: Math.min(maxHealth, currentHealth + actualChange),
      type: 'heal',
      board,
      banter,
      timestamp,
      index,
    })
  }

  function hurt({ actualChange, attemptedChange, timestamp, index, banter, board }: ValueLogCore) {
    const currentHealth = getHealth()
    console.log(`Rex: DEBUG - Health hurt entry: ${actualChange} damage at ${timestamp}s from card index ${index} on ${board} side`);
    healthLog.push({
      actualChange: Math.max(0, actualChange),
      attemptedChange: attemptedChange,
      oldValue: currentHealth,
      newValue: currentHealth - actualChange,
      type: 'attack',
      banter,
      timestamp,
      index,
      board,
    })
  }

  return { getHealth, healthLog, heal, hurt }
}
