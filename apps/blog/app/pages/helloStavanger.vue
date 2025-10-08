<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Component } from 'vue';
import { onKeyStroke, useRefHistory } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';

import RoundedTokens from '../components/halloSlides/RoundedTokens.vue';
import Trinity from '../components/halloSlides/Trinity.vue';
import Eden from '../components/halloSlides/Eden.vue';
import Intro from '../components/halloSlides/ActOneIntro.vue';
import LiveEmojiPanel from '../components/Chat/LiveEmojiPanel.vue';
import ThatsTheWebFolks from '../components/halloSlides/ThatsTheWebFolks.vue';
import PersonalSpaceTokens from '../components/halloSlides/PersonalSpaceTokens.vue';
import SpaceTokens from '../components/halloSlides/SpaceTokens.vue';
import NotesBetweenNotes from '../components/halloSlides/NotesBetweenNotes.vue';
import ColorIsAll from '../components/halloSlides/ColorIsAll.vue';
import ActTwoIntro from '../components/halloSlides/ActTwoIntro.vue';
import ElementSpecificTokens from '../components/halloSlides/ElementSpecificTokens.vue';
import ElementSpecificTokensExpanded from '../components/halloSlides/ElementSpecificTokensExpanded.vue';
import ElementSpecificTokensProblem1 from '../components/halloSlides/ElementSpecificTokensProblem1.vue';

interface SlideConfig {
  component: Component; // Vue component
  props: Record<string, any>; // Static props
  range: [number, number]; // Slide range [start, end]
  dynamicProps?: (slide: number) => Record<string, any>; // Function to generate dynamic props based on slide number
}

// Slide configuration - easy to maintain and extend
const actOneSlideConfig: SlideConfig[] = [
  { component: Intro, props: {}, range: [1, 1] as [number, number] },
  { component: RoundedTokens, props: { class: 'SamSlide' }, range: [2, 2] as [number, number] },
  { component: Trinity, props: { class: 'SamSlide' }, range: [3, 3] as [number, number] },
  { component: Eden, props: { class: 'SamSlide' }, range: [4, 11] as [number, number], dynamicProps: (slide: number) => ({ stage: slide - 3 }) },
  { component: PersonalSpaceTokens, props: { class: 'SamSlide' }, range: [13, 13] as [number, number] },
  { component: SpaceTokens, props: { class: 'SamSlide' }, range: [14, 14] as [number, number] },
  { component: ThatsTheWebFolks, props: { class: 'SamSlide' }, range: [12, 12] as [number, number] },
  { component: NotesBetweenNotes, props: { class: 'SamSlide' }, range: [15, 15] as [number, number] },
  { component: ColorIsAll, props: { class: 'SamSlide' }, range: [16, 16] as [number, number] },
];

const actTwoSlideConfig: SlideConfig[] = [
  { component: ActTwoIntro, props: {}, range: [1, 1] as [number, number] },
  { component: ElementSpecificTokens, props: { class: 'SamSlide' }, range: [2, 2] as [number, number] },
  { component: ElementSpecificTokensExpanded, props: { class: 'SamSlide' }, range: [3, 3] as [number, number] },
  { component: ElementSpecificTokensProblem1, props: { class: 'SamSlide' }, range: [4, 4] as [number, number] },
];

// Generate pages configuration from slide config
const totalSlidesInAct1 = Math.max(...actOneSlideConfig.map(s => s.range[1]));
const totalSlidesInAct2 = Math.max(...actTwoSlideConfig.map(s => s.range[1]));
const pages = [
  { name: "act1", slides: totalSlidesInAct1 },
  { name: "act2", slides: totalSlidesInAct2 },
  { name: "act3", slides: 0 },
]

const route = useRoute();
const router = useRouter();

const act = ref(1)
const slide = ref(1);

// Function to update URL with current act and slide
const updateURL = () => {
  router.push({
    query: {
      ...route.query,
      act: act.value.toString(),
      slide: slide.value.toString()
    }
  });
};

// Initialize from URL parameters
onMounted(() => {
  const urlAct = parseInt(route.query.act as string) || 1;
  const urlSlide = parseInt(route.query.slide as string) || 1;

  // Validate that the act and slide are within valid ranges
  if (urlAct >= 1 && urlAct <= pages.length) {
    act.value = urlAct;
    const maxSlidesInAct = pages[urlAct - 1]?.slides || 1;
    if (urlSlide >= 1 && urlSlide <= maxSlidesInAct) {
      slide.value = urlSlide;
    }
  }
});

// Watch for URL changes (browser back/forward)
watch(() => route.query, (newQuery) => {
  const urlAct = parseInt(newQuery.act as string) || 1;
  const urlSlide = parseInt(newQuery.slide as string) || 1;

  // Validate and update if different from current values
  if (urlAct >= 1 && urlAct <= pages.length && urlAct !== act.value) {
    act.value = urlAct;
  }

  const maxSlidesInAct = pages[act.value - 1]?.slides || 1;
  if (urlSlide >= 1 && urlSlide <= maxSlidesInAct && urlSlide !== slide.value) {
    slide.value = urlSlide;
  }
}, { deep: true });

const slidesInThisAct = computed(() => {
  return pages[act.value - 1]?.slides || 1;
})

const slideHistory = useRefHistory(slide);

const lastSlide = computed(() => {
  return slideHistory.history.value[slideHistory.history.value.length - 2] || 1;
});

// Find the current slide configuration
const currentSlideConfig = computed(() => {
  const configArray = act.value === 1 ? actOneSlideConfig : act.value === 2 ? actTwoSlideConfig : [];
  return configArray.find(config => {
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
    slide.value = 1;
  }
  if (act.value > pages.length) act.value = pages.length;
  updateURL();
});

onKeyStroke('ArrowLeft', () => {
  if (slide.value === 1 && act.value === 1) return;
  slide.value--;
  if (slide.value < 1) {
    act.value--;
    slide.value = pages[act.value - 1]?.slides || 1;
  }
  updateURL();
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
