<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import type { Card, CardAction, CardBash } from '../../../types'
import { gsap } from 'gsap/gsap-core'
import CardModal from './CardModal.vue'
import CardCooldown from './CardCooldown.vue'
import CardStats from './CardStats.vue'
import type { UsePlayerReturn } from '../../composables/usePlayer'
import { useBashRecords } from '~/composables/useBashRecords'

const props = defineProps<{
  card: Card
  index: number
  timeline: gsap.core.Timeline
  time: number
  reverse: boolean
  delay: number
  opponent: UsePlayerReturn
  player: UsePlayerReturn
}>()

const emit = defineEmits<{
  (e: 'bash', bashAction: CardAction): void
}>()

function getAction(bash: CardBash): CardAction {
  return {
    bash: bash,
    index: props.index,
    timestamp: props.time,
    card: props.card,
  }
}

const triggerCard = () => {
  const bash = props.card.bash
  emit('bash', getAction(bash))
}

const cardRef = templateRef<HTMLDivElement>('cardRef')

function animateAction() {
  if (!cardRef.value) return
  gsap.to(cardRef.value, {
    scale: 1,
    y: props.reverse ? -60 : 60,
    duration: 0.01,
    ease: 'power1.inOut',
    onComplete: () => {
      gsap.to(cardRef.value, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: 'power1.inOut',
      })
    },
  })
}

function onBash() {
  triggerCard()
  animateAction()
}

const cardBashRecords = useBashRecords({
  player: props.player,
  opponent: props.opponent,
  index: props.index,
})
</script>

<template>
  <div ref="cardRef">
    <CardModal :card="card" :opponent="opponent" :player="player" :index="index" :bash-records="cardBashRecords"
      :timeline="timeline" :delay="delay">
      <button class="card border base-accent button buttonText buttonHover buttonActive buttonFocus focus">
        <CardCooldown v-if="card.bash.cooldown" :card="card" :timeline="props.timeline" :delay="props.delay"
          @bash="onBash" />
        <div class="RecordedValue">
          <p class="border"> {{ cardBashRecords.totalValue.value }}</p>
        </div>
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
