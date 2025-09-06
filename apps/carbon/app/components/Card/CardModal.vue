<script setup lang="ts">
import { Drawer } from 'umbraco'
import type { Card } from '../../../types'
import CardModalAvatar from './CardModalAvatar.vue'
import CardModalMeta from './CardModalMeta.vue'
import type { OutputChunk } from '../../../utils/time/types';

defineProps<{
  chunks?: OutputChunk[]
  card: Card;
}>()
</script>

<template>
  <Drawer height="50vh">
    <template #trigger>
      <slot />
    </template>
    <template #content>
      <div class="DialogWrapper">
        <CardModalAvatar :chunks="chunks" :card="card" />
        <CardModalMeta :card="card" />
      </div>
    </template>
  </Drawer>
</template>

<style>
.DialogWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 50vh;
}
</style>
