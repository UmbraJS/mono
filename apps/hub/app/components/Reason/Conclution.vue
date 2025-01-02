<script setup lang="ts">
import type { Reason } from '../../types/reasons'

const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <PremisesPremise class="conclution card">
    <PremisesPremiseId>
      <Icon name="pixelarticons:lightbulb" />
    </PremisesPremiseId>
    <p>{{ props.reason.conclution }}</p>
    <ReasonCredibility :credibility="props.reason.credibility" />
  </PremisesPremise>
</template>

<style scoped>
.conclution.card {
  z-index: 1;
}
</style>
