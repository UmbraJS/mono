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

// current selected value (string) – start empty to allow placeholder usage
const selected = ref<string | null>(null)
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger class="SelectTrigger button small buttonHover buttonActive buttonFocus focus"
      :aria-label="placeholder">
      <SelectValue as="p" :placeholder="placeholder" />
      <Icon icon="radix-icons:chevron-down" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent class="SelectContent border" :side-offset="5">
        <SelectScrollUpButton class="SelectScrollButton">
          <Icon icon="radix-icons:chevron-up" />
        </SelectScrollUpButton>

        <SelectViewport class="SelectViewport">
          <template v-for="(group, gIndex) in options" :key="group.name">
            <SelectGroup v-if="group.children.length">
              <SelectSeparator v-if="gIndex !== 0" class="SelectItemsSeparator" />
              <SelectLabel class="SelectLabel">
                <p class="caption">{{ group.name }}</p>
              </SelectLabel>
              <SelectItem v-for="option in group.children" :key="option.name" class="SelectItem" :value="option.name">
                <SelectItemText>
                  <p>{{ option.name }}</p>
                </SelectItemText>
                <SelectItemIndicator class="SelectItemIndicator">
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>
          </template>
        </SelectViewport>

        <SelectScrollDownButton class="SelectScrollButton">
          <Icon icon="radix-icons:chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
.SelectContent {
  /* Content gets slightly unaligned with its trigger. Might want to do a deeper dive into why but this fix works for now. */
  transform: translateY(-9px);
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

.SelectTrigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-1);
}

/* Placeholder coloring similar to ComboBoxInput */
.SelectTrigger[data-placeholder] {
  color: var(--base-text, var(--base-120));
}
</style>
