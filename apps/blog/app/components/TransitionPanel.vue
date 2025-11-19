<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRefHistory } from '@vueuse/core'

const props = defineProps<{
  showPanel: boolean
  name: "settings" | "chat"
}>()

const showPanel = ref(props.showPanel)
const { history } = useRefHistory(showPanel, { capacity: 1 })

watch(() => props.showPanel, (next) => {
  showPanel.value = next
})

const direction = ref<'open' | 'closed'>(props.showPanel ? 'open' : 'closed')

watch(
  history,
  (entries) => {
    if (entries.length <= 1) return
    const previous = entries[1]?.snapshot
    const current = entries[0]?.snapshot
    if (previous === undefined || current === undefined) return
    if (previous === current) return
    direction.value = current ? 'open' : 'closed'
  })
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

  animation-duration: 0.4s;
  animation-timing-function: var(--timing, ease);
  animation-fill-mode: forwards;
}

.TransitionPanel.showPanel {
  pointer-events: auto;
}

.TransitionPanel.open {
  animation-name: slideInFromRight;
}

.TransitionPanel.closed {
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
