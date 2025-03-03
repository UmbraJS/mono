<script setup lang="ts">
import { Toggle, toast } from '@nobel/core'

const theme = useUmbra()
</script>

<template>
  <div class="settings-panel">
    <h2>Settings</h2>
    <Toggle :value="theme.isDark" @click="theme.inverse()" />
  </div>
</template>

<style lang="scss">
.settings-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
}
</style>
