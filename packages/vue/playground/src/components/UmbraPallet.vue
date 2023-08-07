<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  color: string
  name: string
  index: number
}>()

const cssVariable = computed(() => {
  const id = props.index > 0 ? '-' + (props.index * 10 + 10) : ''
  return `--${props.name}${id}`
})
</script>

<template>
  <div class="range">
    <div class="pallet">
      <p>{{ cssVariable }}</p>
    </div>
  </div>
</template>

<style scoped>
.pallet {
  aspect-ratio: 1/1;
  height: 6rem;
  width: 6rem;
  background-color: rgb(71, 8, 18);
}
</style>
