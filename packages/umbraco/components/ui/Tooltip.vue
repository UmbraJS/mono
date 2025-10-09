<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

defineProps<{
  text: string
  className?: string
}>()

</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger asChild>
        <slot></slot>
      </TooltipTrigger>
      <TooltipPortal class="lol">
        <TooltipContent class="TooltipContent border" :class="className" :side-offset="5">
          <p>{{ text }}</p>
          <TooltipArrow class="TooltipArrow" :width="8" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style>
html body [data-reka-popper-content-wrapper] {
  z-index: 1 !important;
}

.TooltipContent {
  border-radius: var(--radius);
  padding: var(--space-1);
  background-color: var(--base-10);
  user-select: none;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.TooltipContent p {
  color: var(--base-120);
}

.TooltipContent[data-state='delayed-open'][data-side='top'] {
  animation-name: slideDownAndFade;
}

.TooltipContent[data-state='delayed-open'][data-side='right'] {
  animation-name: slideLeftAndFade;
}

.TooltipContent[data-state='delayed-open'][data-side='bottom'] {
  animation-name: slideUpAndFade;
}

.TooltipContent[data-state='delayed-open'][data-side='left'] {
  animation-name: slideRightAndFade;
}

.TooltipArrow {
  fill: var(--base-60)
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
