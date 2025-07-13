import type { ValueLogCore } from './useBash'
import type { SpaceOutput } from '../../utils/matchSimulator'

interface BashRecordProps {
  playerLogs?: SpaceOutput
  opponentLogs?: SpaceOutput
  index: number
}

export function useBashRecords(props: BashRecordProps) {
  if (!props.playerLogs || !props.opponentLogs) return

  const attackRecord = computed(() => {
    if (!props.playerLogs || !props.opponentLogs) return

    const filteredHealthAttackLogs = props.playerLogs.healthLog.filter((entry) => {
      if (entry.type !== 'attack') return
      return entry.index === props.index
    })

    let shieldAttackLogs: ValueLogCore[] = []
    props.opponentLogs.shieldLog.forEach((entry) => {
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

    const accumulatedHealtAttack = filteredHealthAttackLogs.reduce((acc, entry) => {
      return acc + entry.actualChange
    }, 0)

    const accumulatedShieldAttack = filteredShieldAttackLogs.reduce((acc, entry) => {
      return acc + entry.actualChange
    }, 0)

    return {
      health: accumulatedHealtAttack,
      shield: accumulatedShieldAttack,
      total: accumulatedHealtAttack + accumulatedShieldAttack,
      logs: filteredHealthAttackLogs
    }
  })

  const healingRecord = computed(() => {
    if (!props.playerLogs) return
    return props.playerLogs.healthLog.filter((entry) => {
      if (entry.type !== 'heal') return
      return entry.index === props.index
    }).reduce((acc, entry) => {
      return acc + entry.actualChange
    }, 0)
  })

  const shieldRecord = computed(() => {
    if (!props.playerLogs) return
    return props.playerLogs.shieldLog.filter((entry) => {
      if (entry.type !== 'shield') return
      return entry.index === props.index
    }).reduce((acc, entry) => {
      return acc + entry.attemptedChange
    }, 0)
  })

  const totalValue = computed(() => {
    if (!attackRecord.value || !healingRecord.value || !shieldRecord.value) return 0
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
