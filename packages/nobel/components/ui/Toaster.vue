<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster
    position="top-center"
    :toastOptions="{
      classes: {
        toast: 'toast inverted-theme',
        title: 'toast-title p',
        description: 'toast-description p',
        actionButton: 'toast-action-button',
        cancelButton: 'toast-cancel-button',
        closeButton: 'toast-close-button',
      },
    }"
  />
</template>

<style lang="scss">
.toast {
  background-color: var(--base-20);
  color: var(--base-contrast);
  border-radius: var(--radius);
  padding: var(--space-1);
  border: solid var(--border-size) var(--accent-60);
}
</style>
