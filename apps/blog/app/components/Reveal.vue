<script setup lang="ts">
import { Spinner } from 'umbraco'

export interface RevealProps {
  /** When true, shows loading overlay. When false, reveals content */
  loading?: boolean
  /** Size of the loading spinner */
  spinnerSize?: string | number
  /** Spinner variant */
  spinnerVariant?: 'primary' | 'secondary'
}

const {
  loading = false,
  spinnerSize = '4em',
  spinnerVariant = 'primary',
} = defineProps<RevealProps>()
</script>

<template>
  <div class="Reveal" :class="{ loading: loading }">
    <!-- Loading overlay with slide-out animation -->
    <div class="RevealOverlay">
      <Spinner :size="spinnerSize" :variant="spinnerVariant" />
    </div>

    <!-- Content -->
    <div class="RevealContent">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.Reveal {
  position: relative;
  width: 100%;
  height: 100%;
}

.RevealContent {
  width: 100%;
}

.RevealOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base);
  z-index: 1000;
  clip-path: inset(0 0 100% 0);
  transition: clip-path var(--time-6) cubic-bezier(0.65, 0, 0.35, 1);
  will-change: clip-path;
  pointer-events: none;
  max-height: 100vh;
}

.Reveal.loading .RevealOverlay {
  clip-path: inset(0 0 0 0);
  pointer-events: auto;
}
</style>
