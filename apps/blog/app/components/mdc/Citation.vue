<script setup lang="ts">
import { getCitationCredibility } from '../../../types/res'
import type { Citation, CitationDistance, CitationReliance, CitationCredibility } from '../../../types/res'
import CitationIcon from '../CitationIcon.vue';

const cit: Citation = {
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

const relianceLegend: {
  label: CitationReliance
  description: string
  icon: string
}[] = [
    {
      label: 'deductive',
      description: 'The source directly supports the claim.',
      icon: 'carbon:asterisk',
    },
    {
      label: 'inductive',
      description: 'The source provides indirect support for the claim.',
      icon: 'carbon:condition-wait-point',
    },
  ]

const distanceLegend: {
  label: CitationDistance
  description: string
  icon: string
}[] = [
    {
      label: 'primary',
      description: 'The source is the original source of the information.',
      icon: 'carbon:sight',
    },
    {
      label: 'secondary',
      description: 'The source cites another source for the information.',
      icon: 'carbon:need',
    },
    {
      label: 'hearsay',
      description: 'The source is not directly related to the information.',
      icon: 'carbon:chat-bot',
    },
  ]

const credibilityLegend: {
  label: CitationCredibility
  description: string
  icon: string
}[] = [
    {
      label: 'gold-standard',
      description: 'The source is the highest quality and most reliable available.',
      icon: 'carbon:trophy',
    },
    {
      label: 'authoritative',
      description: 'The source is widely accepted as a definitive reference.',
      icon: 'carbon:3d-software',
    },
    {
      label: 'expert',
      description: 'The source is written by a recognized expert in the field.',
      icon: 'carbon:star',
    },
    {
      label: 'reliable',
      description: 'The source is generally accurate and trustworthy.',
      icon: 'carbon:checkmark',
    },
    {
      label: 'questionable',
      description: 'The source is not well known or is often wrong.',
      icon: 'carbon:help',
    },
    {
      label: 'unreliable',
      description: 'The source has a history of being wrong or biased.',
      icon: 'carbon:error',
    },
    {
      label: 'discredited',
      description: 'The source actively lies or distorts the truth.',
      icon: 'carbon:warning-alt',
    },
  ]



const activeDistance = distanceLegend.find(d => d.label === cit.distance)
const activeReliance = relianceLegend.find(r => r.label === cit.reliance)
</script>

<template>
  <div class="CitedQuote">
    <blockquote>
      <slot></slot>
    </blockquote>
    <div class="CitedQuoteInfo">
      <CitationIcon title="Citation Information" description="Details about the source of this quote"
        :icon="activeReliance?.icon || 'carbon:condition-wait-point'">
        <div class="Wrapper">
          <div class="InfoText">
            <h3>Citation Reliance</h3>
            <p>Reliance refers to the the relationship between the source and the claim it supports.
              For instance if the claim is inherently dependent on this citation for its validity, then the reliance is
              deductive. If the claim is supported by this citation but could also be supported by other sources, then
              the reliance
              is inductive.</p>
          </div>
          <ul class="legend">
            <li v-for="item in relianceLegend" :key="item.label" class="legendItem border"
              :class="{ 'base-success': item.label === cit.reliance }">
              <Icon :name="item.icon" class="icon" size="20" />
              <div>
                <p><span>{{ item.label }}</span></p>
                <p class="caption">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </CitationIcon>

      <CitationIcon title="Citation Information" description="Details about the source of this quote"
        :icon="activeDistance?.icon || 'carbon:condition-wait-point'">
        <div class="Wrapper">
          <div class="InfoText">
            <h3>Citation Distance</h3>
            <p>Distance refers to how directly the source is related to the information it provides. A primary source
              is the original source of the information, a secondary source cites another source for the information,
              and a hearsay source is not directly related to the information.</p>
          </div>
          <ul class="legend">
            <li v-for="item in distanceLegend" :key="item.label" class="legendItem border"
              :class="{ 'base-success': item.label === cit.distance }">
              <Icon :name="item.icon" class="icon" size="20" />
              <div>
                <p><span>{{ item.label }}</span></p>
                <p class="caption">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </CitationIcon>

      <CitationIcon title="Citation Information" description="Details about the source of this quote"
        :icon="(credibilityLegend.find(l => l.label === getCitationCredibility(((cit.quality?.sourceReliability || 0) + (cit.quality?.evidenceStrength || 0)) / 2))?.icon) || 'carbon:condition-wait-point'">
        <div class="Wrapper">
          <div class="InfoText">
            <h3>Citation Credibility</h3>
            <p>Credibility refers to the trustworthiness and reliability of the source. A credible source is one that
              is generally accurate and trustworthy, while a non-credible source is one that is often wrong or biased.
              The credibility of a source can be determined by its history, reputation, and the quality of its
              evidence.</p>
          </div>
          <ul class="legend">
            <li v-for="item in credibilityLegend" :key="item.label" class="legendItem border"
              :class="{ 'base-success': item.label === getCitationCredibility(cit.quality?.sourceReliability || 0) }">
              <Icon :name="item.icon" class="icon" size="20" />
              <div>
                <p><span>{{ item.label }}</span></p>
                <p class="caption">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </CitationIcon>

      <CitationChip :source="cit" />
    </div>
  </div>
</template>

<style>
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
  list-style: none;
  padding: 0;
  margin: 0;
}

li.legendItem {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);

  background-color: var(--base-10);
  color: var(--base-120);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
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
  gap: var(--space-2);
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
