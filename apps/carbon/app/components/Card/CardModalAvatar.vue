<script setup lang="ts">
import CardCooldown from './CardCooldown.vue'
import type { Card } from '../../../types'
import type { OutputChunk } from '../../../utils/time/types';

defineProps<{
  chunks?: OutputChunk[]
  card: Card
}>()
</script>

<template>
  <div class="avatar">
    <CardHeader :card="card">
      <CardCooldown v-if="chunks" :chunks="chunks" />
    </CardHeader>
  </div>
</template>

<style>
.DialogContent .avatar {
  position: relative;
}
</style>
