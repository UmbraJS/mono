<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { TabButton } from '@nobel/core'
import { TabsList, TabsRoot, TabsContent } from 'reka-ui'
import type { ButtonSize } from "../../../types/button"
import { ref } from 'vue';

const {
  tabs,
  defaultValue,
  size = 'small',
} = defineProps<{
  size?: ButtonSize
  defaultValue?: string
  ariaLabel: string
  tabs: {
    name?: string
    icon?: string
  }[]
}>()

const valX = ref(defaultValue ?? tabs[0].name)
function tabID(index: number) {
  return 'tab' + index
}
</script>

<template>
  <TabsRoot class="TabsRoot" :default-value="defaultValue" orientation="horizontal" v-model="valX">
    <TabsList class="TabsList button-group" :aria-label="ariaLabel">
      <TabButton v-for="(tab, index) in tabs" :key="tab.name" :value="tabID(index)" :size="size"
        :active="defaultValue === tabID(index)" :disabled="false">
        <Icon v-if="tab.icon" :icon="tab.icon" />
        <p v-if="tab.name">{{ tab.name }}</p>
      </TabButton>
    </TabsList>
    <TabsContent v-for="(tab, index) in tabs" :key="tab.name" :value="tabID(index - 1)">
      <slot :name="tabID(index)" />
    </TabsContent>
  </TabsRoot>
</template>

<style>
.TabsList {
  display: flex;
  align-items: center;
}
</style>
