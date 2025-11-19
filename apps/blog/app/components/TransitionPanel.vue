<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  activePanel: 'settings' | 'chat'
  name: 'settings' | 'chat'
}>()

const transitionVariant = ref<'default' | 'reverse'>('default')

watch(
  () => props.activePanel,
  (next, previous) => {
    if (!previous) return
    transitionVariant.value = previous === 'settings' ? 'reverse' : 'default'
  },
)

const direction = computed(() => (props.activePanel === props.name ? 'open' : 'closed'))
</script>

<template>
  <div class="TransitionPanel" :class="[{ showPanel: props.activePanel === props.name }, direction, transitionVariant]">
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

.TransitionPanel.open.reverse {
  animation-name: slideInFromLeft;
}

.TransitionPanel.closed.reverse {
  animation-name: slideOutToRight;
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

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-150%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutToRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(150%);
  }
}
</style>
