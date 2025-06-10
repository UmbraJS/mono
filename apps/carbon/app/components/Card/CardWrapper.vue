<script setup lang="ts">
import type { CardInfo, CardStats } from '../../../types'
import CardModal from './CardModal.vue'
import { useBashRecords } from '~/composables/useBashRecords'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'
import { useAudioCue } from '@/composables/useAudioCue'

import type { OutputChunk } from "../../../utils/time/types";

import { useTemplateRef } from 'vue'

import { gsap } from "gsap"
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

const props = defineProps<{
  index: number;
  chunks?: OutputChunk[];
  cardInfo: CardInfo
  cardStats: CardStats
  playerLogs?: SpaceOutput
  opponentLogs?: SpaceOutput
  timeline: gsap.core.Timeline;
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

// Refs and DOM types
const fragElement = useTemplateRef('fragElement')

onMounted(() => {
  if (!fragElement.value) return
  if (typeof window === "undefined") return
  gsap.registerPlugin(Flip, Draggable)
  const zones = document.querySelectorAll('[data-dropzone]')

  new Draggable(fragElement.value, {
    onDrag,
    onRelease,
  })

  interface ZoneHitOptions {
    hit: (zone: Element, el: Draggable) => void,
    mis?: (zone: Element, el: Draggable) => void,
    dud?: (el: Draggable) => void
  }

  function onDrag(this: Draggable) {
    fragElement.value?.classList.add("drag")
    checkZoneHit(this, {
      hit: (zone) => zone.classList.add("drag-hit"),
      mis: (zone) => zone.classList.remove("drag-hit"),
    })
  }

  function onRelease(this: Draggable) {
    fragElement.value?.classList.remove("drag")
    checkZoneHit(this, {
      hit: landHit,
      mis: landMis,
      dud: (el) => gsap.to(el.target, { duration: 0.5, x: 0, y: 0 }),
    })
  }

  function landHit(zone: Element, el: Draggable) {
    zone.classList.remove("drag-hit")
    zone.classList.add("land-hit")

    Flip.fit(el.target, zone, {
      duration: 0.1,
    })
  }

  function landMis(zone: Element) {
    zone.classList.remove("drag-hit")
    zone.classList.remove("land-hit")
  }

  function checkZoneHit(el: Draggable, { hit, mis = () => { }, dud = () => { } }: ZoneHitOptions) {
    const allHitZones = Array.from(zones).filter((zone) => el.hitTest(zone, "50%"));
    const allMissedZones = Array.from(zones).filter((zone) => !el.hitTest(zone, "50%"));
    const noHitsAllMisses = allHitZones.length === 0
    allHitZones.forEach((zone) => hit(zone, el));
    allMissedZones.forEach((zone) => mis(zone, el));
    if (noHitsAllMisses) dud(el);
  }
})

</script>

<template>
  <CardModal :chunks="chunks" :cardStats="cardStats" :cardInfo="cardInfo" :bashRecords="cardBashRecords"
    :timeline="timeline">
    <button ref="fragElement"
      class="carder CardWrapper border base-accent button buttonText buttonHover buttonActive buttonFocus focus"
      @click="triggerFlipSound">

      <slot></slot>

    </button>
  </CardModal>
</template>

<style lang="scss">
button.carder {
  grid-column: span 3;
  transition: 0.0s !important;
}

.CardWrapper {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  position: relative;
  height: 100%;
  width: 100%;
}
</style>
