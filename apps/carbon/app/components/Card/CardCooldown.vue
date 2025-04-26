<script setup lang="ts">
import type { ReactiveCard } from '../../../types'
import { gsap } from 'gsap'
import { generateChainedCooldownEvents } from '../../../utils/generateChainedCooldownEvents'
import type { ChainedCooldownEvent } from '../../../utils/generateChainedCooldownEvents'

const props = defineProps<{
  card: ReactiveCard
}>()

const cooldown = ref(100)
const cooldownDuration = ref(0)
const slow = ref(0)
const slowSource = ref<string>("slow")
const haste = ref(0)
const hasteSource = ref<string>("haste")
const frozen = ref(0)
const frozenSource = ref<string>("freeze")

const timeline = gsap.timeline()

const cooldownEvents = generateChainedCooldownEvents({
  baseDuration: 10, // each cooldown lasts 10 seconds before modifiers
  events: [
    [
      { type: "slow", duration: 2, timestamp: 0, source: "debuff-a" },
      { type: "slow", duration: 2, timestamp: 1, source: "debuff-B" },
      // { type: "haste", duration: 2, timestamp: 4, source: "buff-a" },
      // { type: "freeze", duration: 2, timestamp: 5, source: "debuff-c" },
      // { type: "haste", duration: 6, timestamp: 8, source: "buff-b" },
    ],
    // [{ type: "freeze", duration: 2, timestamp: 13, source: "stun-a" }],
    // [{ type: "haste", duration: 5, timestamp: 26, source: "buff-b" }]
  ]
});

onMounted(() => {
  cooldownEvents.forEach((event) => {
    animateCooldown(event)
  })
})

function animateCooldown(event: ChainedCooldownEvent) {
  const timeChunks = event.chunks

  const cooldownTimeline = gsap.timeline()
  const durationTimeline = gsap.timeline()
  const chunkTimeline = gsap.timeline()

  cooldownTimeline.add(chunkTimeline, 0)
  cooldownTimeline.add(durationTimeline, 0)
  timeline.add(cooldownTimeline)

  durationTimeline.fromTo(cooldownDuration, {
    value: event.duration,
  }, {
    value: 0,
    duration: event.duration,
    ease: 'none',
    onComplete: () => {
      cooldown.value = 100
    },
  }, 0)

  timeChunks.forEach((chunk) => {
    const duration = chunk.duration
    const toPercent = chunk.toPercent

    const animationProps = {
      toPercent,
      duration,
      source: chunk.source,
    }

    if (chunk.type === 'base') {
      gsapBase(animationProps)
    } else if (chunk.type === 'slow') {
      gsapSlow(animationProps)
    } else if (chunk.type === 'haste') {
      gsapHaste(animationProps)
    } else if (chunk.type === "freeze") {
      gsapFreeze(animationProps)
    }
  })

  interface AnimationProp {
    toPercent: number
    duration: number
    source: string | null
  }

  function gsapBase({
    toPercent,
    duration,
  }: AnimationProp) {
    chunkTimeline.to(cooldown, {
      value: toPercent,
      duration: duration,
      ease: 'none',
    })
  }

  function gsapSlow({
    toPercent,
    duration,
    source,
  }: AnimationProp) {
    chunkTimeline.to(cooldown, {
      value: toPercent,
      duration: duration,
      ease: 'none',
      onStart: () => {
        gsap.fromTo(slow, {
          value: duration,
        }, {
          value: 0,
          duration: duration,
          ease: 'none',
          onStart: () => {
            slowSource.value = source || "slow"
          },
          onComplete: () => {
            slowSource.value = "slow"
          },
        })
      },
    })
  }

  function gsapHaste({
    toPercent,
    duration,
    source,
  }: AnimationProp) {
    chunkTimeline.to(cooldown, {
      value: toPercent,
      duration: duration,
      ease: 'none',
      onStart: () => {
        gsap.fromTo(haste, {
          value: duration,
        }, {
          value: 0,
          duration: duration,
          ease: 'none',
          onStart: () => {
            hasteSource.value = source || "haste"
          },
          onComplete: () => {
            hasteSource.value = "haste"
          },
        })
      },
    })
  }

  function gsapFreeze({
    toPercent,
    duration,
    source,
  }: AnimationProp) {
    chunkTimeline.to(cooldown, {
      value: toPercent,
      duration: duration,
      ease: 'none',
      onStart: () => {
        gsap.fromTo(frozen, {
          value: duration,
        }, {
          value: 0,
          duration: duration,
          ease: 'none',
          onStart: () => {
            frozenSource.value = source || "freeze"
          },
          onComplete: () => {
            frozenSource.value = "freeze"
          },
        })
      },
    })
  }
}
</script>

<template>
  <div class="cooldown" v-if="cooldown > 0" :style="{ height: `${cooldown}%` }" :class="{ slow, haste, frozen }">
    <div class="slowp">
      <p>{{ cooldownDuration }}</p>
      <p>{{ Math.floor(cooldown) }}</p>
    </div>
    <div class="slowp n2">
      <p>{{ slow }}</p>
      <p>{{ slowSource }}</p>
    </div>
    <div class="slowp n3">
      <p>{{ haste }}</p>
      <p>{{ hasteSource }}</p>
    </div>
    <div class="slowp n4">
      <p>{{ frozen }}</p>
      <p>{{ frozenSource }}</p>
    </div>
  </div>
</template>

<style>
.slowp {
  display: flex;
  justify-content: space-between;
  background-color: var(--base-40);
  padding: var(--space-1);
}

.cooldown.slow .n2 {
  background-color: var(--warning-40);
  color: var(--warning-120);
}

.cooldown.haste .n3 {
  background-color: var(--success-40);
  color: var(--success-120);
}

.cooldown.frozen .n4 {
  background-color: var(--info-40);
  color: var(--info-120);
}

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
</style>
