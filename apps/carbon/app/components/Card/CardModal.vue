<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogModal } from '@nobel/core'
import type { SimCard, CardStats, CardInfo } from '../../../types'
import CardModalAvatar from './CardModalAvatar.vue'
import CardModalMeta from './CardModalMeta.vue'
import type { BashRecords } from '~/composables/useBashRecords'

defineProps<{
  card: SimCard
  cardStats: CardStats
  cardInfo: CardInfo
  bashRecords: BashRecords
  time: number
  timeline: gsap.core.Timeline;
}>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogModal variant="accent">
      <div class="DialogWrapper">
        <CardModalAvatar :card="card" :cardStats="cardStats" :cardInfo="cardInfo" :time="time" :timeline="timeline" />
        <CardModalMeta :cardStats="cardStats" :cardInfo="cardInfo" :bashRecords="bashRecords" />
      </div>
    </DialogModal>
  </DialogRoot>
</template>

<style>
.DialogContent {
  padding: var(--space-1);
  max-width: 850px;
}

.DialogContent .chip {
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

.DialogWrapper {
  display: flex;
  gap: 1rem;
}
</style>
