<script setup lang="ts">
import { TabButton } from '@nobel/core'
import { TabsList, TabsRoot } from 'reka-ui'

defineProps<{
  ariaLabel: string
  defaultValue: string
  tabs: {
    value: string
  }[]
}>()
</script>

<template>
  <TabsRoot class="TabsRoot" :default-value="defaultValue" orientation="horizontal">
    <TabsList class="TabsList button-group" :aria-label="ariaLabel">
      <TabButton v-for="tab in tabs" :key="tab.value" :value="tab.value">
        {{ tab.value }}
      </TabButton>
    </TabsList>
    <slot />
  </TabsRoot>
</template>

<style>
.TabsList {
  display: flex;
  align-items: center;
}
</style>
