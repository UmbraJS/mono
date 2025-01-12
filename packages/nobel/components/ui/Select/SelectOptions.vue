<script setup lang="ts">
import { Icon } from '@iconify/vue'

const {
  index = 0,
  value = 'Blueberry',
  values = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'],
  open = false,
  itemOffsetTop = 0,
} = defineProps<{
  index?: number
  value: string
  values: string[]
  open: boolean
  itemOffsetTop: number
}>()

const emits = defineEmits<{
  (e: 'optionClick', props: { value: string; event: MouseEvent }): void
}>()
</script>

<template>
  <div class="SelectList" :class="{ open: open }">
    <div
      v-for="v in values"
      :key="v"
      class="SelectOption buttonFocus buttonHover"
      :class="{ active: value === v }"
      @click="(e) => emits('optionClick', { value: v, event: e })"
    >
      <Icon :icon="value === v ? `` : ``" />
      <p>{{ v }}</p>
    </div>
  </div>
  <div class="frame">
    <Icon icon="pixelarticons:chevron-down" />
  </div>
</template>

<style>
.SelectList {
  position: absolute;
  top: calc(v-bind(itemOffsetTop) * -1px);
  right: 0;
  left: 0;
  z-index: v-bind(index);

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

.SelectList.open {
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

.SelectList.open .SelectOption.active {
  background: var(--accent-40);
}

.SelectList.open .frame svg {
  transform: rotate(-90deg);
}

.frame {
  display: flex;
  align-items: center;
  padding-left: vaR(--space-1);

  pointer-events: none;
  position: absolute;
  z-index: calc(v-bind(index) + 1);

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
