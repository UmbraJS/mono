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
import UmbraRange from '../components/halloSlides/UmbraRange.vue';
import RadixColors from '../components/halloSlides/RadixColors.vue';
import UmbraRanges from '../components/halloSlides/UmbraRanges.vue';
import TailwindTokens from '../components/halloSlides/TailwindTokens.vue';
import Gallery from '../components/halloSlides/Gallery.vue';
import BGFGRange from '../components/halloSlides/BGFGRange.vue';
import MaterialColors from '../components/halloSlides/MaterialColors.vue';
import AliasedBGFGRange from '../components/halloSlides/AliasedBGFGRange.vue';
import SingleRangePage from '../components/halloSlides/SingleRangePage.vue';
import ColourReassignment from '../components/halloSlides/ColourReassignmen.vue';
import ActThreeIntro from '../components/halloSlides/ActThreeIntro.vue';
import TheEnd from '../components/halloSlides/TheEnd.vue';
import ManualRangeEdit from '../components/halloSlides/ManualRangeEdit.vue';
import EditUmbra from '../components/halloSlides/EditUmbra.vue';
import ImageIllustration from '../components/halloSlides/ImageIllustration.vue';
import SamSigningOff from '../components/halloSlides/SamSigningOff.vue';

//Images
import queryAboutImages from "../../public/query.png";
import wcag from "../../public/wcag.png";
import localisedColors from "../../public/localisedColor.png";
import localisedColors2 from "../../public/localisedColor2.png";
import APCA from "../../public/APCA.png";
import colorGammut from "../../public/colorGammut.avif";
import APCAFormula from "../../public/apcaFormula.png";
import umbraControl from "../../public/umbraControl.png";
import wcagVsAPCA from "../../public/wcagVsApca.png";

interface SlideConfig {
  component: Component; // Vue component
  props: Record<string, unknown>; // Static props
  range?: number; // How many slides this component spans (defaults to 1)
  dynamicProps?: (slideWithinRange: number) => Record<string, unknown>; // Function to generate dynamic props based on slide number within the range
}

// Slide configuration - easy to maintain and extend
const actOneSlideConfig: SlideConfig[] = [
  { component: Intro, props: {} },
  { component: RoundedTokens, props: { class: 'SamSlide' } },
  { component: Trinity, props: { class: 'SamSlide' } },
  { component: Eden, props: { class: 'SamSlide' }, range: 8, dynamicProps: (slideWithinRange: number) => ({ stage: slideWithinRange }) },
  { component: ThatsTheWebFolks, props: { class: 'SamSlide' } },
  { component: PersonalSpaceTokens, props: { class: 'SamSlide' } },
  { component: SpaceTokens, props: { class: 'SamSlide' } },
  { component: NotesBetweenNotes, props: { class: 'SamSlide' } },
  { component: ColorIsAll, props: { class: 'SamSlide' } },
];

const actTwoSlideConfig: SlideConfig[] = [
  { component: ActTwoIntro, props: {} },
  { component: ElementSpecificTokens, props: { class: 'SamSlide' } },
  { component: ElementSpecificTokensExpanded, props: { class: 'SamSlide' } },
  { component: ElementSpecificTokensProblem1, props: { class: 'SamSlide' } },
  { component: Gallery, props: { class: 'SamSlide' } },
  { component: BGFGRange, props: { class: 'SamSlide' } },
  { component: AliasedBGFGRange, props: { class: 'SamSlide' } },
  { component: MaterialColors, props: { class: 'SamSlide' } },
  { component: TailwindTokens, props: { class: 'SamSlide' } },
  { component: RadixColors, props: { class: 'SamSlide' } },
  { component: UmbraRange, props: { class: 'SamSlide' } },
  { component: SingleRangePage, props: { class: 'SamSlide' } },
  { component: ThatsTheWebFolks, props: { class: 'SamSlide' } },
  { component: ColourReassignment, props: { class: 'SamSlide' } },
  { component: UmbraRanges, props: { class: 'SamSlide' } },
];

const actThreeSlideConfig: SlideConfig[] = [
  { component: ActThreeIntro, props: {} },
  { component: ManualRangeEdit, props: { class: 'SamSlide' } },
  { component: EditUmbra, props: { class: 'SamSlide' } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: queryAboutImages } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: wcag } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: localisedColors } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: localisedColors2 } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: APCA } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: colorGammut } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: APCAFormula } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: wcagVsAPCA } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: umbraControl } },
  { component: UmbraRange, props: { class: 'SamSlide' } },
  { component: TheEnd, props: { class: 'SamSlide' } },
  { component: SamSigningOff, props: { class: 'SamSlide' } },
];

// Helper function to calculate total slides from slide config
const calculateTotalSlides = (config: SlideConfig[]): number => {
  return config.reduce((total, slide) => total + (slide.range || 1), 0);
};

// Generate pages configuration from slide config
const totalSlidesInAct1 = calculateTotalSlides(actOneSlideConfig);
const totalSlidesInAct2 = calculateTotalSlides(actTwoSlideConfig);
const totalSlidesInAct3 = calculateTotalSlides(actThreeSlideConfig);
const pages = [
  { name: "act1", slides: totalSlidesInAct1 },
  { name: "act2", slides: totalSlidesInAct2 },
  { name: "act3", slides: totalSlidesInAct3 },
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

// Helper function to find which slide config matches the current slide number
const findSlideConfig = (configArray: SlideConfig[], targetSlide: number): { config: SlideConfig; slideWithinRange: number } | null => {
  let currentSlidePosition = 1;

  for (const config of configArray) {
    const rangeSize = config.range || 1;
    const endPosition = currentSlidePosition + rangeSize - 1;

    if (targetSlide >= currentSlidePosition && targetSlide <= endPosition) {
      return {
        config,
        slideWithinRange: targetSlide - currentSlidePosition + 1
      };
    }

    currentSlidePosition += rangeSize;
  }

  return null;
};

// Find the current slide configuration
const currentSlideResult = computed(() => {
  const configArray = act.value === 1 ? actOneSlideConfig : act.value === 2 ? actTwoSlideConfig : actThreeSlideConfig;
  return findSlideConfig(configArray, slide.value);
});

const currentSlideConfig = computed(() => currentSlideResult.value?.config);

// Get the component props for the current slide
const currentSlideProps = computed(() => {
  const result = currentSlideResult.value;
  if (!result) return {};

  let props = { ...result.config.props };

  // Add dynamic props if they exist
  if (result.config.dynamicProps) {
    props = { ...props, ...result.config.dynamicProps(result.slideWithinRange) };
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
