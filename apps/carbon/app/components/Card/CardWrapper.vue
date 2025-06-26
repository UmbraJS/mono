<script setup lang="ts">
import type { CardInfo, CardStats } from '../../../types'
import CardModal from './CardModal.vue'
import { useBashRecords } from '~/composables/useBashRecords'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'
import { useAudioCue } from '@/composables/useAudioCue'
import type { OutputChunk } from "../../../utils/time/types";
import { useCardDrag } from '../../composables/useCardDrag'
import { checkZoneHit } from '../../../utils/cardSwap/zoneHit'

import { useTemplateRef } from 'vue'

import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable";

const props = defineProps<{
  index: number;
  size: number;
  chunks?: OutputChunk[];
  cardInfo: CardInfo
  cardStats: CardStats
  playerLogs?: SpaceOutput
  opponentLogs?: SpaceOutput
  timeline: gsap.core.Timeline;
  board?: "deck" | "inventory"
}>()

const cardBashRecords = useBashRecords({
  playerLogs: props.playerLogs,
  opponentLogs: props.opponentLogs,
  index: props.index,
})

const audio = useAudioCue()

const recentlyClickedFlipSound = ref(false)

function triggerFlipSound() {
  if (recentlyClickedFlipSound.value) return
  recentlyClickedFlipSound.value = true
  audio?.playCardFlip()
  setTimeout(() => {
    recentlyClickedFlipSound.value = false
  }, 200)
}

const fragElement = useTemplateRef('fragElement')
const store = useStore()

onMounted(() => {
  const board = props.board
  if (!fragElement.value) return
  if (typeof window === "undefined") return
  if (!board) return

  gsap.registerPlugin(Draggable)

  const cardDrag = useCardDrag({
    fragElement: fragElement.value,
    board: props.board,
    cardIndex: props.index,
    cardStats: props.cardStats,
    cardSize: props.size,
  })

  new Draggable(fragElement.value, {
    onDrag: function () {
      cardDrag.onDrag(this)
      checkZoneHit(this, {
        threshold: "40%",
        zones: document.querySelectorAll('[data-sellzone]'),
        hit: (zones) => {
          console.log('Card dragged into sell zone')
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
      cardDrag.onRelease(this, props.index)
      checkZoneHit(this, {
        threshold: "40%",
        zones: document.querySelectorAll('[data-sellzone]'),
        hit: () => {
          console.log('Card dropped in sell zone')
          store.money.sellDraggedCard()
        },
      })
    },
  })
})

const columnStart = computed(() => {
  return props.index + 1
})

const columnEnd = computed(() => {
  return props.index + 1 + props.size
})
</script>
<template>
  <CardModal :chunks="chunks" :cardStats="cardStats" :cardInfo="cardInfo" :bashRecords="cardBashRecords"
    :timeline="timeline">
    <button ref="fragElement" id="CardWrapper"
      class="border base-accent button buttonText buttonHover buttonActive buttonFocus focus" @click="triggerFlipSound">

      <slot></slot>

    </button>
  </CardModal>
</template>

<style lang="scss">
button#CardWrapper {
  position: relative;
  z-index: 99;
  grid-column: span v-bind(size);
  grid-column: v-bind(columnStart) / v-bind(columnEnd);
  transition: 0.0s !important;
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
  display: flex;
  justify-content: center;
  align-items: flex-end;

  position: relative;
  height: 100%;
  width: 100%;
}
</style>
