<script setup lang="ts">
import { useDye } from '../composables/useDye'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false
  }
)

const dye = useDye()
</script>

<template>
  <div
    :ref="(el) => dye.setWrapper(el as HTMLDivElement)"
    class="dyepicker-wrapper"
    :class="{ compact }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.dyepicker-wrapper {
  display: grid;
  grid-template-columns: 1fr 25px;

  height: 400px;
  width: auto;

  max-height: 400px;
  max-width: 400px;

  border-radius: var(--radius);
  overflow: hidden;

  transition: 0.2s ease-in-out;
  .pallet {
    grid-column: span 2;
  }
}

.dyepicker-wrapper.compact {
  --compactSize: 50px;
  max-height: var(--compactSize);
  max-width: var(--compactSize);
}
</style>
