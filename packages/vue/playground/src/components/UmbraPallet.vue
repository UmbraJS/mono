<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  color: string
  name: string
  index: number
}>()

const colorId = computed(() => {
  return props.index > 0 ? '-' + (props.index * 10 + 10) : ''
})

const cssVariable = computed(() => {
  return `var(--${props.name}${colorId.value})`
})
</script>

<template>
  <div class="range">
    <div class="pallet">
      <p>{{ colorId }}</p>
    </div>
  </div>
</template>

<style scoped>
.pallet {
  aspect-ratio: 1/1;
  height: 6rem;
  width: 6rem;
  background-color: v-bind(cssVariable);
}

.pallet p {
  color: var(--base-foreground);
}
</style>
