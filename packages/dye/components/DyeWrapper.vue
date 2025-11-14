<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDyeContext } from '../composables/useDyeContext'

const { compact = false } = defineProps<{
  compact?: boolean
}>()

const renderPriority = ref(false)

watch(() => compact, () => {
  renderPriority.value = true
  setTimeout(() => {
    renderPriority.value = false
  }, 300)
})

const dye = useDyeContext()
</script>

<template>
  <div :ref="(el) => dye.setWrapper(el as HTMLDivElement)" class="DyepickerWrapper"
    :class="{ compact, renderPriority }">
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

  /* transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out; */
  transition: var(--time-4);

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
