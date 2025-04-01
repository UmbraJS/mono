<script setup lang="ts">
import PlayerCard from '~/components/Card.vue'
import type { Card } from '../../types'

defineProps<{
  cards: Card[]
  reverse: boolean
}>()
</script>

<template>
  <div class="board" :class="{ reverse }">
    <div class="cardSleve border" v-for="(card, index) in cards" :key="index">
      <PlayerCard :card="card" />
    </div>
  </div>
</template>

<style>
.board {
  --rotateAmount: 15;

  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius);
  height: 100%;
  transform: rotateX(calc(var(--rotateAmount) * -1deg));
}

.reverse {
  transform: rotateX(calc(var(--rotateAmount) * 1deg));
}

.cardSleve {
  background: var(--base-9);
  border-radius: var(--radius);
  height: 100%;
  width: 150px;
}
</style>
