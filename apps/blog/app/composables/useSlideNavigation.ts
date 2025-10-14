import { ref, computed, watch, onMounted } from 'vue';
import { onKeyStroke, useRefHistory } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import type { Component } from 'vue';

interface SlideConfig {
  component: Component;
  props: Record<string, unknown>;
  range?: number;
  dynamicProps?: (slideWithinRange: number) => Record<string, unknown>;
}

interface PageConfig {
  name: string;
  slides: number;
}

interface UseSlideNavigationOptions {
  actConfigs: SlideConfig[][];
  pages: PageConfig[];
}

export function useSlideNavigation({ actConfigs, pages }: UseSlideNavigationOptions) {
  const route = useRoute();
  const router = useRouter();

  const act = ref(1);
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
  });

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
    const configArray = actConfigs[act.value - 1];
    if (!configArray) return null;
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

  // Navigation functions
  const nextSlide = () => {
    slide.value++;
    if (slide.value > slidesInThisAct.value) {
      slide.value = slidesInThisAct.value;
      act.value++;
      slide.value = 1;
    }
    if (act.value > pages.length) act.value = pages.length;
    updateURL();
  };

  const previousSlide = () => {
    if (slide.value === 1 && act.value === 1) return;
    slide.value--;
    if (slide.value < 1) {
      act.value--;
      slide.value = pages[act.value - 1]?.slides || 1;
    }
    updateURL();
  };

  // Keyboard navigation
  onKeyStroke('ArrowRight', nextSlide);
  onKeyStroke('ArrowLeft', previousSlide);

  return {
    // State
    act,
    slide,
    slidesInThisAct,
    slideHistory,
    lastSlide,

    // Computed
    currentSlideConfig,
    currentSlideProps,

    // Methods
    nextSlide,
    previousSlide,
    updateURL
  };
}
