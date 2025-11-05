<script setup lang="ts">
import { getCitationCredibility } from '../../../types/res'
import type { Citation, CitationDistance, CitationReliance, CitationCredibility } from '../../../types/res'
import CitationIcon from '../CitationIcon.vue';

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
  points: number,
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

const distanceLegend: {
  label: CitationDistance
  description: string
  points: number,
  icon: string
}[] = [
    {
      label: 'primary',
      description: 'The source is the original source of the information.',
      points: 50,
      icon: 'carbon:sight',
    },
    {
      label: 'secondary',
      description: 'The source cites another source for the information.',
      points: 0,
      icon: 'carbon:need',
    },
    {
      label: 'hearsay',
      description: 'The source is not directly related to the information.',
      points: -100,
      icon: 'carbon:chat-bot',
    },
  ]

const credibilityLegend: {
  label: CitationCredibility
  description: string
  points: number,
  icon: string
}[] = [
    {
      label: 'gold-standard',
      description: 'The source is the highest quality and most reliable available.',
      points: 100,
      icon: 'carbon:trophy',
    },
    {
      label: 'authoritative',
      description: 'The source is widely accepted as a definitive reference.',
      points: 80,
      icon: 'carbon:3d-software',
    },
    {
      label: 'expert',
      description: 'The source is written by a recognized expert in the field.',
      points: 60,
      icon: 'carbon:star',
    },
    {
      label: 'reliable',
      description: 'The source is generally accurate and trustworthy.',
      points: 40,
      icon: 'carbon:checkmark',
    },
    {
      label: 'questionable',
      description: 'The source is not well known or is often wrong.',
      points: 20,
      icon: 'carbon:help',
    },
    {
      label: 'unreliable',
      description: 'The source has a history of being wrong or biased.',
      points: 0,
      icon: 'carbon:error',
    },
    {
      label: 'discredited',
      description: 'The source actively lies or distorts the truth.',
      points: -100,
      icon: 'carbon:warning-alt',
    },
  ]


function getNumber(val: number) {
  // if number is positive add + sign
  return val > 0 ? `+${val}` : `${val}`
}


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
            <li v-for="item in distanceLegend" :key="item.label" class="LegendItem"
              :class="{ 'base-success': item.label === cit.distance }">
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
            <li v-for="item in credibilityLegend" :key="item.label" class="LegendItem"
              :class="{ 'base-success': item.label === getCitationCredibility(((cit.quality?.sourceReliability || 0) + (cit.quality?.evidenceStrength || 0)) / 2) }">
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

      <CitationChip :source="cit" />
    </div>
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
