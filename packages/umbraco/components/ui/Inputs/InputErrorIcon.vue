<script setup lang="ts">
import Tooltip from '../Tooltip.vue'

defineProps<{
  error?: string
}>()
</script>

<template>
  <div v-if="error" class="InputErrorIcon">
    <Tooltip :text="error" class="base-warning">
      <Icon name="carbon:error" />
    </Tooltip>
  </div>
</template>

<style>
.InputErrorIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-80);
  height: var(--block);
  width: var(--block);
  border-radius: var(--radius);
  position: absolute;
  top: 50%;
  right: var(--space-quark);
  transform: translateY(-50%);
  z-index: 15;
  color: var(--base-120);
  pointer-events: auto;
  cursor: pointer;
}
</style>
