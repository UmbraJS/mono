<script setup lang="ts">
import { Toaster } from 'vue-sonner'

defineProps<{
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}>()
</script>

<template>
  <Toaster :position="position || 'top-center'" :expand="false" :visibleToasts="3" :toastOptions="{
    classes: {
      toast: 'toast inverted-theme',
      title: 'toast-title p',
      description: 'toast-description p',
      actionButton: 'toast-action-button',
      cancelButton: 'toast-cancel-button',
      closeButton: 'toast-close-button',
      error: 'toast-error',
      success: 'toast-success',
      info: 'toast-info',
    },
  }" />
</template>

<style lang="scss">
.toast {
  background-color: var(--color-80);
  color: var(--color-contrast);
  border-radius: var(--radius);
  padding: var(--space-1);
  border: solid var(--border-size) var(--color-80);
}

.toast-error {
  --color: var(--warning);
  --color-10: var(--warning-10);
  --color-20: var(--warning-20);
  --color-30: var(--warning-30);
  --color-40: var(--warning-40);
  --color-50: var(--warning-50);
  --color-60: var(--warning-60);
  --color-70: var(--warning-70);
  --color-80: var(--warning-80);
  --color-90: var(--warning-90);
  --color-100: var(--warning-100);
  --color-110: var(--warning-110);
  --color-120: var(--warning-120);
  --color-contrast: var(--warning-contrast);
}

.toast-success {
  --color: var(--success);
  --color-10: var(--success-10);
  --color-20: var(--success-20);
  --color-30: var(--success-30);
  --color-40: var(--success-40);
  --color-50: var(--success-50);
  --color-60: var(--success-60);
  --color-70: var(--success-70);
  --color-80: var(--success-80);
  --color-90: var(--success-90);
  --color-100: var(--success-100);
  --color-110: var(--success-110);
  --color-120: var(--success-120);
  --color-contrast: var(--success-contrast);
}
</style>
