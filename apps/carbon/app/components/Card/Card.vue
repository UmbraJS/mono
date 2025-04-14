<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import type { Card, CardAction, CardBash } from '../../../types'
import { gsap } from 'gsap/gsap-core'
import CardModal from './CardModal.vue'
import CardCooldown from './CardCooldown.vue'

const props = defineProps<{
  card: Card
  index: number
  timeline: gsap.core.Timeline
  time: number
  reverse: boolean
  delay: number
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
</script>

<template>
  <div ref="cardRef">
    <CardModal :card="card">
      <button
        class="card border base-accent button buttonText buttonHover buttonActive buttonFocus focus"
      >
        <CardCooldown
          v-if="card.bash.cooldown"
          :card="card"
          :timeline="props.timeline"
          :delay="props.delay"
          @bash="
            () => {
              console.log('Cooldown complete')
              triggerCard()
              animateAction()
            }
          "
        />
        <img v-if="card.image" :src="card.image.default" alt="Card Image" />
        <div class="stats">
          <div
            v-if="card.bash.attack"
            class="chip base-warning button buttonText buttonHover buttonActive buttonFocus focus"
          >
            {{ card.bash.attack }}
          </div>
          <div
            v-if="card.bash.heal"
            class="chip base-success button buttonText buttonHover buttonActive buttonFocus focus"
          >
            {{ card.bash.heal }}
          </div>
          <div
            v-if="card.bash.shield"
            class="chip base-info button buttonText buttonHover buttonActive buttonFocus focus"
          >
            {{ card.bash.shield }}
          </div>
          <div
            v-if="card.bash.banter"
            class="chip base-yellow button buttonText buttonHover buttonActive buttonFocus focus"
          >
            {{ card.bash.banter }}
          </div>
        </div>
      </button>
    </CardModal>
  </div>
</template>

<style lang="scss">
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

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  position: relative;
  width: 100%;
  z-index: 1;
}

.stats .chip {
  border-radius: 0;
  cursor: pointer;
  padding: 0px;
  min-width: max-content;
}

.stats .chip:first-child {
  border-bottom-left-radius: var(--radius);
}

/* if there are less than 5 chips children inside .stats give the last chip boder radius */
.stats:not(:has(.chip:nth-child(4n))) .chip:last-child {
  border-top-right-radius: var(--radius);
}

.stats:has(.chip:nth-child(4n)) .chip:last-child {
  border-bottom-right-radius: var(--radius);
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: var(--radius);
}
</style>
