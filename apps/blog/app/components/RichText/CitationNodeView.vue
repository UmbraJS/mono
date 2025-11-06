<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { getCitationCredibility } from '../../../types/res'
import type { Citation, CitationDistance, CitationReliance, CitationCredibility } from '../../../types/res'
import CitationIcon from '../CitationIcon.vue'

defineProps(nodeViewProps)

// Mock citation data - in a real implementation, this would come from node attributes
const cit: Citation = {
  id: "cit_1",
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

const relianceLegend: {
  label: CitationReliance
  description: string
  points: number
  icon: string
}[] = [
    {
      label: 'deductive',
      description: 'The source directly supports the claim.',
      points: 100,
      icon: 'carbon:asterisk',
    },
    {
      label: 'inductive',
      description: 'The source provides indirect support for the claim.',
      points: 10,
      icon: 'carbon:condition-wait-point',
    },
    {
      label: 'irrelevant',
      description: 'The source does not support the claim.',
      points: -50,
      icon: 'carbon:close',
    },
    {
      label: "contradiction",
      description: 'The source contradicts the claim.',
      points: -100,
      icon: 'carbon:warning',
    }
  ]

const activeReliance = computed(() => {
  return relianceLegend.find(l => l.label === cit.reliance)
})

const getNumber = (num: number) => {
  if (num > 0) return `+${num}`
  return num
}
</script>

<template>
  <NodeViewWrapper class="CitedQuote">
    <blockquote>
      <NodeViewContent />
    </blockquote>
    <div class="CitedQuoteInfo">
      <CitationIcon title="Citation Information" description="Details about the source of this quote"
        :icon="activeReliance?.icon || 'carbon:condition-wait-point'">
        <div class="Wrapper">
          <div class="InfoText">
            <h3>Citation Reliance</h3>
            <p>
              Reliance refers to the relationship between the source and the claim it supports.
            </p>
          </div>
          <ul class="legend">
            <li v-for="item in relianceLegend" :key="item.label" class="LegendItem"
              :class="{ 'base-success': item.label === cit.reliance }">
              <div class="LegendChip border">
                <Icon :name="item.icon" class="icon" size="20" />
                <div>
                  <p><span>{{ item.label }}</span></p>
                  <p class="caption">{{ item.description }}</p>
                </div>
              </div>
              <div class="LegendPoints border">
                <p><span>{{ getNumber(item.points) }}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </CitationIcon>
    </div>
  </NodeViewWrapper>
</template>

<style>
.CitedQuote {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-2) 0;
}

.CitedQuote blockquote {
  padding: var(--space-3);
  background-color: var(--base-10);
  border-left: 4px solid var(--base-60);
  margin: 0;
}

.CitedQuoteInfo {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
}

.Wrapper {
  display: flex;
  gap: var(--space-2);
}

.InfoText {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

ul.legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  list-style: none;
  padding: 0;
  margin: 0;
}

li.LegendItem {
  display: grid;
  grid-template-columns: 1fr auto;
}

.LegendChip {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2);
  background-color: var(--base-10);
  border-radius: var(--radius);
}

.LegendPoints {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  background-color: var(--base-20);
  min-width: 60px;
}
</style>
