<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import type { Citation } from '../../../types/res'
import CitationIcons from '../CitationIcons.vue'

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
</script>

<template>
  <NodeViewWrapper class="CitedQuote">
    <blockquote>
      <NodeViewContent />
    </blockquote>
    <CitationIcons :citation="cit" />
  </NodeViewWrapper>
</template>

<style>
.CitedQuote {
  display: flex;
  flex-direction: column;
  margin: var(--space-2) 0;
}

.CitedQuote blockquote {
  padding: var(--space-2);
  border-left: 1px solid var(--base-60);
  margin: 0;

}
</style>
