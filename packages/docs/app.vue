<script setup>
import DyePicker from './components/DyePicker.vue'
</script>

<template>
  <DyePicker color="#ff0000" />
  <UDashboardCard
    title="Recent sales"
    description="You made 265 sales this month."
    icon="i-heroicons-chart-bar"
  >
    <UProgress />
  </UDashboardCard>
</template>

<style lang="scss">
@import './css';
</style>
