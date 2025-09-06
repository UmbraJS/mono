<script setup lang="ts">
import { Button } from 'umbraco'
</script>

<template>
  <Button class="CarbonButton">
    <slot />
  </Button>
</template>

<style>
.CarbonButton {
  display: flex;
  justify-content: flex-start;
  gap: var(--space-1);
  width: 100%;
}
</style>
