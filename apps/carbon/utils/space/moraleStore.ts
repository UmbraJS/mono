import type { ValueLog, ValueLogCore } from './types'

export function moraleStore() {
  const moraleLog: ValueLog[] = []

  function getMorale() {
    return moraleLog.reduce((acc, entry) => acc + entry.actualChange, 0)
  }

  function banter({ actualChange, timestamp, index, banter }: ValueLogCore) {
    const morale = getMorale()
    moraleLog.push({
      actualChange: actualChange,
      attemptedChange: actualChange,
      oldValue: morale,
      newValue: Math.max(0, morale + actualChange),
      banter,
      type: 'banter',
      timestamp,
      index,
    })
  }

  return { getMorale, moraleLog, banter }
}
