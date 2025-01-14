<script setup lang="ts">
import { useTemplateRef, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const value = ref<string>('Blueberry')
const values = ref(['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'])
const open = ref(false)

const listWrapper = useTemplateRef<HTMLDivElement>('listWrapper')
const button = useTemplateRef<HTMLButtonElement>('button')

const itemOffsetTop = ref(0)
const itemOffsetBottom = ref(0)

const longestValue = computed(() => values.value.reduce((a, b) => (a.length > b.length ? a : b)))

function handleClick() {
  open.value = !open.value
}

function handleItemClick(v: string, event: MouseEvent) {
  value.value = v
  const itemClicked = event.currentTarget as HTMLDivElement
  itemOffsetTop.value = itemClicked.offsetTop
  itemOffsetBottom.value = itemClicked.offsetTop + itemClicked.clientHeight
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
    <div ref="listWrapper" class="SelectList">
      <div
        v-for="v in values"
        :key="v"
        class="SelectOption buttonFocus buttonHover"
        :class="{ active: value === v }"
        @click="(e) => handleItemClick(v, e)"
      >
        <Icon :icon="value === v ? `` : ``" />
        <p>{{ v }}</p>
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
  top: calc(v-bind(itemOffsetTop) * -1px);
  right: 0;
  left: 0;
  z-index: 2;

  display: flex;
  flex-direction: column;
  border: solid var(--border-size) var(--accent-100);
  border-radius: var(--radius);

  background: var(--base-10);
  clip-path: rect(
    calc(v-bind(itemOffsetTop) * 1px) 100% calc(v-bind(itemOffsetTop) * 1px + var(--option-height))
      0% round var(--radius)
  );
  box-shadow: 10px 10px 10000px 10000px black;
  transition: 0.4s;
}

.SelectRoot.open .SelectList {
  clip-path: rect(0% 100% 100% 0% round var(--radius)) !important;
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
