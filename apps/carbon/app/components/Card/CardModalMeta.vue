<script setup lang="ts">
import { DialogTitle, Tabs, Graph } from '@nobel/core'
import type { SimCard } from '../../../types'
import CardModalDetails from './CardModalDetails.vue'
import { Icon } from '@iconify/vue'
import type { UsePlayerReturn } from '../../composables/usePlayer'
import type { BashRecords } from '~/composables/useBashRecords'
import { ScrollArea } from '@nobel/core'

type DataRecord = {
  x: number
  y: number
  y1: number
  y2: number
}

const props = defineProps<{
  card: SimCard
  opponent: UsePlayerReturn
  player: UsePlayerReturn
  bashRecords: BashRecords
}>()

const recordedData = computed(() => {
  const d = props.bashRecords.attackRecord.value.logs
  return d.map((record) => ({
    x: record.timestamp,
    y: record.attemptedChange,
    y1: 10,
    y2: 10,
  }))
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
        <ScrollArea class="CardModalRecords">
          <div class="bashRecords">
            <div class="chip base-yellow" v-if="card.stats?.banter">
              <Icon icon="mdi:account-injury-outline" />
              Bash: {{ card.stats.banter }}
            </div>
            <div class="chip base-warning" v-if="bashRecords.attackRecord.value.total">
              <Icon icon="mdi:account-injury-outline" />
              Attack: {{ bashRecords.attackRecord.value.total }} ({{ bashRecords.attackRecord.value.health }} + {{
                bashRecords.attackRecord.value.shield }})
            </div>
            <div class="chip base-info" v-if="bashRecords.shieldRecord.value">
              <Icon icon="mdi:account-injury-outline" />
              Shield: {{ bashRecords.shieldRecord.value }}
            </div>
            <div class="chip base-success" v-if="bashRecords.healingRecord.value">
              <Icon icon="mdi:account-injury-outline" />
              Heal: {{ bashRecords.healingRecord.value }}
            </div>
            <div class="chip" v-if="bashRecords.totalValue.value">
              <Icon icon="mdi:account-injury-outline" />
              Total Value: {{ bashRecords.totalValue.value }}
            </div>
          </div>
          <div class="datavis">
            <Graph :data="recordedData" />
          </div>
        </ScrollArea>
      </template>
    </Tabs>
  </div>
</template>

<style>
.BashLogTabs {
  height: 100%;
}

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
