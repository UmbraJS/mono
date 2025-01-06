<script setup lang="ts">
import data from '../../data'
const reasons = ref(data.reasons)
</script>

<template>
  <div class="arguments">
    <Argument v-for="reason in reasons" :key="reason.reasoning" :reason="reason">
      <PremisesDeductive v-if="reason.reasoning === 'deductive'" :reason="reason" />
      <PremisesInductive v-else-if="reason.reasoning === 'inductive'" :reason="reason" />
    </Argument>
  </div>
</template>

<style>
.arguments {
  display: grid;
  gap: var(--space-4);
}
</style>
