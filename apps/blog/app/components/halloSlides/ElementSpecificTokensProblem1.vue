<script setup lang="ts">
import { useSplinePath } from '../../composables/useSpline'
import DyePicker from '../DyePicker.vue';

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

// Template refs for spline connections
const buttonElement = ref<HTMLElement | null>(null)
const textElement = ref<HTMLElement | null>(null)
const buttonLabelElement = ref<HTMLElement | null>(null)
const textLabelElement = ref<HTMLElement | null>(null)

const splineHook1 = ref<HTMLElement | null>(null)
const splineHook2 = ref<HTMLElement | null>(null)

const splineHook1End = ref<HTMLElement | null>(null)
const splineHook2End = ref<HTMLElement | null>(null)

// Splines for visual annotations
const buttonSpline = useSplinePath({
  start: splineHook1End,
  end: splineHook1,
  color: 'var(--accent-text)',
  stroke: 2,
  angle: -90,
  endTension: 3,
  startTension: 3,
})

const textSpline = useSplinePath({
  start: splineHook2End,
  end: splineHook2,
  color: 'var(--accent-text)',
  stroke: 2,
  angle: 90,
  endTension: 3,
  startTension: 3,
})
</script>

<template>
  <div class="SpacingTokens" :style="spaceTokenStyleObject">
    <div class="ProblemWrapper">
      <button ref="buttonElement" class="target-button">
        <span ref="splineHook1" class="SplineHook1"></span>
        <p ref="textElement" class="target-text">
          <span ref="splineHook2" class="SplineHook2"></span>
          <span>warning</span>
        </p>
      </button>

      <!-- Token annotations -->
      <div class="annotations">
        <div ref="buttonLabelElement" class="token-label button-label border">
          <DyePicker />
          <span class="token-name">interactive_warning__resting</span>
          <span class="token-value">{{spaceTokens.find(t => t.name === '--interactive_warning__resting')?.value ||
            'rgba(255, 146, 0, 1)'}}</span>
          <span ref="splineHook1End" class="SplineHook1End"></span>
        </div>

        <div ref="textLabelElement" class="token-label text-label border">
          <span class="token-name">interactive_warning__text</span>
          <span class="token-value">{{spaceTokens.find(t => t.name === '--interactive_warning__text')?.value ||
            'rgba(173, 98, 0, 1)'}}</span>
          <span ref="splineHook2End" class="SplineHook2End">
          </span>
        </div>
      </div>
    </div>

    <!-- SVG for splines -->
    <Teleport to="body">
      <svg class="spline-overlay" width="100%" height="100%">
        <path :d="buttonSpline.d.value" :stroke="buttonSpline.color" :stroke-width="buttonSpline.stroke" fill="none"
          stroke-linecap="round" />
        <path :d="textSpline.d.value" :stroke="textSpline.color" :stroke-width="textSpline.stroke" fill="none"
          stroke-linecap="round" />
      </svg>
    </Teleport>
  </div>
</template>

<style scoped>
.SplineHook1,
.SplineHook2,
.SplineHook1End,
.SplineHook2End {
  background-color: var(--accent-text);
  height: 5px;
  width: 5px;
  position: absolute;
  border-radius: 100%;
}

.SplineHook1 {
  top: 0px;
  transform: translateY(100%);
}

.SplineHook2 {
  bottom: 0px;
  transform: translateY(-50%) translateX(250%);
}

.SplineHook1End {
  bottom: 0px;
  transform: translateY(50%);
}

.SplineHook2End {
  top: 0px;
  transform: translateY(-50%);
}


.SpacingTokens {
  position: relative;
  min-height: 400px;
  padding: 2rem;
}

.ProblemWrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.target-button {
  position: relative;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  background-color: var(--interactive_warning__resting);
  transition: background-color 0.2s ease;
}

.target-text {
  position: relative;
  margin: 0;
  color: var(--interactive_warning__text);
  font-weight: 900;
  font-size: 16px;
}

.annotations {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.token-label {
  position: absolute;
  background: var(--base-10);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-family: 'Monaco', 'Consolas', monospace;
  pointer-events: auto;
}

.button-label {
  top: 20px;
  left: 20px;
}

.text-label {
  bottom: 20px;
  right: 20px;
}

.token-name {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.token-value {
  display: block;
  opacity: 0.7;
  font-size: 10px;
}

.spline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}
</style>
