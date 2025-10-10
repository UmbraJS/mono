<script setup lang="ts">
import { ref } from 'vue';
import { DyePicker } from "@umbrajs/dye";
import "@umbrajs/dye/dist/dye.css";

defineProps<{
  // You can define props here if needed
  defaultColor: string
}>();

const emit = defineEmits<{
  change: [color: string]
}>();

const open = ref(false);
</script>

<template>
  <div class="DyePickerContainer" :class="{ open }">
    <div class="DyePickerCarrier border">
      <DyePicker v-model:open="open" :default="defaultColor"
        @change="(dye) => emit('change', dye.color.toRgbString())" />
    </div>
  </div>
</template>

<style>
.DyepickerWrapper {
  width: 200px;
  height: 200px;
  position: relative;
  z-index: 10;
}

.DyePickerContainer {
  position: relative;
  --size: 50px;
  z-index: 99;
  width: var(--size);
  height: var(--size);
  border-radius: var(--radius);
}


.DyePickerCarrier {
  position: absolute;
  z-index: 1;
}

.DyePickerCarrier:focus-within {
  position: absolute;
  z-index: 99;
}

.DyePickerCarrier::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: var(--base);
  border-radius: var(--radius);
  transform: scale(2);
  filter: blur(8px);
  pointer-events: none;
  opacity: 0;
  transition: .4s;
}

.DyePickerContainer.open .DyePickerCarrier::after {
  opacity: 0.7;
}
</style>
