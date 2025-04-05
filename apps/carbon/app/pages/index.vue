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
</script>

<template>
  <div class="conflict-wrapper">
    <section class="character opponent">
      <div class="location border">
        <img :src="skeletonKing.field.image?.default" alt="Location" />
      </div>
      <PlayerCharacter
        :character="skeletonKing"
        :health="opponent.health.value"
        :morale="opponent.morale.value"
        :shield="opponent.shield.value"
        :reverse="false"
      />
      <BashLog :player="opponent" :opponentDeck="opponent.deck.value" />
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
        @click="audio?.playCardFlip()"
      />
    </Board>
    <TimeControls :timeline="timeline" @on-restart="handleReset" />
    <Board>
      <p>{{ time }}</p>
      <PlayerCard
        v-for="(card, index) in player.deck.value"
        :key="index"
        :card="card"
        :index="index"
        :timeline="timeline"
        :time="time"
        :reverse="true"
        @bash="player.bash"
        @click="audio?.playCardFlip()"
      />
    </Board>
    <section class="character player">
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
