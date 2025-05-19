<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import { warrior, skeletonKing } from '../data/character'
import Board from '~/components/Board.vue'
import { gsap } from 'gsap'
// import { useAudioCue } from '@/composables/useAudioCue'
import BashLogs from '~/components/BashLog/BashLogs.vue'
import { simulateCooldownTimeline } from '../../utils/simulateCards'
import type { timestamp } from '@vueuse/core'

const time = ref(0)

const timeline = gsap.timeline({
  paused: true,
  onUpdate: () => {
    time.value = timeline.time()
  },
})

function handleReset() {
  timeline.restart()
  // Reset the health and morale of both players
}

const opponent = usePlayer({
  timeline,
  character: skeletonKing,
  onAttack: (opponentAttack, index) => player.hurt(opponentAttack, time.value, index),
})

const player = usePlayer({
  timeline,
  character: warrior,
  onAttack: (playerAttack, index) => {
    opponent.hurt(playerAttack, time.value, index)
  },
})

const cardTimeline = simulateCooldownTimeline({
  opponentDeck: opponent.deck,
  playerDeck: player.deck,
  matchDuration: 30
})

console.log('rex cardTimeline', cardTimeline?.player.map((card) => ({
  name: card.name,
  events: card.simulation.cooldownEvents,
})))

// const audio = useAudioCue()

const recentlyClickedFlipSound = ref(false)

function triggerFlipSound() {
  if (recentlyClickedFlipSound.value) return
  recentlyClickedFlipSound.value = true
  // audio?.playCardFlip()
  setTimeout(() => {
    recentlyClickedFlipSound.value = false
  }, 200)
}
</script>

<template>
  <div class="conflict-wrapper">
    <section class="sides">
      <div class="location border">
        <img :src="skeletonKing.field?.image?.default" alt="Location" />
      </div>
      <PlayerCharacter :character="skeletonKing" :health="opponent.health.value"
        :healthDelayed="opponent.healthDelayed.value" :morale="opponent.morale.value" :shield="opponent.shield.value"
        :reverse="false" />
      <BashLogs :player="opponent" :opponent="player" :modal-button="true" />
    </section>
    <Board>
      <PlayerCard v-for="card in cardTimeline.opponent" :key="card.index" :card="card" :opponent="player"
        :player="opponent" :time="time" :timeline="timeline" />
    </Board>
    <TimeControls :timeline="timeline" :time="time" @on-restart="handleReset" />
    <Board>
      <PlayerCard v-for="card in cardTimeline.player" :key="card.index" :card="card" :opponent="opponent"
        :player="player" :time="time" :timeline="timeline" />
    </Board>
    <section class="sides">
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
      <PlayerCharacter :character="warrior" :health="player.health.value" :healthDelayed="player.healthDelayed.value"
        :morale="player.morale.value" :shield="player.shield.value" :reverse="true" />
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
    </section>
  </div>
</template>

<style>
.conflict-wrapper {
  display: grid;
  --side-size: 17vh;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: var(--side-size) 1fr auto 1fr var(--side-size);
  gap: var(--space-1);
  height: 100vh;
  padding: var(--space-1);
}

section.sides {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 12;
  gap: var(--space-1);
}

section.sides>* {
  grid-column: span 4;
}

section.sides .location {
  position: relative;
  height: 100%;
}

section.sides img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}
</style>
