<script setup lang="ts">
import PlayerCard from '~/components/Card.vue'
import { warrior, skeletonKing } from '../data/character'
import Board from '~/components/Board.vue'
import { gsap } from 'gsap'
import { terminalHealth } from '@/utils/health'
import BashLog from '~/components/BashLog.vue'
import { useAudioCue } from '@/composables/useAudioCue'

const time = ref(0)

const timeline = gsap.timeline({
  onUpdate: () => {
    time.value = timeline.time()
  },
})

function handleReset() {
  timeline.restart()
  // Reset the health and morale of both players
}

const opponent = usePlayer({
  character: skeletonKing,
  onAttack: (opponentAttack, index) => player.hurt(opponentAttack, time.value, index),
})

const player = usePlayer({
  character: warrior,
  onAttack: (playerAttack, index) => {
    opponent.hurt(playerAttack, time.value, index)
  },
})

const audio = useAudioCue()

const recentlyClickedFlipSound = ref(false)

function triggerFlipSound() {
  if (recentlyClickedFlipSound.value) return
  recentlyClickedFlipSound.value = true
  audio?.playCardFlip()
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
      <PlayerCharacter
        :character="skeletonKing"
        :health="opponent.health.value"
        :morale="opponent.morale.value"
        :shield="opponent.shield.value"
        :reverse="false"
      />
      <BashLog
        :player="opponent"
        :playerDeck="opponent.deck.value"
        :opponetDeck="player.deck.value"
      />
    </section>
    <Board>
      <PlayerCard
        v-for="(card, index) in opponent.deck.value"
        :key="index"
        :card="card"
        :index="index"
        :timeline="timeline"
        :time="time"
        :reverse="false"
        @bash="opponent.bash"
        @mousedown="triggerFlipSound"
        @mouseup="triggerFlipSound"
      />
    </Board>
    <TimeControls :timeline="timeline" :time="time" @on-restart="handleReset" />
    <Board>
      <PlayerCard
        v-for="(card, index) in player.deck.value"
        :key="index"
        :card="card"
        :index="index"
        :timeline="timeline"
        :time="time"
        :reverse="true"
        @bash="player.bash"
        @mousedown="triggerFlipSound"
        @mouseup="triggerFlipSound"
      />
    </Board>
    <section class="sides">
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
      <PlayerCharacter
        :character="warrior"
        :health="player.health.value"
        :morale="player.morale.value"
        :shield="player.shield.value"
        :reverse="true"
      />
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
  grid-template-rows: auto 1fr auto 1fr auto;
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

section.sides > * {
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
