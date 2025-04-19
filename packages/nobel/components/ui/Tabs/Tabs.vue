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
    label?: string
    icon?: string
  }[]
}>()

const valX = ref(defaultValue ?? tabID(0))
function tabID(index: number) {
  return 'tab' + (index + 1)
}
</script>

<template>
  <TabsRoot class="TabsRoot" :default-value="defaultValue" orientation="horizontal" v-model="valX">
    <TabsList class="Tabs" :aria-label="ariaLabel">
      <div class="TabsList button-group">
        <TabButton v-for="(tab, index) in tabs" :key="tab.label" :value="tabID(index)" :size="size"
          :active="valX === tabID(index)" :disabled="false">
          <Icon v-if="tab.icon" :icon="tab.icon" />
          <p v-if="tab.label">{{ tab.label }}</p>
        </TabButton>
      </div>
      <slot name="buttons" />
    </TabsList>
    <TabsContent class="TabsContent" v-for="(tab, index) in tabs" :key="tab.label" :value="tabID(index)">
      <slot :name="tabID(index)" :label="tab.label" :icon="tab.icon" :id="tabID(index)"
        :active="defaultValue === tabID(index)" />
    </TabsContent>
  </TabsRoot>
</template>

<style>
.Tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.TabsList {
  display: flex;
  align-items: center;
}

.TabsRoot {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  height: var(--side-size);
  padding-bottom: 25px;
}

.TabsContent {
  height: 100%;
}
</style>
