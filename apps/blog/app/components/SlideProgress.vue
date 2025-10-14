<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  act: number;
  slide: number;
  totalActs: number;
  slidesInCurrentAct: number;
}

const props = defineProps<Props>();

// Timer state
const startTime = ref<number>(Date.now());
const currentTime = ref<number>(Date.now());
const timerInterval = ref<NodeJS.Timeout | null>(null);

// Constants - time allocation per act in milliseconds
const TOTAL_PRESENTATION_MS = 30 * 60 * 1000; // 30 minutes total
const ACT_DURATIONS_MS = [
  10 * 60 * 1000, // Act 1: 10 minutes
  10 * 60 * 1000, // Act 2: 10 minutes
  10 * 60 * 1000  // Act 3: 10 minutes
];

// Initialize timer
onMounted(() => {
  startTime.value = Date.now();
  currentTime.value = Date.now();

  // Start the timer
  timerInterval.value = setInterval(() => {
    currentTime.value = Date.now();
  }, 100); // Update every 100ms for smooth progress bar
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

// Calculate total elapsed time since presentation started
const totalElapsedTime = computed(() => {
  return currentTime.value - startTime.value;
});

// Calculate time remaining for current act
// This is: Total presentation time - elapsed time - time allocated for remaining acts
const timeRemainingInCurrentAct = computed(() => {
  const currentActIndex = props.act - 1;

  // Calculate total time for all remaining acts (after current act)
  const futureActsTime = ACT_DURATIONS_MS
    .slice(currentActIndex + 1)
    .reduce((total, duration) => total + duration, 0);

  // Time remaining = Total time - elapsed time - time needed for future acts
  const remaining = TOTAL_PRESENTATION_MS - totalElapsedTime.value - futureActsTime;

  return remaining; // Allow negative values to show how much over time you are
});

// Calculate how much time this act originally had available (including rollover from previous acts)
const currentActTotalTime = computed(() => {
  const currentActIndex = props.act - 1;

  // Calculate total time for all remaining acts (after current act)
  const futureActsTime = ACT_DURATIONS_MS
    .slice(currentActIndex + 1)
    .reduce((total, duration) => total + duration, 0);

  // This act's total available time = Total presentation time - time needed for future acts
  return TOTAL_PRESENTATION_MS - futureActsTime;
});

// Calculate how much time has been used in this act
const timeUsedInCurrentAct = computed(() => {
  const totalAvailable = currentActTotalTime.value;
  const remaining = timeRemainingInCurrentAct.value;
  return totalAvailable - remaining;
});

// Calculate progress percentage (0-100) for current act
const progressPercentage = computed(() => {
  const totalTime = currentActTotalTime.value;
  const used = timeUsedInCurrentAct.value;

  if (totalTime <= 0) return 100;

  const progress = (used / totalTime) * 100;
  return Math.min(100, Math.max(0, progress));
});

// Format time in MM:SS, handling negative values
const formatTime = (milliseconds: number): string => {
  const isNegative = milliseconds < 0;
  const absMilliseconds = Math.abs(milliseconds);
  const totalSeconds = Math.floor(absMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return isNegative ? `-${timeString}` : timeString;
};

// Formatted time remaining
const formattedTimeRemaining = computed(() => {
  return formatTime(timeRemainingInCurrentAct.value);
});

// Progress bar color based on time remaining
const progressBarColor = computed(() => {
  const remaining = timeRemainingInCurrentAct.value;

  // If we're over time (negative), show red
  if (remaining < 0) return '#ef4444'; // Red for overtime
  const percentage = progressPercentage.value;
  if (percentage < 80) return '#22c55e'; // Green - plenty of time
  return '#f59e0b'; // Orange - running out of time
});
</script>

<template>
  <div class="slide-progress">
    <!-- Slide/Act counter -->
    <div class="slide-counter">
      <p>{{ act }} / {{ totalActs }}</p>
      <p class="display">
        {{ slide }} / {{ slidesInCurrentAct }}
      </p>
    </div>

    <!-- Time progress bar -->
    <div class="time-progress">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{
          width: `${progressPercentage}%`,
          backgroundColor: progressBarColor
        }" />
      </div>
      <p class="time-remaining">{{ formattedTimeRemaining }}</p>
    </div>
  </div>
</template>

<style scoped>
.slide-progress {
  position: absolute;
  bottom: var(--space-7);
  right: var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
}

.slide-counter {
  text-align: right;
}

.slide-counter p {
  margin: 0;
  line-height: 1.2;
}

.slide-counter .display {
  font-size: 0.875rem;
  opacity: 0.8;
}

.time-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.progress-bar-container {
  width: 120px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.1s ease-out, background-color 0.3s ease;
  border-radius: 2px;
}

.time-remaining {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.9;
  min-width: 40px;
  text-align: right;
}
</style>
