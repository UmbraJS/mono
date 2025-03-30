<script setup lang="ts">
defineProps<{
  editable: boolean
}>()
</script>

<template>
  <p
    id="PremiseContentWrapper"
    :class="editable && 'buttonHover buttonActive buttonFocus focus'"
    :contenteditable="editable"
    tabindex="1"
  >
    <slot />
  </p>
</template>

<style>
#PremiseContentWrapper {
  height: 100%;
  padding: var(--space-quark);
  border-radius: var(--radius);
}
</style>
