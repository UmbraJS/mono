<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  showPanel: boolean
}>()

const direction = ref<'opening' | 'closing'>('opening')

watch(
  () => props.showPanel,
  (next, previous) => {
    if (previous === undefined) return
    if (next === previous) return
    direction.value = next ? 'opening' : 'closing'
    console.log('rex:', { next, previous, class: direction.value })
  },
)
</script>

<template>
  <div class="TransitionPanel" :class="[{ showPanel: props.showPanel }, direction]">
    <slot></slot>
  </div>
</template>

<style>
.TransitionPanel {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease 0.2s, transform 0.4s ease;
}

.TransitionPanel:not(.showPanel) {
  opacity: 0;
  pointer-events: none;
  transform: translateX(calc(150% * var(--panel-direction)));
}

.TransitionPanel:not(.showPanel).opening {
  transform: translateX(150%);
}

.TransitionPanel:not(.showPanel).closing {
  transform: translateX(-150%);
}
</style>
