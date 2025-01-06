<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

const fruit = ref()

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
</script>

<template>
  <SelectRoot v-model="fruit">
    <SelectTrigger class="SelectTrigger button focus" aria-label="Customise options">
      <Icon icon="radix-icons:chevron-down" />
      <SelectValue placeholder="Select a fruit..." />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent class="SelectContent" :side-offset="1000">
        <SelectScrollUpButton class="SelectScrollButton">
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="SelectViewport">
          <SelectLabel class="SelectLabel"> Fruits </SelectLabel>
          <SelectGroup class="SelectGroup">
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="SelectItem"
              :value="option"
            >
              <Icon icon="radix-icons:chevron-down" />
              <SelectItemText as="p">
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
body {
  padding: 0 !important;
  margin: 0 !important;
}

.SelectTrigger {
  display: grid;
  grid-template-columns: 1em 1fr !important;
  border-radius: var(--radius);
  padding: 0 var(--space-1);
  height: var(--block-big);
  gap: var(--space-1);
  border: solid var(--border-size) var(--base-60);
  background-color: var(--base-10);
}

.SelectTrigger[data-placeholder] {
  color: var(--base-80);
}

.SelectTrigger span {
  font-variation-settings: var(--font-regular);
  width: max-content;
}

.SelectIcon {
  color: red;
}

.SelectContent {
  overflow: hidden;
  background-color: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
}

.SelectViewport {
  padding: var(--space-1);
}

.SelectItem {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1em 1fr;

  border-radius: var(--radius);

  padding: 0 var(--space-1);
  height: var(--block-big);
  gap: var(--space-1);

  position: relative;
  user-select: none;
  cursor: pointer;
}

.SelectItem[data-disabled] {
  color: var(--base-80);
  background-color: var(--base-20);
  pointer-events: none;
}

.SelectItem[data-highlighted] {
  outline: none;
  background-color: var(--accent-40);
  color: var(--accent-120);
}

.SelectLabel {
  padding: 0px var(--space-1);
  height: var(--block);
  color: var(--accent-120);
  border-bottom: solid var(--border-size) var(--base-40);
}

.SelectSeparator {
  height: 1px;
  background-color: var(--accent-120);
  margin: 5px;
}

.SelectGroup {
  padding-bottom: var(--space-2);
}

.SelectScrollButton {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: solid var(--border-size) var(--base-60);
  height: var(--block-big);
  background-color: var(--base-20);
  color: var(--base-120);
  cursor: default;
}
</style>
