<script setup lang="ts">
import type { Reason } from '../types/reasons'

const reasons = ref<Reason[]>([
  {
    id: '1',
    reasoning: 'deductive',
    conclution: 'Socrates is mortal',
    moralValue: 'Neutral',
    type: 'Descriptive',
    credibility: {
      value: 0.8,
      level: 'solid',
      votes: [],
    },
    premises: [
      {
        id: '1',
        type: 'premise',
        text: 'All men are mortal',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
      {
        id: '2',
        type: 'premise',
        text: 'Socrates is a man',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
    ],
  },
  {
    id: '2',
    reasoning: 'inductive',
    conclution: 'All men are mortal',
    moralValue: 'Neutral',
    type: 'Descriptive',
    credibility: {
      value: 0.8,
      level: 'solid',
      votes: [],
    },
    premises: [
      {
        id: '1',
        type: 'infavor',
        text: 'Lots of mortal men',
        credibility: {
          value: 0.8,
          level: 'solid',
          votes: [],
        },
      },
      {
        id: '2',
        type: 'inopposition',
        text: 'Budda',
        credibility: {
          value: 0.8,
          level: 'weak',
          votes: [],
        },
      },
    ],
  },
])
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
