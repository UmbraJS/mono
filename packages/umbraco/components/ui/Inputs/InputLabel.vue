<script setup lang="ts">
defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <label :for="label" class="InputLabel button">
    <p>{{ label }}</p>
    <p class="ErrorNote caption" v-if="error">{{ error }} *</p>
  </label>
</template>

<style>
label.InputLabel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: var(--base);
  color: var(--base-120);
  padding: 0 var(--space-quark);
  pointer-events: none;
  transition: color 0.3s, background-color 0.3s, transform 0.3s, opacity 0.3s;
}

div.InputWrapper:has(.InputElement:not(:placeholder-shown)):not(:focus-within) label {
  transform: translateY(0%);
  opacity: 0;
}

.InputWrapper label.move {
  transform: translateY(-100%);
  height: 100%;
}

.ErrorNote {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base-20);
  height: var(--block);
  padding: 0 var(--space-1);
  border-radius: var(--radius);
}
</style>
