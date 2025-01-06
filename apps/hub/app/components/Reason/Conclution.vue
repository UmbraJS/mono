<script setup lang="ts">
import type { Reason } from '../../types/reasons'
import TextArea from '../TextArea.vue'

const props = defineProps<{
  reason: Reason
}>()

const conclution = ref<string>(props.reason.conclution)
</script>

<template>
  <PremisesPremise class="conclution card">
    <PremisesPremiseId>
      <Icon name="pixelarticons:lightbulb" />
    </PremisesPremiseId>
    <TextArea
      v-model.trim="conclution"
      placeholder="State a clear position which can be true or false"
    />
    <ReasonCredibility :credibility="props.reason.credibility" />
  </PremisesPremise>
</template>

<style scoped>
.conclution.card {
  z-index: 1;
}
</style>
