<script setup lang="ts">
import { computed } from 'vue'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { Icon } from '@iconify/vue'
import Button from '../Button/Button.vue'

const props = defineProps<{
  variant: 'warning' | 'base' | 'success' | 'accent'
}>()

const color = computed(() => {
  switch (props.variant) {
    case 'warning':
      return 'base-warning'
    case 'success':
      return 'base-success'
    case 'accent':
      return 'base-accent'
    default:
      return undefined
  }
})
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="DialogOverlay" />
    <DialogContent class="DialogContent border" :class="color">
      <DialogClose class="DialogIconButton" aria-label="Close">
        <Button size="medium">
          <Icon icon="pixelarticons:close" />
        </Button>
      </DialogClose>
      <slot>
        <h1>Dialog content</h1>
        <p>Put the dialog content here</p>
      </slot>
    </DialogContent>
  </DialogPortal>
</template>

<style>
.DialogOverlay {
  backdrop-filter: blur(40px);
  position: fixed;
  inset: 0;
  animation: contentShow 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2000;
}

.DialogContent {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background-color: var(--base-10);
  color: var(--base-120);
  border-radius: var(--radius);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: var(--space-3);
  animation: contentShow var(--time) cubic-bezier(0.16, 1, 0.3, 1);
  transition: var(--time);
  z-index: 2001;
}

.DialogContent:has(> .DialogIconButton:hover) {
  background-color: var(--base-30);
  border-color: var(--base-120);
}

.DialogContent:focus {
  outline: none;
}

.DialogIconButton {
  position: absolute;
  top: var(--space-quark);
  right: var(--space-quark);
  border-radius: var(--inner-radius);
}

.DialogIconButton:hover {
  background-color: var(--grass-4);
}

.DialogIconButton:focus {
  box-shadow: 0 0 0 2px var(--grass-7);
}

@keyframes overlayShow {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes contentShow {
  from {
    backdrop-filter: blur(0);
  }

  to {
    backdrop-filter: blur(40px);
  }
}
</style>
