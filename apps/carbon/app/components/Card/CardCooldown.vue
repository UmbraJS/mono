<script setup lang="ts">
import type { ReactiveCard } from '../../../types'
import { gsap } from 'gsap'


type SlowedChunkInput = {
  slowedDuration: number;
  slowedTimestamp: number;
};

type GenerateCooldownEventInput = {
  eventTimestamp: number;
  baseDuration: number;
  slowedChunk: SlowedChunkInput[];
};

function generateCooldownEvent({
  eventTimestamp,
  baseDuration,
  slowedChunk,
}: GenerateCooldownEventInput) {
  const basePercentPerSecond = 100 / baseDuration;
  const baseSecondsPerPercent = baseDuration / 100;

  const resultChunks: any[] = [];
  let currentPercent = 100;
  let currentTime = eventTimestamp;

  for (const chunk of slowedChunk) {
    const timeBeforeSlow = chunk.slowedTimestamp - currentTime;
    const percentUsedBefore = timeBeforeSlow / baseSecondsPerPercent;
    currentPercent -= percentUsedBefore;

    resultChunks.push({
      type: "base",
      duration: timeBeforeSlow,
      toPercent: Math.round(currentPercent),
    });

    const slowedPercentPerSecond = 100 / (baseDuration * 2);
    const slowedSecondsPerPercent = (baseDuration * 2) / 100;

    const percentUsedDuringSlow = chunk.slowedDuration / slowedSecondsPerPercent;
    currentPercent -= percentUsedDuringSlow;

    resultChunks.push({
      type: "slow",
      duration: chunk.slowedDuration,
      toPercent: Math.round(currentPercent),
    });

    currentTime = chunk.slowedTimestamp + chunk.slowedDuration;
  }

  const finalDuration = currentPercent * baseSecondsPerPercent;

  resultChunks.push({
    type: "base",
    duration: finalDuration,
    toPercent: 0,
  });

  const totalDuration = currentTime + finalDuration;

  return {
    baseDuration,
    duration: parseFloat((totalDuration - eventTimestamp).toFixed(2)),
    timestamp: [eventTimestamp, parseFloat(totalDuration.toFixed(2))],
    chunks: resultChunks,
  };
}


const props = defineProps<{
  card: ReactiveCard
}>()


const cooldown = ref(100)
const cooldownDuration = ref(0)
const slow = ref(0)

const timeline = gsap.timeline({
  repeat: -1,
})

const baseDuration = 1
const slowedDuration = baseDuration * 2
const hastedDuration = baseDuration / 2
const basePercentPerSecond = 100 / baseDuration
const baseSecondsPerPercent = baseDuration / 100
const slowedPercentPerSecond = 100 / slowedDuration
const slowedSecondsPerPercent = slowedDuration / 100
const hastedPercentPerSecond = 100 / hastedDuration

const cooldownEvents = generateCooldownEvent({
  eventTimestamp: 0.4,
  baseDuration: 10,
  slowedChunk: [{
    slowedDuration: 5,
    slowedTimestamp: 3,
  }]
});

onMounted(() => {
  const timeChunks = cooldownEvents.chunks
  if (!timeChunks) return

  gsap.fromTo(cooldownDuration, {
    value: cooldownEvents.duration,
  }, {
    value: 0,
    duration: cooldownEvents.duration,
    ease: 'none',
    repeat: -1,
  })

  timeChunks.forEach((chunk) => {
    const duration = chunk.duration
    const toPercent = chunk.toPercent

    if (chunk.type === 'base') {
      timeline.to(cooldown, {
        value: toPercent,
        duration: duration,
        ease: 'none',
      })
    } else if (chunk.type === 'slow') {
      console.log('slow', chunk)

      timeline.to(cooldown, {
        value: toPercent,
        duration: duration,
        ease: 'none',
        onStart: () => {
          gsap.from(slow, {
            value: duration,
            duration: duration,
            ease: 'none',
          })
        },
      })
    }
  })
})

// const opacity = computed(() => remapValue(props.card.cooldown.value))
// function remapValue(value: number): number {
//   const start = 98
//   const fadeIn = start - 15
//   if (value >= start) {
//     return 0.0
//   } else if (value >= fadeIn) {
//     return (start - value) / 10
//   } else {
//     return 1.0
//   }
// }
</script>

<template>
  <div class="cooldown" v-if="cooldown > 0" :style="{ height: `${cooldown}%` }" :class="{ slow }">
    <p class="slowp">
      {{ cooldownDuration }}
    </p>
    <p class="slowp n2">
      {{ slow }}
    </p>
  </div>
</template>

<style>
.slowp {
  background-color: var(--base-40);
  padding: var(--space-1);
}

.cooldown.slow .n2 {
  background-color: var(--warning-40);
  color: var(--warning-120);
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
