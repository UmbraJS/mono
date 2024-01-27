<script setup lang="ts">
import DyePicker from './components/DyePicker.vue'
</script>

<template>
  <div class="pickers">
    <DyePicker default="#36576a"/>
    <DyePicker default="#214761"/>
    <DyePicker default="#682d63"/>
  </div>
</template>

<style lang="scss">
.pickers {
  display: flex;
  gap: 15px;
  padding: 15px;
}
</style>
