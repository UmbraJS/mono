<script setup lang="ts">
import type { Card } from '../../types'

defineProps<{
  card: Card
}>()
</script>

<template>
  <div class="card">
    <img v-if="card.image" :src="card.image.default" alt="Card Image" />
  </div>
</template>

<style lang="scss"></style>
