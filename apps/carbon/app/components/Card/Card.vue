<script setup lang="ts">
import type { SimCard } from '../../../types'
import CardModal from './CardModal.vue'
import CardCooldown from './CardCooldown.vue'
import CardStats from './CardStats.vue'
import type { UsePlayerReturn } from '../../composables/usePlayer'
import { useBashRecords } from '~/composables/useBashRecords'
import type { ChainedCooldownEvent } from '../../../utils/generateChainedCooldownEvents'
// import type { SimCard } from '../../../utils/simulateCards'

const props = defineProps<{
  card: SimCard
  opponent: UsePlayerReturn
  player: UsePlayerReturn
  time: number
  timeline: gsap.core.Timeline;
}>()

const cardBashRecords = useBashRecords({
  player: props.player,
  opponent: props.opponent,
  index: props.card.index,
})
</script>

<template>
  <div>
    <CardModal :card="card" :opponent="opponent" :player="player" :bash-records="cardBashRecords" :time="time"
      :timeline="timeline" :cooldownEvents="card.cooldownEvents">
      <button class="card border base-accent button buttonText buttonHover buttonActive buttonFocus focus">
        <CardCooldown v-if="card.bash.cooldown" :card="card" :time="time" :timeline="timeline"
          :cooldownEvents="card.cooldownEvents" />
        <!-- <div class="RecordedValue">
          <p class="border"> {{ cardBashRecords.totalValue.value }}</p>
          <p class="border base-warning"> {{ Number(card.slow.value.toFixed(1)) }}</p>
          <p class="border base-success"> {{ Number(card.haste.value.toFixed(1)) }}</p>
        </div> -->
        <img v-if="card.image" :src="card.image.default" alt="Card Image" />
        <CardStats :card="card" />
      </button>
    </CardModal>
  </div>
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
