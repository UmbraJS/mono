<script setup lang="ts">
import { useTemplateRef, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const value = ref<string>('Blueberry')
const values = ref(['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'])
const open = ref(false)

const listWrapper = useTemplateRef<HTMLDivElement>('listWrapper')

function getStep() {
  const listWrapperHeight = listWrapper.value?.clientHeight || 0
  const numberOfItems = values.value.length
  return listWrapperHeight / numberOfItems
}

const itemOffset = computed(() => {
  if (!value.value) return 0
  return getStep() * values.value.indexOf(value.value)
})
</script>

<template>
  <button class="SelectRoot button focus">
    <div ref="listWrapper" class="SelectListWrapper">
      <div class="SelectList">
        <div v-for="v in values" :key="v" class="SelectOption" @click="value = v">
          <Icon icon="radix-icons:chevron-down" />
          <p>{{ v }}</p>
        </div>
      </div>
    </div>
  </button>
</template>

<style>
.SelectRoot {
  position: relative;
  z-index: 1;
  height: var(--block-big);
  min-width: var(--block-big);
  grid-template-columns: 1fr;
}

.SelectRoot p {
  font-variation-settings: var(--font-regular);
}

.SelectList {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius);
  /* border: solid 1px var(--color-border); */
}

.SelectList .SelectOption {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  padding: var(--space-1);
  height: var(--block-big);
}

.SelectListWrapper {
  position: absolute;
  z-index: 2;
  top: calc(v-bind(itemOffset) * -1px);
  left: 0;
  right: 0;
}
</style>
