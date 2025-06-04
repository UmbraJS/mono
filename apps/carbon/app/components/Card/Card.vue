<script setup lang="ts">
import type { SimCard } from '../../../types'
import CardModal from './CardModal.vue'
import CardCooldown from './CardCooldown.vue'
import CardStatsComponent from './CardStats.vue'
import { useBashRecords } from '~/composables/useBashRecords'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'

const props = defineProps<{
  card: SimCard
  playerLogs: SpaceOutput
  opponentLogs: SpaceOutput
  time: number
  timeline: gsap.core.Timeline;
}>()

const cardBashRecords = useBashRecords({
  playerLogs: props.playerLogs,
  opponentLogs: props.opponentLogs,
  index: props.card.card.index,
})
</script>

<template>
  <div class="carder">
    <CardModal :card="card" :cardStats="card.cardStats" :cardInfo="card.card.info" :bash-records="cardBashRecords"
      :time="time" :timeline="timeline" :cooldownEvents="card.simulation.chunks">
      <button class="card border base-accent button buttonText buttonHover buttonActive buttonFocus focus">
        <CardCooldown v-if="card.cardStats.bash?.cooldown" :time="time" :timeline="timeline" :card="card" />
        <!-- <div class="RecordedValue">
          <p class="border"> {{ cardBashRecords.totalValue.value }}</p>
          <p class="border base-warning"> {{ Number(card.slow.value.toFixed(1)) }}</p>
          <p class="border base-success"> {{ Number(card.haste.value.toFixed(1)) }}</p>
        </div> -->
        <img v-if="card.card.info.image" :src="card.card.info.image.default" alt="Card Image" />
        <CardStatsComponent :bash="card.cardStats.bash" />
      </button>
    </CardModal>
  </div>
</template>

<style lang="scss">
.carder {
  grid-column: span 3;
}

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

.card {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  position: relative;
  height: 100%;
  width: 100%;
}

.card img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 0;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: var(--radius);
}
</style>
