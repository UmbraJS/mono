<script setup lang="ts">
import type { Citation } from '../../../types/res'
import { getCitationCredibility, aggregatedCitationCredibility, bucketCredibility } from '../../../types/res'

const {
  image = 'https://pbs.twimg.com/media/Gzc2p7BWUAA2kER?format=jpg&name=4096x4096',
  mood = 'neutral',
  type = 'premise',
  claims = [{
    description: 'The earth is round.',
    validity: 0.9,
    sources: [
      {
        id: 'wikipedia',
        link: 'https://en.wikipedia.org/wiki/Mahatma_Gandhi#Early_life_and_education',
        quote: "Gandhi was known to carry a pistol for self-defense during his time in South Africa.",
        authors: ['Wikipedia contributors'],
        publication: 'Wikipedia',
        linkBroken: false,
        credibility: 0.7,
        reliance: 'deductive',
        distance: 'primary',
      }, {
        id: 'history',
        link: 'https://www.history.com/news/mahatma-gandhi-assassination-india',
        quote: "Gandhi carried a pistol for self-defense during his time in South Africa, where he faced racial discrimination and threats to his safety.",
        authors: ['History.com Editors'],
        publication: 'History.com',
        linkBroken: true,
        credibility: 0.8,
        reliance: 'inductive',
        distance: 'secondary',
      }
    ],
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

const sources = computed(() => {
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
            {{ bucketCredibility(aggregatedCitationCredibility(sources)) }}
          </span>
        </p>
        <p class="FrameMetaChip caption">credibility:
          <span>
            {{ bucketCredibility(aggregatedCitationCredibility(sources)) }}
          </span>
        </p>
        <p class="FrameMetaChip caption">sources:
          <span>{{ sources.length }}</span>
        </p>
      </div>
      <p>
        <slot name="description" mdc-unwrap="p" />
      </p>
      <div class="Citations">
        <a v-for="source in sources" :key="source.link" class="CitationChip" :href="source.link" target="_blank"
          rel="noopener">
          <p class="caption">
            {{ source.publication }}:
            <span>{{ getCitationCredibility(source.credibility) }}</span>
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.Arrow {
  color: var(--base-text);
  transition: var(--time);
}

.open .Arrow {
  transform: rotate(180deg);
}

.Bookmark {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background-color: var(--base-80);
  z-index: 1;
  cursor: pointer;
  transition: var(--time);
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

a.CitationChip {
  color: var(--base-120);
  background-color: var(--base-20);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  transition: var(--time);
}

a.CitationChip:hover {
  background-color: var(--base-10);
  color: var(--base-100);
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
  transition: var(--time);
  padding: var(--space-4) 0px;
  padding-bottom: var(--space-3);
}

.NarrativeFrame header:hover {
  color: var(--base-120);
}

.NarrativeFrame header:hover p {
  transform: scale(1.1);
  transition: var(--time);
}

.NarrativeFrame header p {
  transform: scale(1);
  z-index: 1;
  transition: var(--slower);
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
  padding-bottom: var(--space-3);
  background-color: var(--base-10);
  opacity: 1;

  overflow: hidden;
  transition: var(--slower);
}

.NarrativeFrame header:hover img {
  filter: blur(4px);
  transform: scale(1.1) translateY(-5px);
  transition: var(--time);
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
  transition: var(--slower);
}
</style>
