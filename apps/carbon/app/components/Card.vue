<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import type { Card, CardAction, CardBash } from '../../types'
import { gsap } from 'gsap/gsap-core'
import CardModal from './CardModal.vue'

const props = defineProps<{
  card: Card
  index: number
  timeline: gsap.core.Timeline
  time: number
  reverse: boolean
}>()

const emit = defineEmits<{
  (e: 'bash', bashAction: CardAction): void
}>()

const cooldown = ref(100)
const opacity = computed(() => remapValue(cooldown.value))

function remapValue(value: number): number {
  const start = 98
  const fadein = start - 15
  if (value >= start) {
    return 0.0
  } else if (value >= fadein) {
    return (start - value) / 10
  } else {
    return 1.0
  }
}

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

// Start the cooldown animation when the component is mounted
props.timeline.to(
  cooldown,
  {
    value: 0,
    duration: props.card.bash.cooldown,
    repeat: -1,
    onRepeat: () => {
      console.log('Cooldown complete')
      triggerCard()
      animateAction()
    },
  },
  0,
)
</script>

<template>
  <div ref="cardRef">
    <CardModal :card="card">
      <button
        class="card border base-accent button buttonText buttonHover buttonActive buttonFocus focus"
      >
        <div
          class="cooldown"
          v-if="cooldown > 0"
          :style="{ height: `${cooldown}%`, opacity }"
        ></div>
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
.cooldown {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  border-top: solid 2px var(--base-40);
  border-radius: var(--radius);
  pointer-events: none;
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
