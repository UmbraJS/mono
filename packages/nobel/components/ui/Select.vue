<script setup lang="ts">
import { useTemplateRef, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const value = ref<string>('Blueberry')
const values = ref([
  'Apple',
  'Banana',
  'Blueberry',
  'Grapes',
  'Pineapple',
  'Strawberry',
  'Watermelon',
  'Kiwi',
  'Orange',
])
const open = ref(false)

const ListContent = useTemplateRef<HTMLDivElement>('ListContent')

const itemOffsetTop = ref(0)
const itemOffsetBottom = ref(0)

const longestValue = computed(() => values.value.reduce((a, b) => (a.length > b.length ? a : b)))

function handleClick() {
  open.value = !open.value
}

function handleItemClick(v: string, index: number, event: MouseEvent) {
  value.value = v
  const itemClicked = event.currentTarget as HTMLDivElement
  const itemClickedHeight = itemClicked.clientHeight
  if (!ListContent.value) return

  const listContentHeight = ListContent.value.clientHeight
  const amountOfItems = values.value.length

  const distanceFromTopToItemAtIndex = (listContentHeight / amountOfItems) * index - 1
  const distanceFromBottomToItemAtIndex =
    listContentHeight - distanceFromTopToItemAtIndex - itemClickedHeight

  itemOffsetTop.value = distanceFromTopToItemAtIndex
  itemOffsetBottom.value = distanceFromBottomToItemAtIndex
}
</script>

<template>
  <button
    ref="button"
    class="SelectRoot button buttonFocus buttonHover"
    :class="{ open: open }"
    @click="handleClick"
  >
    <p class="space-value">{{ longestValue }}</p>
    <div class="SelectList">
      <div ref="ListContent" class="SelectList-content">
        <div
          v-for="(v, index) in values"
          :key="v"
          class="SelectOption buttonFocus buttonHover"
          :class="{ active: value === v }"
          @click="(e) => handleItemClick(v, index, e)"
        >
          <Icon :icon="value === v ? `` : ``" />
          <p>{{ v }}</p>
        </div>
      </div>
    </div>
    <div class="frame">
      <Icon icon="pixelarticons:chevron-down" />
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
  color: var(--base-120);
  background: var(--base-10);
  border-radius: var(--radius);

  --option-height: var(--block-big);
}

.SelectRoot p {
  font-variation-settings: var(--font-regular);
}

.SelectList {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;

  height: var(--option-height);
  overflow: hidden;

  display: flex;
  flex-direction: column;
  border: solid var(--border-size) var(--accent-100);
  border-radius: var(--radius);

  background: var(--base-10);
  box-shadow: 10px 10px 50px 50px red;
  transition: 0.4s;
  interpolate-size: allow-keywords;
}

.SelectRoot.open .SelectList {
  bottom: calc(v-bind(itemOffsetBottom) * -1px);
  top: calc(v-bind(itemOffsetTop) * -1px);
  height: auto;
}

.SelectList-content {
  margin-top: calc(v-bind(itemOffsetTop) * -1px);
  transition: 0.4s linear;
}

.SelectRoot.open .SelectList .SelectList-content {
  margin-top: 0;
}

.SelectList .SelectOption {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  padding: 0px var(--space-1);
  height: calc(var(--option-height) - var(--border-size));
  border-radius: var(--radius);
}

.SelectRoot.open .SelectOption.active {
  background: var(--accent-40);
}

.SelectRoot.open .frame svg {
  transform: rotate(-90deg);
}

.frame {
  display: flex;
  align-items: center;
  padding-left: vaR(--space-1);

  pointer-events: none;
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: solid var(--border-size) var(--base-60);
  border-radius: var(--radius);
  transition: 0.2s;
}

.frame svg {
  transform: rotate(0deg);
  transition: 0.2s;
}
</style>
