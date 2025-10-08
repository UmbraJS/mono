<script setup lang="ts">
import { DyePicker } from "@umbrajs/dye";
import "@umbrajs/dye/dist/dye.css";

const open = ref(true);
</script>

<template>
  <div class="DyePickerContainer">
    <Teleport to="body">
      <DyePicker :open="open" default="#3498db" @change="(dye) => console.log('Color changed:', dye)" />
    </Teleport>
  </div>
</template>

<style>
.DyepickerWrapper {
  position: absolute;
  width: 200px;
  height: 200px;
  z-index: 99;
}

.DyePickerContainer {
  position: relative;
  --size: 40px;
  width: var(--size);
  height: var(--size);
  background-color: RED;
  border-radius: var(--radius);
}
</style>
