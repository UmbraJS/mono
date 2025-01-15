<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef, computed, ref, getCurrentInstance } from 'vue'
import SelectOptions from './SelectOptions.vue'

const value = ref<string>('Blueberry')
const values = ref(['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'])
const open = ref(false)

const ListContent = useTemplateRef<HTMLDivElement>('ListContent')

const itemOffsetTop = ref(0)

onClickOutside(ListContent, () => {
  open.value = false
})

const longestValue = computed(() => {
  return values.value.reduce((a, b) => (a.length > b.length ? a : b))
})

function handleClick() {
  open.value = !open.value
}

function handleItemClick(props: { value: string; index: number; event: MouseEvent }) {
  value.value = props.value
  const itemClicked = props.event.currentTarget as HTMLDivElement
  if (!ListContent.value) return

  const listContentHeight = ListContent.value.clientHeight
  const amountOfItems = values.value.length

  const distanceFromTopToItemAtIndex = (listContentHeight / amountOfItems) * props.index - 1

  itemOffsetTop.value = distanceFromTopToItemAtIndex
}
</script>

<template>
  <button class="SelectRoot buttonFocus buttonHover" :class="{ open: open }" @click="handleClick">
    <!-- <div class="value-spacer">
      <p>{{ longestValue }}</p>
    </div> -->
    <SelectOptions
      :open="open"
      :value="value"
      :values="values"
      :itemOffsetTop="itemOffsetTop"
      @optionClick="handleItemClick"
    />
  </button>
</template>

<style>
button.SelectRoot {
  position: relative;
  height: var(--block-big);
  min-width: var(--block-big);
  grid-template-columns: 1fr;
  color: var(--base-120);
  background: var(--base-10);
  border-radius: var(--radius);
  min-width: 150px;
  --option-height: var(--block-big);
}

.button.SelectRoot:focus {
  z-index: 8;
}

button.SelectRoot p {
  font-variation-settings: var(--font-regular);
}
</style>
