<script setup lang="ts">
import Card from '~/components/Card.vue'
import { warrior, skeletonKing } from '../data/character'

const cards = warrior.deck
const opponentCards = skeletonKing.deck
</script>

<template>
  <main>
    <div class="board border">
      <div class="cardSleve border" v-for="(card, index) in opponentCards" :key="index">
        <Card :card="card" />
      </div>
    </div>
    <div class="board border">
      <div class="cardSleve border" v-for="(card, index) in cards" :key="index">
        <Card :card="card" />
      </div>
    </div>
  </main>
</template>

<style>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-4);
  height: 100vh;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.board {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-4);
  background: var(--base-10);
  border-radius: var(--radius);
}

.cardSleve {
  background: var(--base-9);
  border-radius: var(--radius);
  height: 200px;
  width: 150px;
}
</style>
