<script setup lang="ts">
const reasons = ref([
  {
    type: 'Deductive Reasoning',
    conclution: 'Socrates is mortal',
    premises: [
      {
        type: 'premise',
        text: 'All men are mortal',
      },
      {
        type: 'premise',
        text: 'Socrates is a man',
      },
    ],
  },
  {
    type: 'Inductive Reasoning',
    conclution: 'Socrates is a mortal',
    premises: [
      {
        type: 'infavor',
        text: 'lol',
      },
      {
        type: 'inopposition',
        text: 'lol',
      },
    ],
  },
])
</script>

<template>
  <div class="arguments">
    <Argument
      v-for="reason in reasons"
      :key="reason.type"
      :reasoning="reason.type"
      :conclution="reason.conclution"
    >
      <PremisesDeductive v-if="reason.type === 'Deductive Reasoning'" />
      <PremisesInductive v-else-if="reason.type === 'Inductive Reasoning'" />
    </Argument>
  </div>
</template>

<style>
.arguments {
  display: grid;
  gap: var(--space-4);
}
</style>
