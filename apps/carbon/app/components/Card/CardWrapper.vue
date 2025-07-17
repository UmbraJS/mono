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

onMounted(() => {
  if (!fragElement.value) return
  if (typeof window === 'undefined') return
  if (!board) return
  const dataSellzone = document.querySelectorAll('[data-sellzone]')

  gsap.registerPlugin(Draggable)

  function syncBall(fragElement: HTMLButtonElement | null) {
    // Initialize ActionBall position and size to match CardWrapper
    if (!actionBall.value || !fragElement) return
    const cardRect = fragElement.getBoundingClientRect()
    gsap.set(actionBall.value, {
      x: fragElement.offsetLeft,
      y: fragElement.offsetTop,
      width: cardRect.width,
      height: cardRect.height
    })
  }

  function fitBallToSellZone(zone: Element) {
    Flip.fit(actionBall.value, zone, {
      duration: 0.2,
      ease: 'power1.inOut',
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

      const firstHit = hitZone.value

      syncBall(fragElement.value)

      // if (firstHit) {
      //   fitBallToSellZone(firstHit as Element)
      // } else {
      //   syncBall()
      // }

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

      checkZoneHit(this, {
        threshold: '40%',
        zones: dataSellzone,
        hit: () => {
          store.money.sellDraggedCard({
            originBoard: board,
            cardIndex: index,
          })
        },
      })

      syncBall()

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
  <div id="ActionBall" ref="actionBall" :class="{ 'activeBall': hitZone }" />
  <button id="CardWrapper" ref="fragElement" :class="[
    'border base-accent button buttonText buttonHover buttonActive buttonFocus focus',
    variant,
    { 'zoneHit': hitZone }
  ]" @click="triggerFlipSound">


    <slot />

  </button>
</template>

<style lang="scss">
button#CardWrapper {
  position: relative;
  z-index: 99;
}

#ActionBall {
  position: absolute;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  background-color: red;
  pointer-events: none;
  opacity: 0.6;
  transition: opacity var(--time, 0.2s);
}

#ActionBall.activeBall {
  opacity: 0.8;
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
</style>
