<script setup lang="ts">
import type { Card } from '../../../types'
import CardCooldown from './CardCooldown.vue'
import CardStatsComponent from './CardStats.vue'
import type { OutputChunk } from '../../../utils/time/types';

const props = defineProps<{
  chunks?: OutputChunk[];
  card: Card;
  board?: 'deck' | 'inventory'
  variant?: 'default' | 'freeSize' | 'cardSize';
}>()

const view = useView()

const cardStats = computed(() => {
  if (!props.card?.stats) return undefined
  const stats = props.card.stats[view.realm]
  // Fallback to base stats if the requested realm doesn't exist
  return stats || props.card.stats.base
})
</script>

<template>
  <div v-if="!cardStats">BUG: Missing card stats for. Returning nothing</div>
  <CardWrapper v-else :index="card.index" :size="card.size" :card-stats="cardStats" :board="board" :variant="variant">
    <CardCooldown v-if="cardStats.bash?.cooldown && chunks" :chunks="chunks" />

    <NuxtImg v-if="card.info.image" class="avatar" :src="card.info.image.default" :alt="card.info.description"
      width="450" height="400" />

    <CardStatsComponent :bash="cardStats.bash" />
  </CardWrapper>
</template>

<style lang="scss">
.RecordedValue {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;

  background: rgba($color: #000000, $alpha: 0.5);
}

.RecordedValue p {
  background: var(--base-20);
  padding: var(--space-quark);
  border-radius: var(--radius);
}

#CardWrapper img {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;

  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
</style>
