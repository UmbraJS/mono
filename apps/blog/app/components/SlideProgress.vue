<script setup lang="ts">
import { Teleport, ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  act: number;
  slide: number;
  totalActs: number;
  slidesInCurrentAct: number;
  // New props for presentation mode
  practiceMode?: boolean;
  targetDateTime?: string; // ISO string format like "2024-10-21T13:20:00"
}

const props = withDefaults(defineProps<Props>(), {
  practiceMode: true,
  targetDateTime: undefined
});

const emit = defineEmits<{
  'update:practiceMode': [value: boolean]
}>();

// Toggle practice mode
const togglePracticeMode = () => {
  emit('update:practiceMode', !props.practiceMode);
};

// Timer state
const startTime = ref<number>(Date.now());
const currentTime = ref<number>(Date.now());
const timerInterval = ref<NodeJS.Timeout | null>(null);

// Practice mode settings
const PRACTICE_PRESENTATION_MS = 30 * 60 * 1000; // 30 minutes total for practice
const ACT_DURATIONS_MS = [
  10 * 60 * 1000, // Act 1: 10 minutes
  10 * 60 * 1000, // Act 2: 10 minutes
  10 * 60 * 1000  // Act 3: 10 minutes
];

// Calculate total presentation time based on mode
const totalPresentationTime = computed(() => {
  if (props.practiceMode) {
    return PRACTICE_PRESENTATION_MS;
  } else if (props.targetDateTime) {
    const targetTime = new Date(props.targetDateTime).getTime();
    const remaining = targetTime - currentTime.value;
    return Math.max(0, remaining); // Don't go negative for total time calculation
  }
  return PRACTICE_PRESENTATION_MS; // Fallback to practice mode
});

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
  const remaining = totalPresentationTime.value - totalElapsedTime.value - futureActsTime;

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
  return totalPresentationTime.value - futureActsTime;
});// Calculate how much time has been used in this act
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

// Format time with different formats based on duration
const formatTime = (milliseconds: number): string => {
  const isNegative = milliseconds < 0;
  const absMilliseconds = Math.abs(milliseconds);
  const totalSeconds = Math.floor(absMilliseconds / 1000);

  // If more than a day, format as "X days X hours X minutes"
  if (totalSeconds >= 86400) { // 24 * 60 * 60 = 86400 seconds in a day
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const timeString = `${days}d ${hours}h ${minutes}m`;
    return isNegative ? `-${timeString}` : timeString;
  }

  // If more than an hour, format as "X:XX:XX"
  if (totalSeconds >= 3600) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return isNegative ? `-${timeString}` : timeString;
  }

  // Less than an hour, format as "MM:SS"
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return isNegative ? `-${timeString}` : timeString;
};

// Formatted time remaining
const formattedTimeRemaining = computed(() => {
  return formatTime(timeRemainingInCurrentAct.value);
});

// Calculate slide progress percentage (0-100)
const slideProgressPercentage = computed(() => {
  return (props.slide / props.slidesInCurrentAct) * 100;
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

// Slide progress bar color - always blue for consistency
const slideProgressBarColor = computed(() => {
  return 'var(--accent-100)'; // Blue for slide progress
});
</script>

<template>
  <div class="slide-progress">
    <!-- Mode indicator -->
    <div class="mode-indicator">
      <span v-if="!practiceMode && targetDateTime" class="target-time">
        Target: {{ new Date(targetDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
      </span>
      <span class="mode-badge" :class="{ 'practice': practiceMode, 'live': !practiceMode }" @click="togglePracticeMode">
        {{ practiceMode ? 'PRACTICE' : 'LIVE' }}
      </span>
    </div>

    <!-- Progress bars -->
    <div class="progress-bars">
      <!-- Time progress bar -->
      <div class="progress-section">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{
            width: `${progressPercentage}%`,
            backgroundColor: progressBarColor
          }" />
        </div>
      </div>

      <!-- Slide progress bar -->
      <div class="progress-section">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{
            width: `${slideProgressPercentage}%`,
            backgroundColor: slideProgressBarColor
          }" />
        </div>
      </div>
    </div>

    <!-- Slide/Act counter -->
    <div class="slide-counter">
      <p>{{ act.toString().padStart(2, '0') }}/{{ totalActs.toString().padStart(2, '0') }}</p>
      <p class="display">
        {{ slide.toString().padStart(2, '0') }}/{{ slidesInCurrentAct.toString().padStart(2, '0') }}
      </p>
      <p class="progress-label">{{ formattedTimeRemaining }}</p>
    </div>
  </div>
</template>

<style scoped>
.slide-progress {
  position: absolute;
  bottom: var(--space-1);
  right: var(--space-1);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);

  background: var(--base);
  border-radius: var(--radius);
  padding: var(--space-2);
}

.slide-counter {
  text-align: right;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-quark);
}

.slide-counter p {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.875rem;
  opacity: 0.2;
  font-variant-numeric: tabular-nums;
}


.slide-counter p:last-child {
  opacity: 1;
}

.progress-bars {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-quark);
}

.progress-section {
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

.progress-label {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.9;
  min-width: 40px;
  text-align: right;
  color: white;
}

.mode-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.mode-badge {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.mode-badge:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.mode-badge.practice {
  background-color: #059669;
  color: white;
}

.mode-badge.live {
  background-color: #dc2626;
  color: white;
  animation: pulse 2s infinite;
}

.target-time {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.625rem;
  opacity: 0.8;
  color: white;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}
</style>
