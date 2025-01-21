<script setup lang="ts">
import type { Reason } from '../../types/reasons'
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
    <PremisesPremise v-for="(premise, index) in props.reason.premises" :key="premise.id">
      <PremisesPremiseId :id="index + 1" />
      <div class="PremiseContentWrapper">
        <p class="PremiseContent">{{ premise.text }}</p>
        <div class="PremiseContentSource" v-if="premise.source">
          <a :href="premise.source">
            <p>{{ getNameOfWebsiteFromURL(premise.source) }}</p>
          </a>
        </div>
      </div>
      <ReasonCredibility :credibility="premise.credibility" />
    </PremisesPremise>
  </Premises>
</template>

<style>
.gutter {
  grid-row: 1 / span 2;
  background-color: var(--base-10);
  width: var(--space-4);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}

.PremiseContent {
  padding: var(--space-quark);
}

.PremiseContentSource {
  padding: var(--space-1);
  border-top: solid var(--border-size) var(--base-60);
  display: flex;
  justify-content: end;
}
</style>
