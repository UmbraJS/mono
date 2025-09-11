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

const open = ref(false);
</script>

<template>
  <ComboboxRoot class="ComboboxRoot" v-model:open="open">
    <ComboboxAnchor class="ComboboxAnchor button-group">
      <ComboboxInput class="ComboboxInput button small buttonHover buttonActive buttonFocus focus"
        :placeholder="placeholder" />
      <ComboboxTrigger :asChild="true">
        <Button class="DropDownIcon" size="small">
          <Icon v-if="open" icon="radix-icons:chevron-down" class="ComboboxIcon" />
          <Icon v-else icon="radix-icons:chevron-right" class="ComboboxIcon" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent class="SelectContent border">
      <ComboboxViewport class="SelectViewport">
        <ComboboxEmpty class="ComboboxEmpty">
          <Icon icon="carbon:warning" />
          <p class="">404 not found</p>
        </ComboboxEmpty>

        <template v-for="(group, index) in options" :key="group.name">
          <ComboboxGroup v-if="group.children.length">
            <ComboboxSeparator v-if="index !== 0" class="SelectItemsSeparator" />

            <ComboboxLabel class="SelectLabel">
              <p class="caption">{{ group.name }}</p>
            </ComboboxLabel>

            <ComboboxItem v-for="option in group.children" :key="option.name" :value="option.name" class="SelectItem">
              <p>{{ option.name }}</p>
              <ComboboxItemIndicator class="SelectItemIndicator">
                <Icon icon="radix-icons:check" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
        </template>

      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<style>
.ComboboxRoot {
  position: relative;
}

.ComboboxEmpty {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  justify-content: center;

  padding-top: var(--space-1);
  padding-bottom: var(--space-1);
  color: var(--warning-120);
}
</style>
