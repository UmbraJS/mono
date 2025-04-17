<script setup lang="ts">
import { TabButton } from '@nobel/core'
import { TabsList, TabsRoot, TabsContent } from 'reka-ui'
import type { ButtonSize } from "../../../types/button"
import { ref } from 'vue';

const props = defineProps<{
  ariaLabel: string
  defaultValue: string
  tabs: string[]
  size: ButtonSize
}>()

const valX = ref(props.defaultValue)
</script>

<template>
  <TabsRoot class="TabsRoot" :default-value="defaultValue" orientation="horizontal" v-model="valX">
    <TabsList class="TabsList button-group" :aria-label="ariaLabel">
      <TabButton v-for="tab in tabs" :key="tab" :value="tab" :size="size" :active="defaultValue === tab"
        :disabled="false">
        {{ tab }}
      </TabButton>
    </TabsList>
    <TabsContent v-for="tab in tabs" :key="tab" :value="tab">
      <slot :name="tab" />
    </TabsContent>
  </TabsRoot>
</template>

<style>
.TabsList {
  display: flex;
  align-items: center;
}
</style>
