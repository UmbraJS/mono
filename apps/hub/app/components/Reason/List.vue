<script setup lang="ts">
import data from '../../data'
const reasons = ref(data.reasons)
</script>

<template>
  <div class="arguments">
    <Argument v-for="reason in reasons" :key="reason.reasoning" :reason="reason">
      <p>
        1 Nuxt layers are a <Reference id="0">powerful</Reference> feature that you can use to share
        and reuse partial Nuxt applications within a monorepo, or from a git repository or npm
        package. The layers structure is almost identical to a standard Nuxt application, which
        makes them easy to author and maintain.
      </p>
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
