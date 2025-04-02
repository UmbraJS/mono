<script setup lang="ts">
import { warrior, skeletonKing } from '../data/character'
import Board from '~/components/Board.vue'

const cards = warrior.deck
const opponentCards = skeletonKing.deck

const playerCharacter = ref(warrior)
const opponentCharacter = ref(skeletonKing)
</script>

<template>
  <div class="conflict-wrapper">
    <section class="character opponent">
      <div class="location border">
        <img :src="skeletonKing.field" alt="Location" />
      </div>
      <PlayerCharacter :character="skeletonKing" :reverse="false" />
      <div class="location border">
        <img :src="skeletonKing.field" alt="Location" />
      </div>
    </section>
    <Board :cards="opponentCards" />
    <Board :cards="cards" />
    <section class="character player">
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
      <PlayerCharacter :character="warrior" :reverse="true" />
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
    </section>
  </div>
</template>

<style>
.conflict-wrapper {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 1fr 1fr auto;
  gap: var(--space-1);

  height: 100vh;
  padding: var(--space-1);
  /* perspective: 1000px; */
}

section.character {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 12;
  gap: var(--space-1);
}

section.character > * {
  grid-column: span 4;
}

section.character .location {
  position: relative;
  height: 100%;
}

section.character img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}
</style>
