<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Button } from "umbraco";
import { ref } from "vue";
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

const open = ref(false);
</script>

<template>
  <ComboboxRoot class="ComboboxRoot" v-model:open="open">
    <ComboboxAnchor class="ComboboxAnchor button-group">
      <ComboboxInput
        class="ComboboxInput button base-accent small buttonText buttonHover buttonActive buttonFocus focus"
        placeholder="Placeholder..." />
      <ComboboxTrigger :asChild="true">
        <Button class="DropDownIcon" size="small">
          <Icon v-if="open" icon="radix-icons:chevron-down" class="ComboboxIcon" />
          <Icon v-else icon="radix-icons:chevron-right" class="ComboboxIcon" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent class="ComboboxContent border">
      <ComboboxViewport class="ComboboxViewport">
        <ComboboxEmpty class="ComboboxEmpty" />

        <template v-for="(group, index) in options" :key="group.name">
          <ComboboxGroup v-if="group.children.length">
            <ComboboxSeparator v-if="index !== 0" class="ComboboxSeparator" />

            <ComboboxLabel class="ComboboxLabel">
              {{ group.name }}
            </ComboboxLabel>

            <ComboboxItem v-for="option in group.children" :key="option.name" :value="option.name" class="ComboboxItem">
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

.ComboboxInput[value=""] {
  color: var(--base-text);
  color: red;
}

.ComboboxContent {
  z-index: 10;
  width: 100%;
  position: absolute;
  overflow: hidden;
  background-color: var(--base-10);
  border-radius: var(--radius);
  margin-top: var(--space-1);
}

.ComboboxViewport {
  padding: var(--space-1);
}

.ComboboxEmpty {
  padding-top: var(--space-1);
  padding-bottom: var(--space-1);
  color: var(--base-120);
  text-align: center;
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
