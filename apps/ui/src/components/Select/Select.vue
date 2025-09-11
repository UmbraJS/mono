<script setup lang="ts">
import ComboBox from './ComboBox.vue';
import ListSelect from './ListSelect.vue';

import type { LabeledOption } from "./types";

const {
  size = "medium",
  placeholder = "Placeholder...",
  options,
  type = "list",
} = defineProps<{
  size?: "mini" | "small" | "medium" | "large";
  placeholder?: string;
  options: LabeledOption[];
  type?: "list" | "combobox";
}>();
</script>

<template>
  <ListSelect v-if="type === 'list'" :size="size" :placeholder="placeholder" :options="options" />
  <ComboBox v-if="type === 'combobox'" :size="size" :placeholder="placeholder" :options="options" />
</template>

<style>
.SelectContent {
  z-index: 10000;
  width: 100%;
  position: absolute;
  overflow: hidden;
  background-color: var(--base-10);
  border-radius: var(--radius);
  margin-top: var(--space-1);
  cursor: pointer;
}

.SelectViewport {
  padding: var(--space-1);
}

.SelectLabel {
  padding: 0 var(--space-1);
  padding-bottom: var(--space-quark);
  color: var(--base-80);
}

.SelectItem {
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--space-1);
  border-radius: var(--radius);
  padding: 0 var(--space-1);
}

.SelectItem[data-disabled] {
  color: var(--base-50);
  pointer-events: none;
}

.SelectItem[data-highlighted],
.SelectItem:hover,
.SelectItem:focus {
  background-color: var(--base-20);
  color: var(--base-120);
  outline: none;
}

.SelectItem[data-state="checked"] {
  background-color: var(--accent-30);
  color: var(--accent-120);
}

.SelectItemsSeparator {
  height: 1px;
  background-color: var(--base-50);
  margin: var(--space-1);
}

.SelectItemIndicator {
  width: 25px;
}

.ComboboxInput[value=""]::placeholder,
.SelectTrigger p[data-placeholder] {
  color: var(--base-80);
}
</style>
