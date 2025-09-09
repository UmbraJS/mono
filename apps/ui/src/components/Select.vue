<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from "reka-ui";

const options = [
  {
    name: "Fruit",
    children: [
      { name: "Apple" },
      { name: "Banana" },
      { name: "Orange" },
      { name: "Honeydew" },
      { name: "Grapes" },
      { name: "Watermelon" },
      { name: "Cantaloupe" },
      { name: "Pear" },
    ],
  },
  {
    name: "Vegetable",
    children: [
      { name: "Cabbage" },
      { name: "Broccoli" },
      { name: "Carrots" },
      { name: "Lettuce" },
      { name: "Spinach" },
      { name: "Bok Choy" },
      { name: "Cauliflower" },
      { name: "Potatoes" },
    ],
  },
];
</script>

<template>
  <ComboboxRoot class="ComboboxRoot">
    <ComboboxAnchor class="ComboboxAnchor border">
      <ComboboxInput class="ComboboxInput" placeholder="Placeholder..." />
      <ComboboxTrigger>
        <Icon icon="radix-icons:chevron-down" class="ComboboxIcon" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent class="ComboboxContent">
      <ComboboxViewport class="ComboboxViewport">
        <ComboboxEmpty class="ComboboxEmpty" />

        <template v-for="(group, index) in options" :key="group.name">
          <ComboboxGroup v-if="group.children.length">
            <ComboboxSeparator v-if="index !== 0" class="ComboboxSeparator" />

            <ComboboxLabel class="ComboboxLabel">
              {{ group.name }}
            </ComboboxLabel>

            <ComboboxItem
              v-for="option in group.children"
              :key="option.name"
              :value="option.name"
              class="ComboboxItem"
            >
              <ComboboxItemIndicator class="ComboboxItemIndicator">
                <Icon icon="radix-icons:check" />
              </ComboboxItemIndicator>
              <span>
                {{ option.name }}
              </span>
            </ComboboxItem>
          </ComboboxGroup>
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<style>
button,
input {
  all: unset;
}

.ComboboxRoot {
  position: relative;
}

.ComboboxAnchor {
  display: inline-flex;
  align-items: center;
  justify-content: between;
  height: var(--block);
  padding: 0 var(--space-1);
  gap: var(--space-1);
  background-color: var(--base-10);
  color: var(--base-120);
  border-radius: var(--radius);
}

.ComboboxAnchor:hover {
  background-color: var(--base-30);
}

.ComboboxInput {
  height: 100%;
  background-color: transparent;
  color: var(--base-120);
}

.ComboboxInput[data-placeholder] {
  color: var(--base-70);
}

.ComboboxIcon {
  width: 16px;
  height: 16px;
  color: var(--base-120);
}

.ComboboxContent {
  z-index: 10;
  width: 100%;
  position: absolute;
  overflow: hidden;
  background-color: var(--base);
  border-radius: var(--radius);
  margin-top: var(--space-1);
}

.ComboboxViewport {
  padding: var(--space-1);
}

.ComboboxEmpty {
  padding-top: var(--space-1);
  padding-bottom: var(--space-1);
  text-align: center;
  color: var(--base-70);
}

.ComboboxItem {
  line-height: 1;
  color: var(--space-1);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  height: var(--block);
  padding: 0 var(--space-1);
  position: relative;
  user-combobox: none;
}

.ComboboxItem[data-disabled] {
  color: var(--base-50);
  pointer-events: none;
}

.ComboboxItem[data-highlighted] {
  outline: none;
  background-color: var(--space-3);
  color: var(--base-120);
}

.ComboboxLabel {
  padding: 0 var(--space-1);
  color: var(--base-70);
}

.ComboboxSeparator {
  height: 1px;
  background-color: var(--base-50);
  margin: var(--space-1);
}

.ComboboxItemIndicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
