<script setup lang="ts">
import type { Reason } from '../../../types/reasoning'
import PremiseContent from './PremiseContent.vue'
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
      <PremiseContent :editable="false">{{ premise.text }}</PremiseContent>
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
