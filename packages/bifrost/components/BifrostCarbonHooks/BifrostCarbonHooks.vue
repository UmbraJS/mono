<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CarbonObject, HookType } from '../../types'

const props = defineProps<{
  carbon: CarbonObject
  type: HookType
}>()

const emit = defineEmits({
  hookClick: (index: number) => true,
  hookMouseDown: (index: number) => true,
  hookMouseUp: (index: number) => true
})

const hooks = ref<HTMLDivElement[]>([])
const carbonHooks = computed(() => props.carbon.hooks.filter((hook) => hook.type === props.type))

defineExpose({ hooks })

function storeRef(el: any, index: number) {
  if (el && el.tagName === 'DIV') {
    hooks.value[index] = el
  }
}
</script>

<template>
  <div id="BifrostCarbonEdges" :class="type === 'source' || type === 'sink' ? 'vertical' : 'horizontal'">
    <div v-for="hook in carbonHooks" :key="hook.index" :ref="(e: any) => storeRef(e, hook.index)" id="BifrostCarbonHook"
      :class="{ active: hook.active }" @click="emit('hookClick', hook.index)"
      @mousedown="emit('hookMouseDown', hook.index)" @mouseup="emit('hookMouseUp', hook.index)"></div>
  </div>
</template>

<style>
#BifrostCarbonHook {
  height: var(--space-atom);
  aspect-ratio: 1 / 1;
  background: var(--accent-100);
  cursor: pointer;
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

#BifrostCarbonEdges.vertical {
  flex-direction: row;
}

#BifrostCarbonEdges.horizontal {
  flex-direction: column;
}
</style>
