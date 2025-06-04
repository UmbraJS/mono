<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import { user, bot } from '../data/character'
import Board from '~/components/Board.vue'
import { gsap } from 'gsap'
// import { useAudioCue } from '@/composables/useAudioCue'
import BashLogs from '~/components/BashLog/BashLogs.vue'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { useSpace } from '~/composables/useSpace'
import type { Card } from '../../types/card'

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

const cardTimeline = spaceTimeSimulation({
  player: user,
  opponent: bot,
  matchDuration: 30
})

const us = useSpace(timeline, cardTimeline.space.player, user.characters)
const op = useSpace(timeline, cardTimeline.space.opponent, bot.characters)

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

function getInfoDeck(deck: Card[]) {
  return deck.map(d => d.info)
}
</script>

<template>
  <div class="conflict-wrapper">
    <section class="sides">
      <div class="location border">
        <!-- <img :src="skeletonKing.field?.image?.default" alt="Location" /> -->
      </div>
      <PlayerCharacter :characters="bot.characters" :health="op.health.value" :shield="op.shield.value"
        :reverse="false" />
      <BashLogs :logs="cardTimeline.space.opponent" :playerInfoDeck="getInfoDeck(user.deck)"
        :opponentInfoDeck="getInfoDeck(bot.deck)" :modal-button="true" />
    </section>
    <Board>
      <PlayerCard v-for="card in cardTimeline.time.opponent" :key="card.card.id" :card="card"
        :opponentLogs="cardTimeline.space.player" :playerLogs="cardTimeline.space.opponent" :time="time"
        :timeline="timeline" />
    </Board>
    <TimeControls :timeline="timeline" :time="time" @on-restart="handleReset" />
    <Board>
      <PlayerCard v-for="card in cardTimeline.time.player" :key="card.card.id" :card="card"
        :opponentLogs="cardTimeline.space.opponent" :playerLogs="cardTimeline.space.player" :time="time"
        :timeline="timeline" />
    </Board>
    <section class="sides">
      <div class="location border">
        <img src="/treasure.jpg" alt="Location" />
      </div>
      <PlayerCharacter :characters="user.characters" :health="us.health.value" :shield="us.shield.value"
        :reverse="false" />
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
