<script setup lang="ts">
import { user, bot } from '../data/character'
import { gsap } from 'gsap'
import { spaceTimeSimulation } from '../../utils/spaceTimeSimulation'
import { useSpace } from '~/composables/useSpace'
import QuestBoard from '~/components/QuestBoard.vue'

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
  <QuestBoard :cardTimeline="cardTimeline" :timeline="timeline" :time="time" />
</template>
