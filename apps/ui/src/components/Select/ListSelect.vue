<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { ref } from 'vue'

import type { LabeledOption } from "./types";

const {
  size = "medium",
  placeholder = "Placeholder...",
  options,
} = defineProps<{
  size?: "mini" | "small" | "medium" | "large";
  placeholder?: string;
  options: LabeledOption[];
}>();

const fruit = ref(options)
</script>

<template>
  <SelectRoot v-model="fruit">
    <SelectTrigger class="SelectTrigger button small buttonText buttonHover buttonActive buttonFocus focus"
      aria-label="Customise options">
      <SelectValue placeholder="Select a fruit..." />
      <Icon icon="radix-icons:chevron-down" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent class="SelectContent" :side-offset="5">
        <SelectScrollUpButton class="SelectScrollButton">
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="SelectViewport">
          <SelectLabel class="SelectLabel">
            Fruits
          </SelectLabel>
          <SelectGroup>
            <SelectItem v-for="(option, index) in fruit" :key="index" class="SelectItem" :value="option">
              <SelectItemIndicator class="SelectItemIndicator">
                <Icon icon="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator class="SelectSeparator" />
          <SelectLabel class="SelectLabel">
            Vegetables
          </SelectLabel>
          <SelectGroup>
            <SelectItem v-for="(option, index) in vegetables" :key="index" class="SelectItem" :value="option"
              :disabled="option === 'Courgette'">
              <SelectItemIndicator class="SelectItemIndicator">
                <Icon icon="radix-icons:check" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton class="SelectScrollButton">
          <Icon icon="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
/* Harmonize Select styles with ComboBox component design tokens */

.SelectContent {
  z-index: 10000;
  width: 100%;
  position: relative;
  /* stays within portal positioning */
  overflow: hidden;
  background-color: var(--base-10);
  border-radius: var(--radius);
  margin-top: var(--space-1);
  cursor: pointer;
  border: 1px solid var(--base-40);
}

.SelectViewport {
  padding: var(--space-1);
}

.SelectItem {
  line-height: 1;
  color: var(--base-120);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--block);
  padding: 0 var(--space-1);
  position: relative;
  user-select: none;
  font-size: var(--font-size-0, 14px);
}

.SelectItem[data-disabled] {
  color: var(--base-50);
  pointer-events: none;
}

.SelectItem[data-highlighted] {
  background-color: var(--base-20);
  color: var(--base-120);
  outline: none;
}

.SelectItem[data-state="checked"] {
  background-color: var(--accent-30);
  color: var(--accent-120);
}

.SelectLabel {
  padding: 0 var(--space-1);
  padding-bottom: var(--space-quark);
  color: var(--base-70);
  font-size: var(--font-size--1, 12px);
  line-height: 1.2;
  text-transform: none;
}

.SelectSeparator {
  height: 1px;
  background-color: var(--base-50);
  margin: var(--space-1);
}

.SelectItemIndicator {
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  color: currentColor;
}

.SelectScrollButton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--block);
  background-color: var(--base-10);
  color: var(--base-120);
  cursor: default;
}

/* Placeholder coloring similar to ComboBoxInput */
.SelectTrigger[data-placeholder] {
  color: var(--base-text, var(--base-120));
}
</style>
