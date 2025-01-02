<script setup lang="ts">
import type { Reason } from '../../types/reasons'
const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <Premises class="inductive">
    <PremisesPremise
      v-for="premise in props.reason.premises"
      :key="premise.id"
      :type="premise.type"
    >
      <p>{{ premise.text }}</p>
    </PremisesPremise>
  </Premises>
</template>

<style>
.premises.inductive {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: 1fr 1fr;
}

.premises.inductive .premise {
  padding-left: var(--space-1);
}
</style>
