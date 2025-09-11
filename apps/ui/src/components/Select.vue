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

const fruit = ref()

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']
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
            <SelectItem v-for="(option, index) in options" :key="index" class="SelectItem" :value="option">
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
@import '@radix-ui/colors/black-alpha.css';
@import '@radix-ui/colors/mauve.css';
@import '@radix-ui/colors/grass.css';

.SelectTrigger[data-placeholder] {
  color: var(--grass-9);
}

.SelectIcon {
  color: var(--grass-11);
}

.SelectContent {
  overflow: hidden;
  background-color: var(--base-10);
  border-radius: var(--radius);
}

.SelectViewport {
  padding: var(--space-1);
}

.SelectItem {
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 var(--space-1);
  position: relative;
  user-select: none;
}

.SelectItem[data-disabled] {
  color: var(--mauve-8);
  pointer-events: none;
}

.SelectItem[data-highlighted] {
  outline: none;
  background-color: var(--grass-9);
  color: var(--grass-1);
}

.SelectLabel {
  padding: 0 25px;
  font-size: 12px;
  line-height: 25px;
  color: var(--mauve-11);
}

.SelectSeparator {
  height: 1px;
  background-color: var(--grass-6);
  margin: 5px;
}

.SelectItemIndicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.SelectScrollButton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  background-color: white;
  color: var(--grass-11);
  cursor: default;
}
</style>
