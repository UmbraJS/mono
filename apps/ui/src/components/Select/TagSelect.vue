<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot } from 'reka-ui'
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

const modelValue = ref(['Apple', 'Banana'])
</script>

<template>
  <TagsInputRoot v-model="modelValue" class="SelectTrigger button small buttonHover buttonActive buttonFocus focus">
    <TagsInputItem v-for="item in modelValue" :key="item" :value="item"
      class="TagsInputItem button mini buttonHover buttonActive buttonFocus focus">
      <TagsInputItemText as="p" class="TagsInputItemText caption" />
      <TagsInputItemDelete class="TagsInputItemDelete">
        <Icon icon="carbon:delete" />
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput placeholder="Fruits..." class="TagsInputInput" />
  </TagsInputRoot>
</template>

<style>
.TagsInputItem.mini {
  display: flex;
  align-items: center;
  justify-content: center;
}

.TagsInputItemText {
  padding-left: var(--space-1);
}

.TagsInputItemDelete {
  color: var(--base-120);
  padding-right: var(--space-1);
}

.TagsInputInput {
  all: unset;
}
</style>
