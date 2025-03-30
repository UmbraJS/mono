<script setup lang="ts">
import Card from '~/components/Card.vue'
import { cards } from ' ~/assets/cards'

const get6Cards = () => {
  return cards.slice(0, 6)
}
</script>

<template>
  <main>
    <div class="board border">
      <div class="cardSleve border" v-for="(card, index) in get6Cards()" :key="index">
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
  height: 100vh;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
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
