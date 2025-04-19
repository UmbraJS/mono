<script setup lang="ts">
import { DialogTitle, Tabs } from '@nobel/core'
import type { Card } from '../../../types'
import CardModalDetails from './CardModalDetails.vue'
import { Icon } from '@iconify/vue'
import type { UsePlayerReturn } from '../../composables/usePlayer'
import type { ValueLogCore } from '../../composables/useBash'

const props = defineProps<{
  card: Card
  opponent: UsePlayerReturn
  player: UsePlayerReturn
  index: number
}>()

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

const totalValue = computed(() => {
  return healingRecord.value + attackRecord.value.total
})

</script>

<template>
  <div class="cardMeta">
    <DialogTitle>
      <span>lvl {{ card.level }} - </span>{{ card.name }}
    </DialogTitle>

    <Tabs class="BashLogTabs" ariaLabel="Actions" :tabs="[
      { label: 'Details', icon: 'mdi:account-card-outline' },
      { label: 'Stats', icon: 'mdi:star-four-points-circle' },
    ]">
      <template #tab1>
        <CardModalDetails :card="card" />
      </template>
      <template #tab2>
        <div class="bashRecords">
          <div class="chip base-yellow" v-if="card.stats?.banter">
            <Icon icon="mdi:account-injury-outline" />
            Bash: {{ card.stats.banter }}
          </div>
          <div class="chip base-warning" v-if="attackRecord.total">
            <Icon icon="mdi:account-injury-outline" />
            Attack: {{ attackRecord.total }} ({{ attackRecord.health }} + {{ attackRecord.shield }})
          </div>
          <div class="chip base-info" v-if="healingRecord">
            <Icon icon="mdi:account-injury-outline" />
            Shield: {{ healingRecord }}
          </div>
          <div class="chip base-success" v-if="healingRecord">
            <Icon icon="mdi:account-injury-outline" />
            Heal: {{ healingRecord }}
          </div>
          <div class="chip" v-if="totalValue">
            <Icon icon="mdi:account-injury-outline" />
            Total Value: {{ totalValue }}
          </div>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<style>
.bashRecords {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.cardMeta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  height: 100%;
  padding-top: var(--space-3);
}

.cardMeta .chip {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  border: solid 2px var(--base-60);
  padding: var(--space-quark);
  width: 100%;
  color: var(--base-120);
  background-color: var(--base-20);
  border-radius: var(--radius);
}
</style>
