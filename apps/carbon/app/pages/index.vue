<script setup lang="ts">
import { warrior, skeletonKing } from '../data/character'
import Board from '~/components/Board.vue'

const cards = warrior.deck
const opponentCards = skeletonKing.deck
</script>

<template>
  <main>
    <PlayerCharacter :character="skeletonKing" :reverse="false" />
    <div class="field">
      <Board :cards="opponentCards" :reverse="false" />
      <div class="divider"></div>
      <Board :cards="cards" :reverse="true" />
    </div>
    <PlayerCharacter :character="warrior" :reverse="true" />
  </main>
</template>

<style>
main {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-rows: 1fr 2fr 1fr;
  height: 100vh;
}

main .field {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  height: 100%;
  /* perspective: 1000px; */
}

main .divider {
  width: 100%;
  height: 1px;
}
</style>
