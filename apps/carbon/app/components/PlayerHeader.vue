<script setup lang="ts">
import PartyBoard from './PartyBoard.vue'
import type { Character } from '~~/types'

defineProps<{
  userCharacters: Character[]
  health: number
  shield: number
}>()
</script>

<template>
  <PartyBoard>
    <div class="location border">
      <!-- <img src="/treasure.jpg" alt="Location" /> -->
    </div>
    <PlayerCharacter :characters="userCharacters" :health="health" :shield="shield" :reverse="false" />
    <div class="location border">
      <div class="money">
        <Icon name="carbon:money" size="1.5em" />
        <p>9</p>
        <p>(+3)</p>
      </div>
    </div>
  </PartyBoard>
</template>

<style>
section.PartyBoard .location {
  position: relative;
  height: 100%;
  padding: var(--space-1);
}

section.PartyBoard img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}

section.PartyBoard .location .money {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  padding: var(--space-1);
}
</style>
