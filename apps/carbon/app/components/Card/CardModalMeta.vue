<script setup lang="ts">
import { DialogTitle, Tabs, Graph } from '@nobel/core'
import type { Card } from '../../../types'
import CardModalDetails from './CardModalDetails.vue'
import { Icon } from '@iconify/vue'
import type { UsePlayerReturn } from '../../composables/usePlayer'
import type { BashRecords } from '~/composables/useBashRecords'

defineProps<{
  card: Card
  opponent: UsePlayerReturn
  player: UsePlayerReturn
  index: number
  bashRecords: BashRecords
}>()
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
        <div class="CardModalRecords">
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
            <Graph :data="[
              { x: 1, y: 2, y1: 3, y2: 4 },
              { x: 2, y: 3, y1: 4, y2: 5 },
              { x: 3, y: 4, y1: 5, y2: 6 },
              { x: 4, y: 5, y1: 6, y2: 7 },
              { x: 5, y: 6, y1: 7, y2: 8 },
              { x: 6, y: 7, y1: 8, y2: 9 },
              { x: 7, y: 8, y1: 9, y2: 10 },
              { x: 8, y: 9, y1: 10, y2: 11 },
              { x: 9, y: 10, y1: 11, y2: 12 },
              { x: 10, y: 11, y1: 12, y2: 13 },
              { x: 11, y: 12, y1: 13, y2: 14 },
            ]" />
          </div>
        </div>
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
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 300px;
  background-color: black;
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
