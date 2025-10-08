<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';
import { ScrollArea } from "umbraco";

const exampleRefs = ref<HTMLElement[]>([]);

onMounted(() => {
  gsap.fromTo(
    exampleRefs.value,
    {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 0
    },
    {
      scale: 1,
      x: (index) => index * 50,
      y: (index) => index * 50,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1
    }
  );
});

const spaceTokens = [
  { name: "--text__static_icons__default", value: "rgba(61, 61, 61, 1)" },
  { name: "--text__static_icons__secondary", value: "rgba(86, 86, 86, 1)" },
  { name: "--text__static_icons__tertiary", value: "rgba(111, 111, 111, 1)" },
  { name: "--text__static_icons__primary_white", value: "rgba(255, 255, 255, 1)" },
  { name: "--ui_background__default", value: "rgba(255, 255, 255, 1)" },
  { name: "--ui_background__semitransparent", value: "rgba(255, 255, 255, 0.2)" },
  { name: "--ui_background__light", value: "rgba(247, 247, 247, 1)" },
  { name: "--ui_background__scrim", value: "rgba(0, 0, 0, 0.4)" },
  { name: "--ui_background__overlay", value: "rgba(0, 0, 0, 0.8)" },
  { name: "--ui_background__medium", value: "rgba(220, 220, 220, 1)" },
  { name: "--ui_background__info", value: "rgba(213, 234, 244, 1)" },
  { name: "--ui_background__warning", value: "rgba(255, 231, 214, 1)" },
  { name: "--ui_background__danger", value: "rgba(255, 193, 193, 1)" },
  { name: "--logo__fill_positive", value: "rgba(235, 0, 55, 1)" },
  { name: "--logo__fill_negative", value: "rgba(255, 255, 255, 1)" },
  { name: "--interactive_primary__selected_highlight", value: "rgba(230, 250, 236, 1)" },
  { name: "--interactive_primary__selected_hover", value: "rgba(195, 243, 210, 1)" },
  { name: "--interactive_primary__resting", value: "rgba(0, 112, 121, 1)" },
  { name: "--interactive_primary__hover", value: "rgba(0, 79, 85, 1)" },
  { name: "--interactive_primary__hover_alt", value: "rgba(222, 237, 238, 1)" },
  { name: "--interactive_secondary__highlight", value: "rgba(213, 234, 244, 1)" },
  { name: "--interactive_secondary__resting", value: "rgba(36, 55, 70, 1)" },
  { name: "--interactive_secondary__link_hover", value: "rgba(23, 36, 47, 1)" },
  { name: "--interactive_danger__highlight", value: "rgba(255, 193, 193, 1)" },
  { name: "--interactive_danger__resting", value: "rgba(235, 0, 0, 1)" },
  { name: "--interactive_danger__hover", value: "rgba(179, 13, 47, 1)" },
  { name: "--interactive_danger__text", value: "rgba(179, 13, 47, 1)" },
  { name: "--interactive_warning__highlight", value: "rgba(255, 231, 214, 1)" },
  { name: "--interactive_warning__resting", value: "rgba(255, 146, 0, 1)" },
  { name: "--interactive_warning__hover", value: "rgba(173, 98, 0, 1)" },
  { name: "--interactive_warning__text", value: "rgba(173, 98, 0, 1)" },
  { name: "--interactive_success__highlight", value: "rgba(230, 250, 236, 1)" },
  { name: "--interactive_success__resting", value: "rgba(75, 183, 72, 1)" },
  { name: "--interactive_success__hover", value: "rgba(53, 129, 50, 1)" },
  { name: "--interactive_success__text", value: "rgba(53, 129, 50, 1)" },
  { name: "--interactive_table__cell__fill_resting", value: "rgba(255, 255, 255, 1)" },
  { name: "--interactive_table__cell__fill_hover", value: "rgba(234, 234, 234, 1)" },
  { name: "--interactive_table__cell__fill_activated", value: "rgba(230, 250, 236, 1)" },
  { name: "--interactive_table__header__fill_activated", value: "rgba(234, 234, 234, 1)" },
  { name: "--interactive_table__header__fill_hover", value: "rgba(220, 220, 220, 1)" },
  { name: "--interactive_table__header__fill_resting", value: "rgba(247, 247, 247, 1)" },
  { name: "--interactive__disabled__text", value: "rgba(190, 190, 190, 1)" },
  { name: "--interactive__text_highlight", value: "rgba(213, 234, 244, 1)" },
  { name: "--interactive__focus", value: "rgba(0, 112, 121, 1)" },
  { name: "--interactive__disabled__border", value: "rgba(220, 220, 220, 1)" },
  { name: "--interactive__disabled__fill", value: "rgba(234, 234, 234, 1)" },
  { name: "--interactive__link_on_interactive_colors", value: "rgba(255, 255, 255, 1)" },
  { name: "--interactive__icon_on_interactive_colors", value: "rgba(255, 255, 255, 1)" },
  { name: "--interactive__link_in_snackbars", value: "rgba(151, 202, 206, 1)" },
  { name: "--interactive__pressed_overlay_dark", value: "rgba(0, 0, 0, 0.2)" },
  { name: "--interactive__pressed_overlay_light", value: "rgba(255, 255, 255, 0.2)" },
  { name: '--table__cell_header_color', value: 'var(--text__static_icons__default)' },
  { name: '--table__cell_text_color', value: 'var(--text__static_icons__default)' },
  { name: '--table__cell_text_bold_color', value: 'var(--text__static_icons__default)' },
  { name: '--table__cell_text_link_color', value: 'var(--text__static_icons__default)' },
  { name: '--table__cell_numeric_monospaced_color', value: 'var(--text__static_icons__default)' }
];

const spaceTokenStyleObject = computed(() => {
  const styleObject: Record<string, string> = {};
  spaceTokens.forEach(token => {
    styleObject[token.name] = token.value;
  });
  return styleObject;
});
</script>

<template>
  <div class="SpacingTokens" :style="spaceTokenStyleObject">
    <h3 class="SpacingTitle">
      Scaled up: 50+ tokens
    </h3>
    <p>Many duplicate colors under different names. No defined relationship between colors</p>
    <p></p>
    <ScrollArea class="ScrollArea">
      <div class="TokensTable">
        <div v-for="token in spaceTokens" :key="token.name" class="SpaceToken">
          <span class="TokenName">{{ token.name }}:</span>
          <span class="TokenValue">{{ token.value }};</span>
          <div class="Swatch border" :style="{ '--color': token.value }" />
        </div>
      </div>
    </ScrollArea>
  </div>
</template>

<style>
.SpacingTitle {
  color: var(--base-text);
}

.DummyParent {
  --height: 40vh;
  position: relative;
  padding: var(--space-4);
  border-radius: var(--radius);
  max-height: var(--height);
}

.ScrollArea {
  padding-right: var(--space-3);
}

.ScrollAreaScrollbar {
  --reduction: var(--space-4);
  transform: translateX(-4px);
  border-radius: var(--radius);
}

.SpaceToken {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: var(--space-2);
  align-items: center;
}

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.TokensTable {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: var(--space-1);
}

.TokenText {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0px var(--space-2);
  color: var(--base-50);
}

.TokenText span {
  color: var(--base-text);
}

.TokenName {
  color: var(--base-text);
  font-weight: 500;
}

.TokenValue {
  color: var(--base-50);
  font-family: monospace;
}

.Swatch {
  height: 1.8em;
  width: 1.8em;
  background-color: var(--color);
}
</style>
