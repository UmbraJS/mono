<script setup lang="ts">
import { Button } from '@nobel/core'
</script>

<template>
  <Button id="PickButton">
    <slot />
  </Button>
</template>

<style>
#PickButton {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
}
</style>
