<script setup lang="ts">
import { user, bot } from '../data/character'
import { gsap } from 'gsap'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { useSpace } from '~/composables/useSpace'
import QuestBoard from '~/components/QuestBoard.vue'

// const time = ref(0)

// const timeline = gsap.timeline({
//   paused: true,
//   onUpdate: () => {
//     time.value = timeline.time()
//   },
// })

// const cardTimeline = spaceTimeSimulation({
//   player: user,
//   opponent: bot,
//   matchDuration: 30
// })

// const us = useSpace(timeline, cardTimeline.space.player, user.characters)
// const op = useSpace(timeline, cardTimeline.space.opponent, bot.characters)
</script>

<template>
  <!-- <div class="CarbonLayout">
    <OpponentHeader :health="op.health.value" :shield="op.shield.value" :logs="cardTimeline.space.opponent" :bot="bot"
      :user="user" />

    <MatchBoard :cardTimeline="cardTimeline" :timeline="timeline" :time="time" />

    <PlayerHeader :userCharacters="user.characters" :health="us.health.value" :shield="us.shield.value" />
  </div> -->
</template>

<style>
.CarbonLayout {
  display: grid;
  --side-size: 17vh;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: var(--side-size) 1fr var(--side-size);
  gap: var(--space-1);
  height: 100vh;
  padding: var(--space-1);
}
</style>
