<script setup lang="ts">
import type { UmbraRange, ValidationWarning } from '@umbrajs/core'
import TokenMeter from './TokeMeter.vue';

interface Props {
  ranges: UmbraRange[]
  warningsByRange: Map<string, ValidationWarning[]>
  expandedWarnings: Set<string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleWarnings: [rangeName: string]
}>()

function getTokenName(index: number) {
  return index * 10 + 10
}
</script>

<template>
  <div class="umbra-wrapper">
    <div class="range-grid">
      <div v-for="range in ranges" :key="range.name" class="ColorCard">

        <div class="card-header">
          <h3 class="color-name">{{ range.name }}</h3>
          <button v-if="warningsByRange.get(range.name)?.length" class="warning-indicator"
            :class="{ expanded: expandedWarnings.has(range.name) }" @click.stop="emit('toggleWarnings', range.name)"
            :title="`${warningsByRange.get(range.name)?.length} warning(s)`">
            <span class="warning-icon">⚠️</span>
            <span class="warning-count">{{ warningsByRange.get(range.name)?.length }}</span>
          </button>
        </div>

        <!-- Validation Warnings Section (Expandable) -->
        <div v-if="expandedWarnings.has(range.name) && warningsByRange.get(range.name)?.length"
          class="warnings-section">
          <div v-for="(warning, index) in warningsByRange.get(range.name)" :key="index" class="warning-item">
            <div class="warning-header">
              <span class="warning-severity" :class="warning.severity">{{ warning.severity }}</span>
              <span class="warning-type">{{ warning.type }}</span>
            </div>
            <p class="warning-message">{{ warning.message }}</p>
            <div v-if="warning.context" class="warning-context">
              <code>{{ JSON.stringify(warning.context, null, 2) }}</code>
            </div>
          </div>
        </div>

        <div class="card-content">
          <div class="tokens">
            <div class="caps color" :style="`--color: ${range.background.swatch.toHex()}`"></div>
            <div v-for="(color, index) in range.range" :key="index" class="color"
              :style="`--color: ${color.swatch.toHex()}`">
              <p class="token-label caption">{{ getTokenName(index) }}</p>
              <TokenMeter class="token-meter" :color="color.swatch" :previousColor="range.background.swatch">
              </TokenMeter>
            </div>
            <div class="caps color" :style="`--color: ${range.foreground.swatch.toHex()}`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.umbra-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.range-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-2);
  width: 100%;
  max-width: 1400px;
  justify-content: center;
  align-items: start;
}

.ColorCard {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--base-40);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--base);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ColorCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  background: var(--base-10);
  border-bottom: 1px solid var(--base-30);
}

.color-name {
  font-size: var(--font-size-3);
}

.warning-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.warning-indicator:hover {
  background: var(--warning-30);
  border-color: var(--warning-50);
}

.warning-indicator.expanded {
  background: var(--warning-40);
  border-color: var(--warning-60);
}

.warning-icon {
  font-size: var(--font-size-2);
}

.warning-count {
  color: var(--warning-text);
}

.warnings-section {
  padding: var(--space-3);
  background: var(--warning-10);
  border-bottom: 1px solid var(--base-30);
}

.warning-item {
  margin-bottom: var(--space-2);
}

.warning-item:last-child {
  margin-bottom: 0;
}

.warning-header {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  margin-bottom: var(--space-1);
}

.warning-severity {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-2);
  font-size: var(--font-size-1);
  font-weight: 600;
  text-transform: uppercase;
}

.warning-severity.error {
  background: var(--error-20);
  color: var(--error-text);
}

.warning-severity.warning {
  background: var(--warning-30);
  color: var(--warning-text);
}

.warning-severity.info {
  background: var(--info-20);
  color: var(--info-text);
}

.warning-type {
  font-size: var(--font-size-1);
  color: var(--base-80);
  font-weight: 500;
}

.warning-message {
  margin: 0 0 var(--space-1) 0;
  font-size: var(--font-size-2);
  color: var(--base-text);
  line-height: 1.4;
}

.warning-context {
  margin-top: var(--space-1);
}

.warning-context code {
  font-size: var(--font-size-1);
  background: var(--base-20);
  padding: var(--space-1);
  border-radius: var(--radius-2);
  color: var(--base-90);
  white-space: pre-wrap;
  word-break: break-word;
}

.card-content {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
}

.TokensLightness,
.TokensSaturation,
.TokensHue {
  display: flex;
}


.color {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: var(--color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.token-label {
  position: relative;
  z-index: 1;
  font-size: var(--font-size-1);
  font-weight: 600;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.color:hover .token-label {
  opacity: 1;
}

.caption {
  font-size: var(--font-size-1);
}
</style>
