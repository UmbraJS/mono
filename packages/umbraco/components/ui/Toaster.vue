<script setup lang="ts">
import { Toaster } from 'vue-sonner'

defineProps<{
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}>()
</script>

<template>
  <Toaster :position="position || 'top-center'" :expand="false" :visibleToasts="3" :toastOptions="{
    classes: {
      toast: 'toast',
      title: 'toast-title p',
      description: 'toast-description p',
      actionButton: 'toast-action-button',
      cancelButton: 'toast-cancel-button',
      closeButton: 'toast-close-button',
      error: 'toast-error base-warning',
      success: 'toast-success base-success',
      info: 'toast-info',
    },
  }" />
</template>

<style>
.toast {
  background-color: var(--base-10);
  color: var(--base-120);
  border-radius: var(--radius);
  padding: var(--space-1) var(--space-2);
  border: solid var(--border-size) var(--base-80);

  --color: var(--base);
  --color-10: var(--base-10);
  --color-20: var(--base-20);
  --color-30: var(--base-30);
  --color-40: var(--base-40);
  --color-50: var(--base-50);
  --color-60: var(--base-60);
  --color-70: var(--base-70);
  --color-80: var(--base-80);
  --color-90: var(--base-90);
  --color-100: var(--base-100);
  --color-110: var(--base-110);
  --color-120: var(--base-120);
  --color-text: var(--base-text);
}
</style>
