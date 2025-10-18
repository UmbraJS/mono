<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import type { Character } from '~~/types'
import PartyBoard from './PartyBoard.vue'
import type { ValueLog } from '../../utils/space/types'

const props = defineProps<{
  health: number;
  shield: number;
  healthLog: ValueLog[];
  shieldLog: ValueLog[];
  time: globalThis.Ref<number>;                 // master time that should scrub the list
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
    isActive: props.time.value >= log.timestamp
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
const currentLogIndex = ref(-1) // Which log index should be visible

// compute the translateY so that we scroll from bottom up (first log at bottom)
function yForIndex(i: number) {
  const vp = viewportRef.value!
  const list = listRef.value!
  const logs = healthLogsUpUntilNow.value

  if (logs.length === 0 || i < 0) return vp.clientHeight // Off-screen

  const rows = Array.from(list.children) as HTMLElement[]
  let totalHeight = 0

  // Calculate cumulative height up to and including current index
  for (let j = 0; j <= i; j++) {
    const row = rows[j]
    if (row) {
      totalHeight += row.offsetHeight
      // Add margin between logs (8px = var(--space-1))
      if (j > 0) totalHeight += 8
    }
  }

  // Position so the bottom of the i-th log aligns with bottom of viewport
  const targetY = vp.clientHeight - totalHeight

  // Don't scroll past the top of the container
  const minY = Math.min(0, vp.clientHeight - list.scrollHeight)
  return Math.max(minY, targetY)
}

// Find which log should be showing based on current time
function getCurrentLogIndex() {
  const logs = healthLogsUpUntilNow.value
  if (logs.length === 0) return -1

  // Find the last log whose timestamp has passed
  let lastActiveIndex = -1
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i]
    if (log && props.time.value >= log.timestamp) {
      lastActiveIndex = i
    } else {
      break
    }
  }

  return lastActiveIndex
}

// Jump to show the current active log
function jumpToCurrentLog() {
  const list = listRef.value
  const vp = viewportRef.value
  if (!list || !vp) return

  const newIndex = getCurrentLogIndex()

  if (newIndex !== currentLogIndex.value) {
    currentLogIndex.value = newIndex

    if (newIndex >= 0) {
      const targetY = yForIndex(newIndex)
      // Use gsap.set for instant positioning
      gsap.set(list, {
        y: targetY,
        willChange: 'transform'
      })
    } else {
      // No logs active yet, position off-screen
      gsap.set(list, {
        y: vp.clientHeight,
        willChange: 'transform'
      })
    }
  }
}

// Initialize position
function initializePosition() {
  const list = listRef.value
  const vp = viewportRef.value
  if (!list || !vp) return

  // Start with logs positioned below viewport (not visible)
  gsap.set(list, { y: vp.clientHeight, willChange: 'transform' })
  currentLogIndex.value = -1
}

onMounted(async () => {
  if (import.meta.server) return
  await nextTick()
  initializePosition()
  jumpToCurrentLog()

  // reflow after async font load
  document.fonts?.ready?.then(() => {
    initializePosition()
    jumpToCurrentLog()
  })
})

onBeforeUnmount(() => {
  // Clean up any running GSAP animations
  const list = listRef.value
  if (list) {
    gsap.killTweensOf(list)
  }
})

watch(() => props.time.value, () => {
  jumpToCurrentLog()
})

watch(healthLogsWithActiveState, async () => {
  await nextTick()
  initializePosition()
  jumpToCurrentLog()
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
          <div v-for="value in healthLogsWithActiveState" :key="value.timestamp + '-' + value.index" class="BashLog"
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
