<script setup lang="ts">
import type { Citation } from '../../../types/res'
import { aggregatedCitationCredibility, bucketCredibility } from '../../../types/res'

const {
  image = 'https://pbs.twimg.com/media/Gzc2p7BWUAA2kER?format=jpg&name=4096x4096',
  mood = 'neutral',
  type = 'premise',
  claims = [{
    description: 'The earth is round.',
    validity: 0.9,
    sources: [
      {
        id: "cit_1",
        title: "The Welfare of Animals in Factory Farms",
        container: "Journal of Animal Ethics",
        publisher: "Oxford University Press",
        publicationDate: "2020-05-15",
        type: "journal-article",
        authors: [{ name: "Dr. Jane Smith", orcid: "0000-0002-1825-0097" }],
        url: "https://doi.org/10.1093/jae/ejz012",
        reliance: "deductive",
        distance: "primary",
        scope: "study",
        quality: { sourceReliability: 0.9, evidenceStrength: 0.85 },
      }
    ]
  }],
} = defineProps<{
  image?: string
  mood?: "positive" | "negative" | "neutral"
  type?: "premise" | "logic" | "normative"
  claims?: {
    description: string
    validity: number
    sources: Citation[]
  }[]
}>()

const open = ref(false)

const moodClass = computed(() => {
  if (mood === 'positive') return 'base-success'
  if (mood === 'negative') return 'base-warning'
  return 'base-base'
})

const openClass = computed(() => open.value ? 'open' : 'closed')

function toggleOpen() {
  open.value = !open.value
}

const allSources = computed(() => {
  return claims.flatMap(c => c.sources)
})
</script>

<template>
  <div class="NarrativeFrame border" :class="[moodClass, openClass]">
    <header @click="toggleOpen">
      <NuxtImg :src="image" alt="Gandhi holding a gun" width="600" height="400" />
      <Icon class="Bookmark" name="carbon:bookmark" size="24" />
      <p class="display">
        <slot name="title" mdc-unwrap="p" />
      </p>
      <Icon name="carbon:chevron-down" size="24" class="Arrow" />
    </header>
    <div class="FrameSupport">
      <div class="FrameMeta">
        <p class="FrameMetaChip caption">type: <span>{{ type }}</span></p>
        <p class="FrameMetaChip caption">quality:
          <span>
            {{ bucketCredibility(aggregatedCitationCredibility(allSources)) }}
          </span>
        </p>
        <p class="FrameMetaChip caption">credibility:
          <span>
            {{ bucketCredibility(aggregatedCitationCredibility(allSources)) }}
          </span>
        </p>
        <p class="FrameMetaChip caption">sources:
          <span>{{ allSources.length }}</span>
        </p>
      </div>
      <div class="Description">
        <slot name="description" />
      </div>
      <div class="Citations">
        <CitationChip v-for="source in allSources" :key="source.id" :source="source" />
      </div>
    </div>
  </div>
</template>

<style>
.Arrow {
  color: var(--base-text);
  transition: color var(--time), transform var(--time);
}

.open .Arrow {
  transform: rotate(180deg);
  will-change: transform;
}

.Description {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.Bookmark {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background-color: var(--base-80);
  z-index: 1;
  cursor: pointer;
  transition: background-color var(--time), color var(--time);
}

.Bookmark:hover {
  background-color: var(--base-100);
  color: var(--base-10);
}

.FrameMetaChip {
  padding: var(--space-quark) var(--space-2);
  background-color: var(--base-10);
  color: var(--base-70);
  border-radius: var(--radius);
}

.FrameMeta {
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
  align-items: center;
  background-color: var(--base-40);
  width: 100%;
  height: 1px;
}

.Citations {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.NarrativeFrame {
  border-radius: var(--radius);
  width: 60em;
  max-width: 90vw;
  overflow: hidden;
  color: var(--base-text);
}

.NarrativeFrame header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: color var(--time), background-color var(--time), border-color var(--time), transform var(--time);
  padding: var(--space-4) 0px;
  padding-bottom: var(--space-3);
}

.NarrativeFrame header:hover {
  color: var(--base-120);
}

.NarrativeFrame header p {
  transform: scale(1);
  z-index: 1;
  transition: color var(--slower), transform var(--slower);
  will-change: transform;
}

.NarrativeFrame>* {
  z-index: 1;
}

.closed .FrameSupport {
  height: 0px;
  padding: 0px;
  opacity: 0;
}

.FrameSupport {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-3);

  padding: var(--space-2);
  padding-bottom: calc(var(--space-2) + var(--paragraph) / 2);
  padding-top: calc(var(--space-2) + var(--paragraph) / 2);
  background-color: var(--base-10);
  opacity: 1;

  overflow: hidden;
  transition: background-color var(--slower), opacity var(--slower), color var(--slower), padding var(--slower), height var(--slower);
}

.NarrativeFrame header:hover img {
  filter: blur(4px);
  transform: scale(1.1) translateY(-5px);
  will-change: transform, filter;
}

.NarrativeFrame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  opacity: 0.4;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
  transition: opacity var(--slower), filter var(--slower), transform var(--slower);
}
</style>
