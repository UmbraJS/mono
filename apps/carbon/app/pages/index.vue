<script setup lang="ts">
import { warrior, skeletonKing } from '../data/character'
import Board from '~/components/Board.vue'

const cards = warrior.deck
const opponentCards = skeletonKing.deck
</script>

<template>
  <div class="conflict-wrapper">
    <aside class="opponent">
      <div class="location border">
        <img :src="skeletonKing.field" alt="Location" />
      </div>
      <PlayerCharacter :character="skeletonKing" :reverse="false" />
      <div class="location border">
        <img :src="skeletonKing.field" alt="Location" />
      </div>
    </aside>
    <Board :cards="opponentCards" :reverse="false" />
    <Board :cards="cards" :reverse="true" />
    <aside class="player">
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
      <PlayerCharacter :character="warrior" :reverse="true" />
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
    </aside>
  </div>
</template>

<style>
aside {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 12;
  gap: var(--space-1);
}

aside > * {
  grid-column: span 4;
}

aside .location {
  position: relative;
  height: 100%;
}

aside img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}

.conflict-wrapper {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 1fr 1fr auto;
  gap: var(--space-1);
  height: 100vh;
  padding: var(--space-1);
}

main.field {
  display: grid;
  grid-column: span 12;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* perspective: 1000px; */
}

main .divider {
  width: 100%;
  height: 1px;
}
</style>
