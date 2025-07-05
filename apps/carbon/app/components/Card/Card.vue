<script setup lang="ts">
import type { Card } from '../../../types'
import CardCooldown from './CardCooldown.vue'
import CardStatsComponent from './CardStats.vue'
import type { OutputChunk } from '../../../utils/time/types';

const props = defineProps<{
  chunks?: OutputChunk[];
  card: Card;
  board?: 'deck' | 'inventory'
  placement?: boolean; // Default to false if not provided
}>()

const view = useView()

const cardStats = computed(() => {
  return props.card.stats[view.realm]
})
</script>

<template>
  <div v-if="!cardStats">BUG: Missing card stats for. Returning nothing</div>
  <CardWrapper v-else :index="card.index" :size="card.size" :card-stats="cardStats" :board="board"
    :placement="placement">
    <CardCooldown v-if="cardStats.bash?.cooldown && chunks" :chunks="chunks" />
    <!-- <img v-if="card.cardInfo.image" :src="card.cardInfo.image.default" alt="Card Image" /> -->
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

.CardWrapper img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 0;
}

.CardWrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: var(--radius);
}
</style>
