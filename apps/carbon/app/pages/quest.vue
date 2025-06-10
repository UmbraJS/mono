<script setup lang="ts">
import { user, bot } from '../data/character'
import { gsap } from 'gsap'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { useSpace } from '~/composables/useSpace'

const time = ref(0)

const timeline = gsap.timeline({
  paused: true,
  onUpdate: () => {
    time.value = timeline.time()
  },
})

const cardTimeline = spaceTimeSimulation({
  player: user,
  opponent: bot,
  matchDuration: 30
})

const us = useSpace(timeline, cardTimeline.space.player, user.characters)
</script>

<template>
  <main class="quest-wrapper">
    <QuestBoard v-if="false" />
    <InventoryBoard v-else :timeline="timeline" :time="time" :deck="user.deck" :inventory="user.inventory"
      realm="base" />
    <PlayerHeader :userCharacters="user.characters" :health="us.health.value" :shield="us.shield.value" />
  </main>
</template>

<style>
main.quest-wrapper {
  --side-size: 17vh;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr var(--side-size);
  gap: var(--space-1);

  height: 100vh;

  padding: var(--space-1);
}
</style>
