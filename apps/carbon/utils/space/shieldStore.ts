import type { ValueLog, ValueLogCore } from './types'

export function shieldStore() {
  const shieldLog: ValueLog[] = []

  function getShield() {
    const lastLog = shieldLog[shieldLog.length - 1]
    if (lastLog?.newValue === undefined) return 0
    return lastLog.newValue
  }

  function shieldUp({ actualChange, timestamp, index, banter, board }: ValueLogCore) {
    if (actualChange < 0) console.error('Shield up called with negative change', actualChange)
    const lastLog = shieldLog[shieldLog.length - 1]?.newValue || 0
    shieldLog.push({
      actualChange: Math.max(actualChange, lastLog),
      attemptedChange: actualChange,
      oldValue: lastLog,
      newValue: Math.max(0, lastLog + actualChange),
      type: 'shield',
      banter,
      timestamp,
      index,
      board,
    })
  }

  function shieldDown({
    actualChange,
    index,
    timestamp,
    banter,
    board,
  }: ValueLogCore) {
    if (getShield() <= 0) return
    const lastLog = shieldLog[shieldLog.length - 1]?.newValue || 0
    shieldLog.push({
      actualChange: actualChange,
      attemptedChange: actualChange,
      oldValue: lastLog,
      newValue: Math.max(0, Math.max(0, lastLog + actualChange)),
      type: 'shield',
      banter,
      timestamp,
      index,
      board,
    })

  }

  return { getShield, shieldLog, shieldUp, shieldDown }
}
