<script setup lang="ts">
interface Props {
  displayMode: 'lightness' | 'saturation' | 'hue'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:displayMode': [mode: 'lightness' | 'saturation' | 'hue']
}>()
</script>

<template>
  <div class="mode-selector">
    <button :class="['mode-button', { active: displayMode === 'lightness' }]"
      @click="emit('update:displayMode', 'lightness')">
      Lightness
    </button>
    <button :class="['mode-button', { active: displayMode === 'saturation' }]"
      @click="emit('update:displayMode', 'saturation')">
      Saturation
    </button>
    <button :class="['mode-button', { active: displayMode === 'hue' }]" @click="emit('update:displayMode', 'hue')">
      Hue
    </button>
  </div>
</template>

<style scoped lang="scss">
.mode-selector {
  display: flex;
  gap: var(--space-2);
}

.mode-button {
  padding: var(--space-2) var(--space-3);
  background: var(--base-10);
  border: 1px solid var(--base-30);
  border-radius: var(--radius-2);
  color: var(--base-80);
  cursor: pointer;
  font-size: var(--font-size-2);
  font-weight: 500;
  transition: all 0.2s ease;
}

.mode-button:hover {
  background: var(--base-20);
  border-color: var(--base-40);
  color: var(--base-text);
}

.mode-button.active {
  background: var(--accent-60);
  border-color: var(--accent-80);
  color: var(--accent-text);
}
</style>
