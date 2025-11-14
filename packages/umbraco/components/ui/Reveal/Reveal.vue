<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import Spinner from '../Spinner/Spinner.vue'

export interface RevealProps {
  /** When true, shows loading overlay. When false, reveals content */
  loading?: boolean
  /** Size of the loading spinner */
  spinnerSize?: string | number
  /** Spinner variant */
  spinnerVariant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<RevealProps>(), {
  loading: false,
  spinnerSize: '4em',
  spinnerVariant: 'primary',
})

const isRevealing = ref(false)
const showOverlay = ref(props.loading)
const contentRef = ref<HTMLElement | null>(null)

// Watch for loading changes and trigger reveal animation
watch(() => props.loading, async (newLoading) => {
  if (!newLoading && showOverlay.value) {
    // Start reveal animation
    await nextTick()
    isRevealing.value = true

    // After animation completes, remove overlay
    setTimeout(() => {
      showOverlay.value = false
      isRevealing.value = false
    }, 600) // Match animation duration
  } else if (newLoading && !showOverlay.value) {
    // Reset to loading state
    showOverlay.value = true
    isRevealing.value = false
  }
}, { immediate: true })
</script>

<template>
  <div class="Reveal">
    <!-- Loading overlay with slide-out animation -->
    <div v-if="showOverlay" class="RevealOverlay" :class="{ revealing: isRevealing }">
      <Spinner :size="spinnerSize" :variant="spinnerVariant" />
    </div>

    <!-- Content (always rendered) -->
    <div ref="contentRef" class="RevealContent">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.Reveal {
  position: relative;
  width: 100%;
}

.RevealContent {
  width: 100%;
}

.RevealOverlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base);
  z-index: 1000;
  clip-path: inset(0 0 0 0);
  transition: clip-path var(--time-6) cubic-bezier(0.65, 0, 0.35, 1);
  will-change: clip-path;
}

.RevealOverlay.revealing {
  clip-path: inset(0 0 100% 0);
}
</style>
