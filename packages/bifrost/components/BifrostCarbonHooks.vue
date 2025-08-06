<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CarbonObject } from '../types'

const props = defineProps<{
  carbon: CarbonObject
  type: string
}>()

const emit = defineEmits({
  hookClick: (index: number) => true
})

const hooks = ref<HTMLDivElement[]>([])
const carbonHooks = computed(() => props.carbon.hooks.filter((hook) => hook.type === props.type))

defineExpose({ hooks })

function storeRef(el: HTMLDivElement, index: number) {
  hooks.value[index] = el
}
</script>

<template>
  <div id="BifrostCarbonEdges">
    <div v-for="hook in carbonHooks" :key="hook.index" :ref="(e: HTMLDivElement) => storeRef(e, hook.index)"
      id="BifrostCarbonHook" @click="emit('hookClick', hook.index)"></div>
  </div>
</template>

<style>
#BifrostCarbonHook {
  height: var(--space-atom);
  aspect-ratio: 1 / 1;
  background: var(--accent-90);
}

#BifrostCarbonHook:hover {
  background: var(--accent-40);
}

#BifrostCarbonEdges {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-1);
  height: 100%;
}
</style>
