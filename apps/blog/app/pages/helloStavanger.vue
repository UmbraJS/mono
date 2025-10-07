<script setup lang="ts">
import { ref, computed } from 'vue';
import { onKeyStroke, useRefHistory } from '@vueuse/core';
import RoundedTokens from '../components/halloSlides/RoundedTokens.vue';
import Trinity from '../components/halloSlides/Trinity.vue';
import Eden from '../components/halloSlides/Eden.vue';
import Intro from '../components/halloSlides/Intro.vue';
import LiveEmojiPanel from '../components/Chat/LiveEmojiPanel.vue';
import ThatsTheWebFolks from '../components/halloSlides/ThatsTheWebFolks.vue';
import PersonalSpaceTokens from '../components/halloSlides/PersonalSpaceTokens.vue';
import SpaceTokens from '../components/halloSlides/SpaceTokens.vue';
import NotesBetweenNotes from '../components/halloSlides/NotesBetweenNotes.vue';

// Slide configuration - easy to maintain and extend
const slideConfig = [
  { component: Intro, props: {}, range: [1, 1] as [number, number] },
  { component: RoundedTokens, props: { class: 'SamSlide' }, range: [2, 2] as [number, number] },
  { component: Trinity, props: { class: 'SamSlide' }, range: [3, 3] as [number, number] },
  { component: Eden, props: { class: 'SamSlide' }, range: [4, 11] as [number, number], dynamicProps: (slide: number) => ({ stage: slide - 3 }) },
  { component: ThatsTheWebFolks, props: { class: 'SamSlide' }, range: [12, 12] as [number, number] },
  { component: PersonalSpaceTokens, props: { class: 'SamSlide' }, range: [13, 13] as [number, number] },
  { component: SpaceTokens, props: { class: 'SamSlide' }, range: [14, 14] as [number, number] },
  { component: NotesBetweenNotes, props: { class: 'SamSlide' }, range: [15, 15] as [number, number] },
];

// Generate pages configuration from slide config
const totalSlidesInAct1 = Math.max(...slideConfig.map(s => s.range[1]));
const pages = [
  { name: "act1", slides: totalSlidesInAct1 },
  { name: "act2", slides: 8 },
  { name: "act3", slides: 5 },
]

const act = ref(1)
const slide = ref(1);

const slidesInThisAct = computed(() => {
  return pages[act.value - 1]?.slides || 1;
})

const slideHistory = useRefHistory(slide);

const lastSlide = computed(() => {
  return slideHistory.history.value[slideHistory.history.value.length - 2] || 1;
});

// Find the current slide configuration
const currentSlideConfig = computed(() => {
  return slideConfig.find(config => {
    const [start, end] = config.range;
    return slide.value >= start && slide.value <= end;
  });
});

// Get the component props for the current slide
const currentSlideProps = computed(() => {
  const config = currentSlideConfig.value;
  if (!config) return {};

  let props = { ...config.props };

  // Add dynamic props if they exist
  if (config.dynamicProps) {
    props = { ...props, ...config.dynamicProps(slide.value) };
  }

  return props;
});

onKeyStroke('ArrowRight', () => {
  slide.value++;
  if (slide.value > slidesInThisAct.value) {
    slide.value = slidesInThisAct.value;
    act.value++;
  }
  if (act.value > pages.length) act.value = pages.length;
});

onKeyStroke('ArrowLeft', () => {
  if (slide.value === 1 && act.value === 1) return;
  slide.value--;
  if (slide.value < 1) {
    act.value--;
    slide.value = pages[act.value - 1]?.slides || 1;
  }
});
</script>

<template>
  <!-- Dynamic component rendering based on current slide -->
  <component :is="currentSlideConfig.component" v-if="currentSlideConfig" v-bind="currentSlideProps" />

  <div class="SlidePage">
    <p>{{ act }} / {{ pages.length }}</p>
    <p class="display">
      {{ slide }} / {{ slidesInThisAct }}
    </p>
  </div>

  <!-- <div class="EmojiPanel">
    <LiveEmojiPanel />
  </div> -->
</template>

<style>
.SamSlide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.SlidePage {
  position: absolute;
  bottom: var(--space-7);
  right: var(--space-3);
}

.EmojiPanel {
  position: fixed;
  bottom: var(--space-3);
  left: var(--space-3);
  width: 300px;
  z-index: 100;
}
</style>
