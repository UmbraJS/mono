<script setup lang="ts">
import { Select } from '@nobel/core'
import type { Reason } from '../../types/reasons'
const props = defineProps<{
  credibility: Reason['credibility']
}>()
</script>

<template>
  <div class="reason-credibility">
    <!-- <p>
      {{ props.credibility.level }}
      <span>{{ props.credibility.value }}</span>
    </p> -->
    <Select />
  </div>
</template>

<style>
.reason-credibility {
  display: flex;
  align-items: center;
  padding: 0px var(--space-1);
  background: var(--base-20);
  color: var(--base-120);
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  height: 100%;
  border-left: solid var(--border-size) var(--base-60);
}
</style>
