<script setup lang="ts">
import type { Reason } from '../../types/reasons'
import TextArea from '../TextArea.vue'

const props = defineProps<{
  reason: Reason
}>()

const conclution = ref<string>(props.reason.conclution)
</script>

<template>
  <p>{{ conclution }}</p>
  <PremisesPremise class="conclution card">
    <PremisesPremiseId>
      <Icon name="pixelarticons:lightbulb" />
    </PremisesPremiseId>
    <TextArea
      v-model.trim="conclution"
      placeholder="State a clear position which can be true or false"
    />

    <!-- <p>{{ props.reason.concldddddddddddddddddddution }}</p> -->
    <!-- <textarea
      v-model="conclution"
      @input="conclutionTrimer"
      placeholder="State a clear position which can be true or false"
    /> -->
    <ReasonCredibility :credibility="props.reason.credibility" />
  </PremisesPremise>
</template>

<style scoped>
.conclution.card {
  z-index: 1;
}

textarea {
  resize: none;
  overflow: hidden;
  field-sizing: content;
  background: transparent;
  color: var(--base-120);
  border: none;
  outline: none;
}
</style>
