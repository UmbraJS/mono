<script setup lang="ts">
import type { CardStats } from '../../../types'
import { useStore } from '~/stores/useStore'
import { useCardDrag } from '../../composables/useCardDrag'
import { checkZoneHit } from '../../../utils/cardSwap/zoneHit'

import { useTemplateRef } from 'vue'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable';
import { useAudio } from '../../stores/useAudio'

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
const store = useStore()

onMounted(() => {
  if (!fragElement.value) return
  if (typeof window === 'undefined') return
  if (!board) return
  const dataSellzone = document.querySelectorAll('[data-sellzone]')

  gsap.registerPlugin(Draggable)

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
      checkZoneHit(this, {
        threshold: '40%',
        zones: dataSellzone,
        hit: (zones) => {
          if (!fragElement.value) return
          fragElement.value.classList.add('active-zone')
          zones.forEach((zone) => {
            zone.classList.add('active-zone')
          })
        },
        mis: (zones) => {
          if (!fragElement.value) return
          fragElement.value.classList.remove('active-zone')
          zones.forEach((zone) => {
            zone.classList.remove('active-zone')
          })
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
  <button id="CardWrapper" ref="fragElement"
    class="border base-accent button buttonText buttonHover buttonActive buttonFocus focus" :class="variant"
    @click="triggerFlipSound">

    <slot />

  </button>
</template>

<style lang="scss">
button#CardWrapper {
  position: relative;
  z-index: 99;
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

/* button.dragging {
  position: absolute;
  z-index: 50;
} */

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
}
</style>
