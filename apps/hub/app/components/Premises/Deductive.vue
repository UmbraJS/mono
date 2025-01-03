<script setup lang="ts">
import type { Reason } from '../../types/reasons'
const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <Premises>
    <div class="gutter"></div>
    <PremisesPremise v-for="(premise, index) in props.reason.premises" :key="premise.id">
      <PremisesPremiseId :id="index + 1" />
      <p>{{ premise.text }}</p>
      <ReasonCredibility :credibility="premise.credibility" />
    </PremisesPremise>
  </Premises>
</template>

<style>
.gutter {
  grid-row: 1 / span 2;
  background-color: var(--base-10);
  width: var(--space-4);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}
</style>
