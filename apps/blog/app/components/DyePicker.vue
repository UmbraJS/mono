<script setup lang="ts">
import { DyePicker } from "@umbrajs/dye";
import "@umbrajs/dye/dist/dye.css";


const open = ref(true);
</script>

<template>
  <div class="DyePickerContainer">
    <DyePicker default="#3498db" :compact="false" @change="(dye) => console.log('Color changed:', dye)" />
  </div>
</template>

<style scoped>
.DyePickerContainer {}
</style>
