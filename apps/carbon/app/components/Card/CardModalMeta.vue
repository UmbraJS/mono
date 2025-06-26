<script setup lang="ts">
import { DialogTitle, Tabs } from '@nobel/core'
import type { CardInfo, CardStats } from '../../../types'
import CardModalDetails from './CardModalDetails.vue'
import type { BashRecords } from '~/composables/useBashRecords'

defineProps<{
  cardStats: CardStats
  cardInfo: CardInfo
  bashRecords?: BashRecords
}>()
</script>

<template>
  <div class="cardMeta">
    <DialogTitle>
      <span>lvl {{ cardStats.level }} - </span>{{ cardInfo.name }}
    </DialogTitle>

    <Tabs
class="ModalBashLogTabs" aria-label="Actions" :tabs="[
      { label: 'Details', icon: 'mdi:account-card-outline' },
      { label: 'Stats', icon: 'mdi:star-four-points-circle' },
    ]">
      <template #tab1>
        <CardModalDetails :info="cardInfo" :stats="cardStats" />
      </template>
      <template v-if="bashRecords" #tab2>
        <CardRecord :card-stats="cardStats" :bash-records="bashRecords" />
      </template>
    </Tabs>
  </div>
</template>

<style>
.ModalBashLogTabs {
  height: 100%;
}
</style>
