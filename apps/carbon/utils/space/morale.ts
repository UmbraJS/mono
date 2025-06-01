import type { ValueLog, ValueLogCore } from './types'

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
