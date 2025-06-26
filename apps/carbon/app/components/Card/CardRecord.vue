<script setup lang="ts">
import { Graph, ScrollArea } from '@nobel/core'
import type { CardStats } from '../../../types'
import { Icon } from '@iconify/vue'
import type { BashRecords } from '~/composables/useBashRecords'

// type DataRecord = {
//   x: number
//   y: number
//   y1: number
//   y2: number
// }

const props = defineProps<{
  cardStats: CardStats
  bashRecords: BashRecords
}>()

const recordedData = computed(() => {
  const d = props.bashRecords?.attackRecord.value?.logs
  return d?.map((record) => ({
    x: record.timestamp,
    y: record.attemptedChange,
    y1: 10,
    y2: 10,
  }))
})
</script>

<template>
  <ScrollArea class="CardModalRecords">
    <div v-if="bashRecords" class="bashRecords">
      <div v-if="cardStats.bash?.banter" class="chip base-yellow">
        <Icon icon="mdi:account-injury-outline" />
        Bash: {{ cardStats.bash.banter }}
      </div>
      <div v-if="bashRecords.attackRecord.value?.total" class="chip base-warning">
        <Icon icon="mdi:account-injury-outline" />
        Attack: {{ bashRecords.attackRecord.value.total }} ({{ bashRecords.attackRecord.value.health }} + {{
          bashRecords.attackRecord.value.shield }})
      </div>
      <div v-if="bashRecords.shieldRecord.value" class="chip base-info">
        <Icon icon="mdi:account-injury-outline" />
        Shield: {{ bashRecords.shieldRecord.value }}
      </div>
      <div v-if="bashRecords.healingRecord.value" class="chip base-success">
        <Icon icon="mdi:account-injury-outline" />
        Heal: {{ bashRecords.healingRecord.value }}
      </div>
      <div v-if="bashRecords.totalValue.value" class="chip">
        <Icon icon="mdi:account-injury-outline" />
        Total Value: {{ bashRecords.totalValue.value }}
      </div>
    </div>
    <div class="datavis">
      <Graph v-if="recordedData" :data="recordedData" />
    </div>
  </ScrollArea>
</template>

<style>
.CardModalRecords {
  display: grid;
  flex-direction: column;
  grid-template-rows: auto 1fr;
  gap: var(--space-2);
  height: 100%;
}

.datavis {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

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
