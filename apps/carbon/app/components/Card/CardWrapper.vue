<script setup lang="ts">
import type { CardStats } from '../../../types'
import { useStore } from '~/stores/useStore'
import { useCardDrag } from '../../composables/useCardDrag'
import { checkZoneHit } from '../../../utils/cardSwap/zoneHit'

import { useTemplateRef } from 'vue'

import { Draggable } from 'gsap/Draggable';
import { useAudio } from '../../stores/useAudio'

import { Flip } from 'gsap/Flip'
import { gsap } from 'gsap'
gsap.registerPlugin(Flip)

const {
  board,
  index,
  size,
  cardStats,
  variant = 'default',
} = defineProps<{
  index: number;
  size: number;
  cardStats: CardStats
  board?: 'deck' | 'inventory'
  noPlacement?: boolean
  variant?: 'default' | 'freeSize' | 'cardSize'
}>()

const audio = useAudio()

const recentlyClickedFlipSound = ref(false)

function triggerFlipSound() {
  if (recentlyClickedFlipSound.value) return
  recentlyClickedFlipSound.value = true
  audio.playCardFlip()
  setTimeout(() => {
    recentlyClickedFlipSound.value = false
  }, 200)
}

const fragElement = useTemplateRef('fragElement')
const actionBall = useTemplateRef('actionBall')
const store = useStore()

const hitZone = ref<Element | null>(null)
const dragging = ref(false)

onMounted(() => {
  if (!fragElement.value) return
  if (typeof window === 'undefined') return
  if (!board) return
  const dataSellzone = document.querySelectorAll('[data-sellzone]')

  gsap.registerPlugin(Draggable)

  function syncBall(fragElement: HTMLButtonElement | null) {
    if (!actionBall.value || !fragElement) return
    Flip.fit(actionBall.value, fragElement, {
      duration: 0.2,
    })
  }

  function fitBallToSellZone(zone: Element) {
    Flip.fit(actionBall.value, zone, {
      duration: 0.2,
    })
  }

  syncBall(fragElement.value)

  const cardDrag = useCardDrag({
    fragElement: fragElement.value,
    board: board,
    cardIndex: index,
    cardStats: cardStats,
    cardSize: size,
  })

  new Draggable(fragElement.value, {
    onDrag: function () {
      cardDrag.onDrag(this)
      dragging.value = true

      if (hitZone.value) {
        fitBallToSellZone(hitZone.value as Element)
      } else {
        syncBall(fragElement.value)
      }

      checkZoneHit(this, {
        threshold: '40%',
        zones: dataSellzone,
        hit: (zones) => {
          const firstHit = zones[0]
          if (!firstHit) return

          zones.forEach((zone) => {
            zone.classList.add('active-zone')
          })

          hitZone.value = firstHit
        },
        mis: (zones) => {
          zones.forEach((zone) => {
            zone.classList.remove('active-zone')
          })
        },
        dud: () => {
          if (!fragElement.value) return
          hitZone.value = null
        },
      })
    },
    onRelease: function () {
      cardDrag.onRelease(this, index)
      dragging.value = false

      checkZoneHit(this, {
        threshold: '40%',
        zones: dataSellzone,
        hit: () => {
          audio.playCoinSound()
          store.money.sellDraggedCard({
            originBoard: board,
            cardIndex: index,
          })
        },
      })

      setTimeout(() => {
        syncBall(fragElement.value)
      }, 0)
    },
  })
})

const columnStart = computed(() => {
  return index + 1
})

const columnEnd = computed(() => {
  return index + 1 + size
})
</script>
<template>
  <div id="ActionBallWrapper" ref="actionBall" :class="{ 'activeBall': hitZone, 'dragging': dragging }">
    <div id="ActionBall" class="base-accent">
      <h1>Please God! Don't sell me!</h1>
    </div>
  </div>

  <button id="CardWrapper" ref="fragElement" :class="[
    'border base-accent button buttonText buttonHover buttonActive buttonFocus focus',
    variant,
    { 'zoneHit': hitZone, 'dragging': dragging, 'accent-warning': hitZone }
  ]" @click="triggerFlipSound">


    <slot />

  </button>
</template>

<style lang="scss">
button#CardWrapper {
  position: relative;
  z-index: 100;
}

#ActionBallWrapper {
  display: grid;
  gap: var(--space-1);

  position: absolute;
  z-index: 99;
  pointer-events: none;
  transition: gap var(--time, 0.2s);
  ;
}

#ActionBall {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;
  border-radius: var(--radius);
  background-color: var(--base);
  opacity: 0;
  transition: opacity var(--time, 0.2s), width var(--time, 0.2s), height var(--time, 0.2s);
}

#ActionBallWrapper.dragging #ActionBall {
  opacity: 1;
  border-radius: var(--radius);
}

#ActionBallWrapper.activeBall #ActionBall {
  animation: shakeExponential 3s ease-in forwards
}

#ActionBallWrapper #ActionBall>* {
  opacity: 0;
}

#ActionBallWrapper.activeBall #ActionBall>* {
  opacity: 1;
}

#ActionBallWrapper.activeBall {
  gap: 0;
}

button#CardWrapper.default {
  grid-column: v-bind(columnStart) / v-bind(columnEnd);
}

button#CardWrapper.cardSize {
  height: var(--cardWindowHeight);
  width: var(--cardWindowWidth);
}

button#CardWrapper.freeSize {
  height: 150px;
  width: calc(v-bind(size) * 70px);
}

button#CardWrapper.active-zone {
  border-width: 40px;
}

button#CardWrapper.swap-board {
  transform: translateY(var(--space-3)) !important;
}

button#CardWrapper.shift-left {
  --shift: calc(0px - var(--space-3));
  transform: translateX(var(--shift)) !important;
  position: relative;
  z-index: 1000;
}

button#CardWrapper.shift-right {
  transform: translateX(var(--space-3)) !important;
  position: relative;
  z-index: 1000;
}

button#CardWrapper.rejected {
  opacity: 0.5 !important;
  pointer-events: none !important;
}

#CardWrapper {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "top"
    "middle"
    "bottom";

  position: relative;
  height: 100%;
  width: 100%;
  transition: opacity var(--slower), filter var(--slower);
}

#CardWrapper.dragging {
  transition: none;
}

.MatchBoard:has(#CardWrapper.dragging) #CardWrapper:not(.dragging) {
  opacity: 0.8;
  filter: blur(4px);
}

@keyframes shakeExponential {
  0% {
    background-color: var(--accent);
    transform: translateX(0);
  }

  2.5% {
    transform: translateX(-0.5px);
  }

  5% {
    transform: translateX(0.5px);
  }

  7.5% {
    transform: translateX(-1px);
  }

  10% {
    transform: translateX(1px);
  }

  12.5% {
    transform: translateX(-1.5px);
  }

  15% {
    transform: translateX(1.5px);
  }

  17.5% {
    transform: translateX(-2px);
  }

  20% {
    transform: translateX(2px);
  }

  22.5% {
    transform: translateX(-3px);
  }

  25% {
    transform: translateX(3px);
  }

  27.5% {
    transform: translateX(-4px);
  }

  30% {
    transform: translateX(4px);
  }

  32.5% {
    transform: translateX(-5px);
  }

  35% {
    background-color: var(--accent);
    transform: translateX(5px);
  }

  37.5% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  42.5% {
    transform: translateX(-7px);
  }

  45% {
    transform: translateX(7px);
  }

  47.5% {
    transform: translateX(-8px);
  }

  50% {
    transform: translateX(8px);
  }

  52.5% {
    transform: translateX(-9px);
  }

  55% {
    transform: translateX(9px);
  }

  57.5% {
    transform: translateX(-10px);
  }

  60% {
    background-color: var(--warning);
    transform: translateX(10px);
  }

  62.5% {
    transform: translateX(-11px);
  }

  65% {
    transform: translateX(11px);
  }

  67.5% {
    transform: translateX(-12px);
  }

  70% {
    transform: translateX(12px);
  }

  72.5% {
    transform: translateX(-13px);
  }

  75% {
    transform: translateX(13px);
  }

  77.5% {
    transform: translateX(-14px);
  }

  80% {
    transform: translateX(14px);
  }

  82.5% {
    transform: translateX(-15px);
  }

  85% {
    transform: translateX(15px);
  }

  87.5% {
    transform: translateX(-16px);
  }

  90% {
    transform: translateX(16px);
  }

  92.5% {
    transform: translateX(-17px);
  }

  95% {
    transform: translateX(17px);
  }

  97.5% {
    transform: translateX(-18px) scale(1.1);
  }

  100% {
    background-color: var(--warning);
    transform: translateX(0) scale(1.2);
  }
}
</style>
