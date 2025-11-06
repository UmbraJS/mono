<script setup lang="ts">
import type { Citation } from '../../../types/res'
import CitationIcons from '../CitationIcons.vue'

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
  <div class="CitedQuote">
    <blockquote>
      <slot></slot>
    </blockquote>
    <CitationIcons :citation="cit" />
  </div>
</template>

<style>
.Wrapper {
  display: flex;
  gap: var(--space-2);
}

@media (max-width: 1000px) {
  .Wrapper {
    flex-direction: column;
  }
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

li.LegendItem>div:nth-child(1) {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: none;
}

li.LegendItem>div:nth-child(2) {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.LegendChip {
  display: flex;
  align-items: center;
  gap: var(--space-2);

  background-color: var(--base-10);
  color: var(--base-120);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
}

.LegendPoints {
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--base-10);
  color: var(--base-120);
  width: 90px;
}

.CitedQuote {
  display: flex;
  flex-direction: column;
}

.CitedQuoteInfo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  color: var(--base-120);
  border-left: 1px solid var(--base-40);

}

.CitedQuoteInfo::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--base-40);
  z-index: 0;
}
</style>
