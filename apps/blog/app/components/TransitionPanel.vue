<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRefHistory } from '@vueuse/core'

const props = defineProps<{
  showPanel: boolean
}>()

const showPanel = ref(props.showPanel)
const { history } = useRefHistory(showPanel, { capacity: 2 })

watch(() => props.showPanel, (next) => {
  showPanel.value = next
})

const direction = ref<'opening' | 'closing'>('opening')

watch(
  history,
  (entries) => {
    if (entries.length < 2) return
    const previous = entries[entries.length - 2]?.snapshot
    const current = entries[entries.length - 1]?.snapshot
    if (previous === undefined || current === undefined) return
    if (previous === current) return
    direction.value = current ? 'opening' : 'closing'
  },
  { deep: true },
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
  opacity: 0;
  pointer-events: none;
}

.TransitionPanel.showPanel {
  pointer-events: auto;
}

.TransitionPanel.opening,
.TransitionPanel.closing {
  animation-duration: 0.4s;
  animation-timing-function: var(--timing, ease);
  animation-fill-mode: forwards;
}

.TransitionPanel.opening {
  animation-name: slideInFromRight;
}

.TransitionPanel.closing {
  animation-name: slideOutToLeft;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(150%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}


@keyframes slideOutToLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(-150%);
  }
}
</style>
