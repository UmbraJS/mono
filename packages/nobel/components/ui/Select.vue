<script setup lang="ts">
import { useTemplateRef, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const value = ref<string>('Blueberry')
const values = ref(['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'])
const open = ref(false)

const listWrapper = useTemplateRef<HTMLDivElement>('listWrapper')
const button = useTemplateRef<HTMLButtonElement>('button')

function getStep() {
  const listWrapperHeight = listWrapper.value?.clientHeight || 0
  const numberOfItems = values.value.length
  return listWrapperHeight / numberOfItems
}

const itemOffset = ref(0)

// const itemOffset = computed(() => {
//   if (!value.value) return 0
//   return getStep() * values.value.indexOf(value.value)
// })

function handleClick() {
  // open.value = !open.value
}

function handleItemClick(v: string, event: MouseEvent) {
  value.value = v
  const listWrapperTop = listWrapper.value?.getBoundingClientRect().top || 0
  const itemClicked = event.currentTarget as HTMLDivElement
  const itemClickedTop = itemClicked.offsetTop
  itemOffset.value = itemClickedTop
}
</script>

<template>
  <button ref="button" class="SelectRoot" :class="{ open: open }" @click="handleClick">
    <div ref="listWrapper" class="SelectListWrapper">
      <div class="SelectList">
        <div
          v-for="v in values"
          :key="v"
          class="SelectOption"
          :class="{ active: value === v }"
          @click="(e) => handleItemClick(v, e)"
        >
          <Icon icon="radix-icons:chevron-down" />
          <p>{{ v }}</p>
        </div>
      </div>
    </div>
    <div class="frame"></div>
  </button>
</template>

<style>
.SelectRoot {
  position: relative;
  z-index: 1;
  height: var(--block-big);
  min-width: var(--block-big);
  grid-template-columns: 1fr;
  border: solid 0px var(--base-60);
  color: var(--base-120);
  background: var(--base-10);
  border-radius: var(--radius);
}

.SelectRoot p {
  font-variation-settings: var(--font-regular);
}

.SelectList {
  display: flex;
  flex-direction: column;
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  overflow: hidden;
  margin-top: calc(v-bind(itemOffset) * -1px);
  transition: 0.1s;
}

.SelectList .SelectOption {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  padding: var(--space-1);
  height: var(--block-big);
}

.SelectList .SelectOption.active {
  background: var(--accent-40);
}

.SelectListWrapper {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  transition: 0.1s;
  /* height: var(--block-big); */
  height: auto;
}

/* .SelectRoot.open .SelectListWrapper {
  height: auto;
} */

.frame {
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: solid 1px red;
}
</style>
