<script setup lang="ts">
import type { CardInfo, CardStats } from '../../../types'
import CardModal from './CardModal.vue'
import { useBashRecords } from '~/composables/useBashRecords'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'
import { useAudioCue } from '@/composables/useAudioCue'
import { useStore } from '~/stores/useStore'
import type { OutputChunk } from "../../../utils/time/types";

import { useTemplateRef } from 'vue'

import { gsap } from "gsap"
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

interface ZoneHitOptions {
  hit: (zones: Element[], el: Draggable) => void,
  mis?: (zones: Element[], el: Draggable) => void,
  dud?: (el: Draggable) => void
}

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

const store = useStore()

const {
  moveCardInsideDeck,
  moveCardInsideInventory,
  moveCardFromDeckToInventory,
  moveCardFromInventoryToDeck,
  setHoveredSpace,
} = store.user

function triggerFlipSound() {
  if (recentlyClickedFlipSound.value) return
  recentlyClickedFlipSound.value = true
  audio?.playCardFlip()
  setTimeout(() => {
    recentlyClickedFlipSound.value = false
  }, 200)
}

// Refs and DOM types
const fragElement = useTemplateRef('fragElement')

onMounted(() => {
  const board = props.board
  if (!fragElement.value) return
  if (typeof window === "undefined") return
  if (!board) return

  gsap.registerPlugin(Flip, Draggable)
  const zones = document.querySelectorAll('[data-dropzone]')

  new Draggable(fragElement.value, {
    onDrag,
    onRelease,
  })

  function onDrag(this: Draggable) {
    fragElement.value?.classList.add("dragging")

    checkZoneHit(this, {
      hit: (zones) => {
        zones.forEach((zone) => zone.classList.add("drag-hit"))

        const dropZones = getDropZones(zones);
        const firstZoneAttributes = dropZones[0];
        const lastZoneAttributes = dropZones[zones.length - 1];
        if (!firstZoneAttributes || !lastZoneAttributes) return;
        if (!props.board) return;

        setHoveredSpace({
          size: props.size,
          immigrant: {
            board: firstZoneAttributes.board,
            start: firstZoneAttributes.index,
            end: firstZoneAttributes.index + props.size - 1, // +1 because the end is exclusive
          },
          origin: {
            board: props.board,
            start: props.index,
            end: props.index + props.size - 1, // +1 because the end is exclusive
          },
        })
      },
      mis: (zones) => zones.forEach((zone) => zone.classList.remove("drag-hit")),
    })
  }

  function onRelease(this: Draggable) {
    fragElement.value?.classList.remove("drag")

    setHoveredSpace(null)

    checkZoneHit(this, {
      hit: landHit,
      mis: landMis,
      dud: (el) => gsap.to(el.target, { duration: 0.5, x: 0, y: 0 }),
    })
  }

  function getDropZones(zones: Element[]) {
    return Array.from(zones).map((zone) => {
      const boardAndId = zone.getAttribute("data-dropzone")
      // Board and ID are described like "deck-0" or "inventory-1". I ned to make an object that contains the board and index as separate properties
      if (!boardAndId) return null;
      const [board, index] = boardAndId.split("-");
      if (!board || !index) return null;
      return {
        board: board as "deck" | "inventory",
        index: parseInt(index),
      };
    }).filter(z => z !== null)
  }

  function landHit(zones: Element[], el: Draggable) {
    zones.forEach((zone) => {
      zone.classList.remove("drag-hit")
      zone.classList.add("land-hit")
    })

    const dropZones = getDropZones(zones);

    const firstZone = zones[0];
    const firstZoneAttributes = dropZones[0];
    if (!firstZone || !firstZoneAttributes) return;

    const fromDeck = props.board === "deck"
    const fromInventory = props.board === "inventory"
    const toDeck = firstZoneAttributes.board === "deck"
    const toInventory = firstZoneAttributes.board === "inventory"

    if (fromDeck && toDeck) {
      moveCardInsideDeck({
        index: props.index,
        newIndex: firstZoneAttributes.index,
      })
    } else if (fromInventory && toInventory) {

      moveCardInsideInventory({
        index: props.index,
        newIndex: firstZoneAttributes.index,
      })
    } else if (fromDeck && toInventory) {
      moveCardFromDeckToInventory({
        deckIndex: props.index,
        inventoryIndex: firstZoneAttributes.index,
      })
    } else if (fromInventory && toDeck) {
      moveCardFromInventoryToDeck({
        inventoryIndex: props.index,
        deckIndex: firstZoneAttributes.index
      })
    }

    gsap.to(el.target, { duration: 0, x: 0, y: 0 })

    // Flip.fit(el.target, firstZone, {
    //   duration: 0.1,
    //   fitWidth: false,
    //   fitHeight: false,
    //   onComplete: () => {
    //     store.user.moveCard({
    //       index: props.index,
    //       newIndex: firstZoneIndex - 1, // Adjust for zero-based index
    //     })
    //     gsap.to(el.target, { duration: 0, x: 0, y: 0 })
    //   },
    // })
  }

  function landMis(zones: Element[]) {
    zones.forEach((zone) => {
      zone.classList.remove("drag-hit")
      zone.classList.remove("land-hit")
    })
  }

  function checkZoneHit(el: Draggable, { hit, mis = () => { }, dud = () => { } }: ZoneHitOptions) {
    const allHitZones = Array.from(zones).filter((zone) => el.hitTest(zone, "50%"));
    const allMissedZones = Array.from(zones).filter((zone) => !el.hitTest(zone, "50%"));
    const noHitsAllMisses = allHitZones.length === 0
    hit(allHitZones, el);
    mis(allMissedZones, el);
    if (noHitsAllMisses) dud(el);
  }
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
  grid-column: span v-bind(size);
  grid-column: v-bind(columnStart) / v-bind(columnEnd);
  transition: 0.0s !important;
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
