<script setup lang="ts">
import { DialogTitle, Tabs } from '@nobel/core'
import type { Card } from '../../../types'
import CardModalDetails from './CardModalDetails.vue'
import type { BashRecords } from '~/composables/useBashRecords'

defineProps<{
  card: Card;
  bashRecords?: BashRecords
}>()

</script>

<template>
  <div class="cardMeta">
    <DialogTitle>
      <span>lvl {{ card.stats.level }} - </span>{{ card.info.name }}
    </DialogTitle>

    <Tabs id="ModalBashLogTabs" :tabs="[
      { label: 'Details', icon: 'mdi:account-card-outline' },
      { label: 'Stats', icon: 'mdi:star-four-points-circle' },
    ]">
      <template #tab1>
        <CardModalDetails :card="card" />
      </template>
      <template v-if="bashRecords" #tab2>
        <CardRecord :card="card" :bash-records="bashRecords" />
      </template>
    </Tabs>
  </div>
</template>

<style>
#ModalBashLogTabs {
  height: 100%;
}
</style>
