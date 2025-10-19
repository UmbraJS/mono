<script setup lang="ts">
import { useSplinePath } from '../../composables/useSpline'
import DyePicker from '../DyePicker.vue';
import { swatch } from "@umbrajs/core";

// Template refs for spline connections
const buttonElement = ref<HTMLElement | null>(null)
const textElement = ref<HTMLElement | null>(null)
const buttonLabelElement = ref<HTMLElement | null>(null)
const textLabelElement = ref<HTMLElement | null>(null)

const splineHook1 = ref<HTMLElement | null>(null)
const splineHook2 = ref<HTMLElement | null>(null)

const splineHook1End = ref<HTMLElement | null>(null)
const splineHook2End = ref<HTMLElement | null>(null)

// SVG container ref for relative positioning
const svgContainer = ref<HTMLElement | null>(null)

// Splines for visual annotations
const buttonSpline = useSplinePath({
  start: splineHook1End,
  end: splineHook1,
  color: 'var(--accent-text)',
  stroke: 2,
  angle: -90,
  endTension: 6,
  startTension: 6,
  svgContainer,
})

const textSpline = useSplinePath({
  start: splineHook2End,
  end: splineHook2,
  color: 'var(--accent-text)',
  stroke: 2,
  angle: 90,
  endTension: 6,
  startTension: 6,
  svgContainer,
})
</script>

<template>
  <div class="TheseSpacingTokens">
    <div class="ProblemWrapper">
      <button ref="buttonElement" class="myTargetButton base-accent">
        <span ref="splineHook1" class="SplineHook1"></span>
        <p ref="textElement" class="target-text">
          <span ref="splineHook2" class="SplineHook2"></span>
          <span>click me</span>
        </p>
      </button>

      <!-- Token annotations -->
      <div class="annotations">
        <div ref="buttonLabelElement" class="token-label button-label border">
          <div>
            <p><span class="token-name">--accent-20</span></p>
          </div>
          <span ref="splineHook1End" class="SplineHook1End"></span>
        </div>

        <div ref="textLabelElement" class="token-label text-label border">
          <div>
            <p><span class="token-name">--accent-120</span></p>
          </div>
          <span ref="splineHook2End" class="SplineHook2End">
          </span>
        </div>
      </div>
    </div>

    <!-- SVG for splines -->
    <svg ref="svgContainer" class="spline-overlay" width="100%" height="100%">
      <path :d="buttonSpline.d.value" :stroke="buttonSpline.color" :stroke-width="buttonSpline.stroke" fill="none"
        stroke-linecap="round" />
      <path :d="textSpline.d.value" :stroke="textSpline.color" :stroke-width="textSpline.stroke" fill="none"
        stroke-linecap="round" />
    </svg>
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

.TheseSpacingTokens {
  position: relative;
  min-height: 400px;
  width: 100%;
  padding: 2rem;
}

.ProblemWrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.myTargetButton {
  position: relative;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  background-color: var(--base-20);
  transition: background-color 0.2s ease;
  border-radius: var(--radius);
  border: var(--border-size) solid var(--base-60);
}

.target-text {
  position: relative;
  margin: 0;
  color: var(--base-120);
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
  display: flex;
  position: absolute;
  gap: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-1);
  font-family: 'Monaco', 'Consolas', monospace;
  pointer-events: auto;
}

.button-label {
  top: -10px;
  left: 100px;
}

.text-label {
  bottom: -20px;
  right: 40px;
}

.token-name {
  display: block;
  font-weight: bold;
  width: max-content;
}

.token-value {
  display: block;
  color: var(--base-80);
  font-size: 10px;
}

.spline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
