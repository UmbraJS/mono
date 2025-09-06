<script setup lang="ts">
import type { Reason } from '../../../types/reasoning'
const props = defineProps<{
  reason: Reason
}>()

function getNameOfWebsiteFromURL(url?: string) {
  if (!url) return undefined
  const hostname = new URL(url).hostname
  return hostname.replace(/^www\./, '')
}
</script>

<template>
  <Premises>
    <div class="gutter"></div>
    <div id="DeductivePremises">
      <PremisesPremise
        v-for="(premise, index) in props.reason.premises"
        :key="premise.id"
        :class="premise.type === 'infavor' ? 'base-success' : 'base-warning'"
      >
        <PremisesPremiseId :id="index + 1" />
        <PremisesPremiseContent :editable="true">
          {{ premise.text }}
          <a v-if="premise.source" :href="premise.source" class="PremiseContentSource">
            {{ getNameOfWebsiteFromURL(premise.source) }}
          </a>
        </PremisesPremiseContent>
        <ReasonCredibility :credibility="premise.credibility" />
      </PremisesPremise>
    </div>
  </Premises>
</template>

<style>
#DeductivePremises {
  display: grid;
  gap: var(--space-1);
}

.gutter {
  background-color: var(--base-10);
  width: var(--space-4);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}
</style>
