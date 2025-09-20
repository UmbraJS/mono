<script setup lang="ts">
import { useDyeContext } from '../composables/useDyeContext'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false
  }
)

const dye = useDyeContext()
</script>

<template>
  <div :ref="(el) => dye.setWrapper(el as HTMLDivElement)" class="DyepickerWrapper" :class="{ compact }">
    <slot />
  </div>
</template>

<style>
.DyepickerWrapper {
  display: grid;
  grid-template-columns: 1fr 25px;

  height: 400px;
  width: auto;

  max-height: 400px;
  max-width: 400px;

  border-radius: var(--radius);
  overflow: hidden;

  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out;

  .DyePallet {
    grid-column: span 2;
  }
}

.DyepickerWrapper.compact {
  --compactSize: 50px;
  max-height: var(--compactSize);
  max-width: var(--compactSize);
}
</style>
