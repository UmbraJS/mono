import type { UsePlayerReturn } from './usePlayer'
import type { ValueLogCore } from './useBash'

interface BashRecordProps {
  player: UsePlayerReturn
  opponent: UsePlayerReturn
  index: number
}

export function useBashRecords(props: BashRecordProps) {
const attackRecord = computed(() => {
  const healthAttackLogs = props.opponent.healthLog.value.filter((entry) => {
    if (entry.type !== 'attack') return
    return entry.index === props.index
  })

  let shieldAttackLogs: ValueLogCore[] = []
  props.opponent.shieldLog.value.forEach((entry) => {
    const shieldDebuffs = entry.banter.debuffs
    if (!shieldDebuffs.length) return
    shieldAttackLogs = [
      ...shieldAttackLogs,
      ...shieldDebuffs
    ]
  })

  const filteredShieldAttackLogs = shieldAttackLogs.filter((entry) => {
    if (entry.type !== 'attack') return
    return entry.index === props.index
  })

  const accumulatedHealtAttack = healthAttackLogs.reduce((acc, entry) => {
    return acc + entry.actualChange
  }, 0)

  const accumulatedShieldAttack = filteredShieldAttackLogs.reduce((acc, entry) => {
    return acc + entry.actualChange
  }, 0)

  return {
    health: accumulatedHealtAttack,
    shield: accumulatedShieldAttack,
    total: accumulatedHealtAttack + accumulatedShieldAttack
  }
})

const healingRecord = computed(() => {
  return props.player.healthLog.value.filter((entry) => {
    if (entry.type !== 'heal') return
    return entry.index === props.index
  }).reduce((acc, entry) => {
    return acc + entry.actualChange
  }, 0)
})

const shieldRecord = computed(() => {
  return props.player.shieldLog.value.filter((entry) => {
    if (entry.type !== 'shield') return
    return entry.index === props.index
  }).reduce((acc, entry) => {
    return acc + entry.attemptedChange
  }, 0)
})


const totalValue = computed(() => {
  return healingRecord.value + attackRecord.value.total + shieldRecord.value
})

return {
  attackRecord,
  healingRecord,
  shieldRecord,
  totalValue
}
}

export type BashRecords = ReturnType<typeof useBashRecords>
