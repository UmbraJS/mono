<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CarbonObject } from '../../types'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap-trial/InertiaPlugin'
gsap.registerPlugin(InertiaPlugin)
gsap.registerPlugin(Draggable)

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

function storeRef(el: any, index: number) {
  hooks.value[index] = el
}
</script>

<template>
  <div class="edges">
    <div
      v-for="hook in carbonHooks"
      :key="hook.index"
      :ref="(e) => storeRef(e, hook.index)"
      class="hook"
      @click="emit('hookClick', hook.index)"
    ></div>
  </div>
</template>

<style>
#carbon .hook {
  height: var(--space-atom);
  aspect-ratio: 1 / 1;
  background: var(--accent);
}

#carbon .hook:hover {
  background: var(--accent-40);
}

#carbon .edges {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space-1);
  height: 100%;
}
</style>
