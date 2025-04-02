<script setup lang="ts">
import PlayerCard from '~/components/Card.vue'
import type { Card } from '../../types'

defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div class="board-wrapper">
    <div class="board">
      <div class="cardSleve border" v-for="(card, index) in cards" :key="index">
        <PlayerCard :card="card" />
      </div>
    </div>
    <div class="subSpace">
      <CardSpace v-for="index in 12" :key="index" />
    </div>
  </div>
</template>

<style>
.board-wrapper {
  position: relative;
  display: grid;
  grid-column: span 12;
  grid-template-columns: subgrid;
  grid-template-areas: 'stack stack stack stack stack stack stack stack stack stack stack stack';
  height: 100%;

  padding: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius);
  height: 100%;
}

.board {
  --rotateAmount: 15;

  position: relative;
  display: grid;
  grid-template-columns: subgrid;
  grid-area: stack;
  grid-column: 1 / -1;
  z-index: 2;
}

.cardSleve {
  background: var(--base-9);
  border-radius: var(--radius);
  height: 100%;
}

.subSpace {
  display: grid;
  grid-template-columns: subgrid;
  grid-area: stack;
  grid-column: 1 / -1;
  z-index: 1;

  height: 100%;
  width: 100%;
}
</style>
