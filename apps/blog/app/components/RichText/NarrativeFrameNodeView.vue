<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import type { Citation } from '../../../types/res'
import { aggregatedCitationCredibility, bucketCredibility } from '../../../types/res'
import CitationChip from '../mdc/CitationChip.vue'

const props = defineProps(nodeViewProps)

// Access node attributes
const title = computed({
  get: () => props.node.attrs.title || 'Narrative Frame Title',
  set: (value) => {
    props.updateAttributes({ title: value })
  }
})
const image = computed(() => props.node.attrs.image || 'https://pbs.twimg.com/media/Gzc2p7BWUAA2kER?format=jpg&name=4096x4096')
const mood = computed(() => props.node.attrs.mood || 'neutral')
const type = computed(() => props.node.attrs.type || 'premise')
const claims = computed(() => props.node.attrs.claims || [{
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
}])

const moodClass = computed(() => {
  // if (mood.value === 'positive') return 'base-success'
  // if (mood.value === 'negative') return 'base-warning'
  return 'base-base'
})

const allSources = computed(() => {
  return claims.value.flatMap((c: { sources: Citation[] }) => c.sources)
})
</script>

<template>
  <NodeViewWrapper class="NarrativeFrame border" :class="[moodClass]">
    <header>
      <input v-model="title" class="p display editable-title" placeholder="Enter frame title..."
        @keydown.enter.prevent />
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
        <NodeViewContent />
      </div>
      <div class="Citations">
        <CitationChip v-for="source in allSources" :key="source.id" :source="source" />
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style>
.NarrativeFrame {
  border-radius: var(--radius);
  width: 60em;
  max-width: 90vw;
  overflow: hidden;
  color: var(--base-text);
  margin: var(--space-4) 0;
}

.NarrativeFrame header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--base-10);
  cursor: pointer;
  transition: color var(--time), background-color var(--time), border-color var(--time), transform var(--time);
  padding: var(--space-3);
  padding-bottom: var(--space-2);
}

.NarrativeFrame header:hover {
  color: var(--base-120);
}

.NarrativeFrame header p {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: color var(--slower), transform var(--slower);
  will-change: transform;
}

.editable-title {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  font-family: inherit;
  padding: 0;
  margin: 0;
  z-index: 1;
  transition: color var(--slower), transform var(--slower);
}

.editable-title::placeholder {
  color: var(--base-60);
  opacity: 0.5;
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

.Description {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.Description .CitationIcon:not(.CitationChip) {
  background-color: var(--base-10);
}

.Citations {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
