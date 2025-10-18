<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import type { Character } from '~~/types'
import PartyBoard from './PartyBoard.vue'
import type { ValueLog } from '../../utils/space/types'

const props = defineProps<{
  health: globalThis.Ref<number>;
  shield: globalThis.Ref<number>;
  healthLog: ValueLog[];
  shieldLog: ValueLog[];
  time: number;                 // master time that should scrub the list
  characters: Character[];
}>()

/* ----- your existing bits ----- */
const userStore = useUser()
const userDeck = computed(() => userStore.user.deck)
function getUserCard(index: number) { return userDeck.value[index] }

const healthLogsUpUntilNow = computed(() => {
  // if you want to show both player/opponent logs, merge here; keeping your health logs for now
  return props.healthLog
    .slice() // avoid mutating
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((log) => ({ ...log, card: getUserCard(log.index) }))
})

const healthLogsWithActiveState = computed(() => {
  return healthLogsUpUntilNow.value.map((log) => ({
    ...log,
    isActive: props.time >= log.timestamp
  }))
})

function entryValueLog(log: ValueLog) {
  const isTheSame = log.attemptedChange === log.actualChange
  if (isTheSame) {
    return log.attemptedChange > 0 ? `-${log.attemptedChange}` : `${log.attemptedChange}`
  }
  return log.attemptedChange > 0 ? `-${log.attemptedChange}` : `${log.attemptedChange}`
}

/* ----- GSAP-driven “scroll” ----- */
const viewportRef = ref<HTMLElement | null>(null)  // the .BashLogs container
const listRef = ref<HTMLElement | null>(null)      // an inner list wrapper
const tl = ref<gsap.core.Timeline | null>(null)

// compute the translateY so that we scroll from bottom up (first log at bottom)
function yForIndex(i: number) {
  const vp = viewportRef.value!
  const list = listRef.value!
  const logs = healthLogsUpUntilNow.value

  if (logs.length === 0) return 0

  // For the first log (index 0), position it at the bottom of the viewport
  if (i === 0) {
    const minY = Math.min(0, vp.clientHeight - (list.scrollHeight ?? list.clientHeight))
    return Math.max(minY, vp.clientHeight - (list.children[0] as HTMLElement)?.offsetHeight || 0)
  }

  // For subsequent logs, scroll upward progressively
  const rows = list.children as unknown as HTMLElement[]
  let totalHeight = 0
  
  // Calculate cumulative height up to current index
  for (let j = 0; j <= i; j++) {
    const row = rows[j] as HTMLElement
    if (row) {
      totalHeight += row.offsetHeight
      // Add margin between logs (matching CSS)
      if (j > 0) totalHeight += 8 // var(--space-1) equivalent
    }
  }

  // Position so the accumulated logs fit from bottom up
  const y = vp.clientHeight - totalHeight
  const minY = Math.min(0, vp.clientHeight - (list.scrollHeight ?? list.clientHeight))
  return Math.max(minY, y)
}

function buildTimeline() {
  tl.value?.kill()
  const list = listRef.value!
  const logs = healthLogsUpUntilNow.value
  if (!logs.length) return

  // normalize timestamps to [0,1]
  const t0 = logs[0]?.timestamp || 0
  const t1 = logs[logs.length - 1]?.timestamp || 0
  const total = Math.max(0.0001, t1 - t0)
  const positions = logs.map(l => (l.timestamp - t0) / total)

  const startY = yForIndex(0)
  gsap.set(list, { y: startY, willChange: 'transform' })

  const local = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  positions.forEach((pos, i) => {
    local.to(list, { y: yForIndex(i) }, pos)
  })
  tl.value = local
}

// map props.time to tl.progress()
function syncProgressWithTime() {
  const logs = healthLogsUpUntilNow.value
  if (!tl.value || logs.length === 0) return
  const t0 = logs[0]?.timestamp || 0
  const t1 = logs[logs.length - 1]?.timestamp || 0
  const p = (props.time - t0) / Math.max(0.0001, t1 - t0)
  tl.value.progress(Math.max(0, Math.min(1, p)))
}

onMounted(async () => {
  if (import.meta.server) return
  await nextTick()
  buildTimeline()
  syncProgressWithTime()

  // reflow after async font load
  document.fonts?.ready?.then(() => {
    const p = tl.value?.progress() ?? 0
    buildTimeline()
    tl.value?.progress(p)
  })
})

onBeforeUnmount(() => tl.value?.kill())

watch(() => props.time, () => {
  syncProgressWithTime()
})

watch(healthLogsWithActiveState, async () => {
  await nextTick()
  const p = tl.value?.progress() ?? 0
  buildTimeline()
  tl.value?.progress(p)
})
</script>

<template>
  <PartyBoard>
    <div class="location border" />
    <PlayerCharacter :characters="characters" :health="health" :shield="shield" :reverse="false" />

    <div class="location border">
      <div ref="viewportRef" class="BashLogs">
        <!-- inner wrapper so we only transform this element -->
        <div ref="listRef" class="BashList">
          <div v-for="value in healthLogsWithActiveState" :key="value.timestamp + '-' + value.index" 
               class="BashLog" 
               :class="{ 'active': value.isActive, 'inactive': !value.isActive }">
            <NuxtImg :src="value.card?.info.image?.default" alt="Card Image" width="30" height="30" />
            <p>{{ entryValueLog(value) }}</p>
            <p>{{ value.timestamp }}</p>
          </div>
        </div>
      </div>
    </div>
  </PartyBoard>
</template>

<style scoped>
.BashLogs {
  /* kill native scroll - we’ll animate translateY instead */
  overflow: hidden;
  height: calc(var(--side-size) - var(--space-3));
  position: relative;
  border-radius: var(--radius);
}

.BashList {
  /* important: no margins that would throw off measurements */
  will-change: transform;
}

.BashLog {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  background: var(--base-10);
  padding: var(--space-1);
  border-radius: var(--radius);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Active logs are fully visible */
.BashLog.active {
  opacity: 1;
  transform: scale(1);
}

/* Inactive logs are hidden/dimmed */
.BashLog.inactive {
  opacity: 0.2;
  transform: scale(0.95);
  pointer-events: none;
}

/* optional: fixed gap between logs */
.BashLog+.BashLog {
  margin-top: var(--space-1);
}
</style>
