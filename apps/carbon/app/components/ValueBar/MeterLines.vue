<script setup lang="ts">
const { value = 0, meter = 30 } = defineProps<{
  value?: number
  meter?: number
}>()

const amountOfMeterLines = computed(() => {
  // Ensure value is a valid number and within reasonable bounds
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0
  const safeMeter = Number.isFinite(meter) && meter > 0 ? meter : 30

  const result = Math.ceil(safeValue / safeMeter)

  // Limit the number of meter lines to prevent performance issues and invalid array lengths
  // Maximum array length in JavaScript is 2^32 - 1, but we'll use a much smaller practical limit
  return Math.min(result, 1000)
})
</script>

<template>
  <div class="meterLines">
    <div v-for="i in amountOfMeterLines" :key="i" class="meter" :style="{
      opacity: i === 1 ? 0 : 1,
    }" />
  </div>
</template>

<style>
.meterLines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  z-index: 1;

  display: grid;
  grid-template-columns: repeat(v-bind(amountOfMeterLines), 1fr);
}

.meterLines .meter {
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: var(--base-10);
}
</style>
