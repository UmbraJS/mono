<script setup lang="ts">
import Reference from '../Reference.vue'
import ReasonArgument from '../Reason/Argument.vue'
import PremisesDeductive from '../Premises/Deductive.vue'
import PremisesInductive from '../Premises/Inductive.vue'
import type { Reason } from '../../../types/reasoning'
const { data: reasons } = useFetch<Reason[]>('/api/reasons')
const reason = computed(() => reasons?.value?.[0])
</script>

<template>
  <div class="arguments" contenteditable="false">
    <ReasonArgument v-if="reason" :reason="reason">
      <p>
        1 Nuxt layers are a <Reference id="0">powerful</Reference> feature that you can use to share
        and reuse partial Nuxt applications within a monorepo, or from a git repository or npm
        package. The layers structure is almost identical to a standard Nuxt application, which
        makes them easy to author and maintain.
      </p>
      <PremisesDeductive v-if="reason.reasoning === 'deductive'" :reason="reason" />
      <PremisesInductive v-else-if="reason.reasoning === 'inductive'" :reason="reason" />
    </ReasonArgument>
  </div>
</template>

<style>
.arguments {
  display: grid;
  gap: var(--space-4);
}
</style>
