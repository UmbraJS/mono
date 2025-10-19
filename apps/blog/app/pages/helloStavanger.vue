<script setup lang="ts">
import { ref } from 'vue';
import type { Component } from 'vue';
import { useSlideNavigation } from '../composables/useSlideNavigation';

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
import TokenAnatomy from '../components/halloSlides/TokenAnatomy.vue';
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
import SlideProgress from '../components/SlideProgress.vue';
import ItsMeMario from '../components/halloSlides/Me.vue';
import UmbraApplied from '../components/halloSlides/UmbraApplied.vue';

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
import simpleUmbra from "../../public/simpleUmbra.png";
import umbraExecute from "../../public/umbraExecute.png";
import umbraInsights from "../../public/umbraInsight.png";
import UmbraAppliedToElement from '../components/halloSlides/UmbraAppliedToElement.vue';

interface SlideConfig {
  component: Component; // Vue component
  props: Record<string, unknown>; // Static props
  range?: number; // How many slides this component spans (defaults to 1)
  dynamicProps?: (slideWithinRange: number) => Record<string, unknown>; // Function to generate dynamic props based on slide number within the range
}

// Slide configuration - easy to maintain and extend
const actOneSlideConfig: SlideConfig[] = [
  { component: ItsMeMario, props: {} },
  { component: Intro, props: {} },
  { component: RoundedTokens, props: { class: 'SamSlide' } },
  { component: Trinity, props: { class: 'SamSlide' } },
  { component: Eden, props: { class: 'SamSlide' }, range: 8, dynamicProps: (slideWithinRange: number) => ({ stage: slideWithinRange }) },
  { component: ThatsTheWebFolks, props: { class: 'SamSlide' } },
  { component: PersonalSpaceTokens, props: { class: 'SamSlide' } },
  // { component: SpaceTokens, props: { class: 'SamSlide' } },
  { component: NotesBetweenNotes, props: { class: 'SamSlide' } },
  // { component: ColorIsAll, props: { class: 'SamSlide' } },
];

const actTwoSlideConfig: SlideConfig[] = [
  { component: ActTwoIntro, props: {} },
  // { component: ElementSpecificTokens, props: { class: 'SamSlide' } },
  { component: TokenAnatomy, props: { class: 'SamSlide' } },
  { component: ElementSpecificTokensExpanded, props: { class: 'SamSlide' } },
  { component: ElementSpecificTokensProblem1, props: { class: 'SamSlide' } },
  // { component: UmbraAppliedToElement, props: { class: 'SamSlide' } },
  { component: Gallery, props: { class: 'SamSlide' } },
  { component: BGFGRange, props: { class: 'SamSlide' } },
  // { component: AliasedBGFGRange, props: { class: 'SamSlide' } },
  // { component: MaterialColors, props: { class: 'SamSlide' } },
  { component: TailwindTokens, props: { class: 'SamSlide' } },
  { component: RadixColors, props: { class: 'SamSlide' } },
  { component: UmbraRange, props: { class: 'SamSlide', simple: true } },
  { component: SingleRangePage, props: { class: 'SamSlide' } },
  { component: Gallery, props: { class: 'SamSlide', grayscale: true } },
  { component: ThatsTheWebFolks, props: { class: 'SamSlide' } },
  // { component: ColourReassignment, props: { class: 'SamSlide' } },
  { component: UmbraRanges, props: { class: 'SamSlide' } },
];

const actThreeSlideConfig: SlideConfig[] = [
  { component: ActThreeIntro, props: {} },
  { component: ManualRangeEdit, props: { class: 'SamSlide' } },
  { component: EditUmbra, props: { class: 'SamSlide' } },
  { component: UmbraApplied, props: { class: 'SamSlide' } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: queryAboutImages } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: wcag } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: localisedColors } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: localisedColors2 } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: APCA } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: colorGammut } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: APCAFormula } },
  { component: ImageIllustration, props: { class: 'SamSlide', url: wcagVsAPCA } },
  // { component: ImageIllustration, props: { class: 'SamSlide', url: simpleUmbra } },
  // { component: ImageIllustration, props: { class: 'SamSlide', url: umbraExecute } },
  // { component: ImageIllustration, props: { class: 'SamSlide', url: umbraInsights } },
  // { component: ImageIllustration, props: { class: 'SamSlide', url: umbraControl } },
  { component: UmbraRange, props: { class: 'SamSlide', simple: true } },
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
];

const actConfigs = [actOneSlideConfig, actTwoSlideConfig, actThreeSlideConfig];

// Presentation timing configuration
const practiceMode = ref(true); // Toggle this for practice vs live mode
const targetDateTime = "2025-10-23T11:35:00"; // Your presentation end time

// Use the slide navigation composable
const {
  act,
  slide,
  slidesInThisAct,
  currentSlideConfig,
  currentSlideProps
} = useSlideNavigation({ actConfigs, pages });
</script>

<template>
  <!-- Dynamic component rendering based on current slide -->
  <component :is="currentSlideConfig.component" v-if="currentSlideConfig" v-bind="currentSlideProps" />

  <!-- <SlideProgress v-model:practice-mode="practiceMode" :act="act" :slide="slide" :total-acts="pages.length"
    :slides-in-current-act="slidesInThisAct" :target-date-time="targetDateTime" /> -->

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
  /* --paragraph: 2rem; */
}

.SamSlide p.display {
  line-height: 1.6;
  font-size: clamp(14px, 4vw, 30px);
}

.EmojiPanel {
  position: fixed;
  bottom: var(--space-3);
  left: var(--space-3);
  width: 300px;
  z-index: 100;
}
</style>
