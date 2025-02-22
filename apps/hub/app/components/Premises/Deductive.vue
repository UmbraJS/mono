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
    <!-- <p>
      1 Nuxt layers are a <Reference id="0">powerful</Reference> feature that you can use to share
      and reuse partial Nuxt applications within a monorepo, or from a git repository or npm
      package. The layers structure is almost identical to a standard Nuxt application, which makes
      them easy to author and maintain.
    </p> -->
    <div class="gutter"></div>
    <div class="Deductive-Premises">
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
    </div>
  </Premises>
</template>

<style>
.Deductive-Premises {
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

.PremiseContent {
  padding: var(--space-quark);
}

.PremiseContentSource {
  padding: var(--space-quark);
  padding-top: 0px;
  display: flex;
}
</style>
