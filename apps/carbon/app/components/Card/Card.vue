<script setup lang="ts">
import type { CardInfo, CardStats } from '../../../types'
import CardCooldown from './CardCooldown.vue'
import CardStatsComponent from './CardStats.vue'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'
import type { OutputChunk } from "../../../utils/time/types";

defineProps<{
  index: number;
  size: number;
  chunks?: OutputChunk[];
  cardInfo: CardInfo
  cardStats?: CardStats
  playerLogs?: SpaceOutput
  opponentLogs?: SpaceOutput
  timeline: gsap.core.Timeline;
  board?: "deck" | "inventory"
}>()
</script>

<template>
  <div v-if="!cardStats">BUG: Missing card stats for. Returning nothing</div>
  <CardWrapper v-else :index="index" :size="size" :chunks="chunks" :cardInfo="cardInfo" :cardStats="cardStats"
    :timeline="timeline" :playerLogs="playerLogs" :opponentLogs="opponentLogs" :board="board">

    <p>{{ index }}</p>

    <CardCooldown v-if="cardStats.bash?.cooldown && chunks" :timeline="timeline" :chunks="chunks" />

    <!-- <img v-if="cardInfo.image" :src="cardInfo.image.default" alt="Card Image" /> -->
    <CardStatsComponent :bash="cardStats.bash" />
  </CardWrapper>
</template>

<style lang="scss">
.RecordedValue {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;

  background: rgba($color: #000000, $alpha: 0.5);
}

.RecordedValue p {
  background: var(--base-20);
  padding: var(--space-quark);
  border-radius: var(--radius);
}

.CardWrapper img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 0;
}

.CardWrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: var(--radius);
}
</style>
