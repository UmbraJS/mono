<script setup lang="ts">
import { computed } from 'vue'
import type { NobleButton } from '../../../types/button'
import { buttonVariants } from "./variants"

const {
  color = 'default',
  variant = 'base',
  disabled = false,
  size = 'medium',
  type = 'button',
} = defineProps<NobleButton>()

const ButtonVariant = computed(() => (disabled ? buttonVariants.base : buttonVariants[variant]))

const colorScheme = computed(() => {
  if (color === 'default') return `base-accent`
  return `base-${color}`
})

const sizeClass = computed(() => ({
  mini: 'buttonMini',
  small: 'buttonSmall',
  medium: 'buttonMedium',
}[size] ?? 'buttonMedium'))
</script>

<template>
  <component :is="ButtonVariant" tabindex="0" class="button buttonText buttonHover buttonActive buttonFocus"
    :class="[sizeClass, colorScheme]" :disabled="disabled" :aria-disabled="disabled" :type="type">
    <slot></slot>
  </component>
</template>

<style>
.button {
  --focus-color: var(--base-100);
  border-radius: var(--radius);
  transition: all var(--time);

  color: var(--base-120);
  background-color: var(--base-10);
  border: solid var(--border-size) var(--base-60);

  display: grid;
  justify-content: center;
  align-items: center;
}

/* If it has more than one child */
.button:has(> :nth-child(2)) {
  gap: var(--space-1);
  grid-template-columns: auto 1fr;
}

.button.buttonMini {
  height: var(--block-small);
  min-width: var(--block-small);
  padding: 0px;
}

.button.buttonSmall {
  height: var(--block);
  min-width: var(--block);
  padding: 0px var(--space-quark);
}

.button.buttonMedium {
  height: var(--block-big);
  min-width: var(--block-big);
  padding: 0px var(--space-1);
}

.buttonHover:hover {
  color: var(--base-100);
  background: var(--base-40);
  border-color: var(--base-100);
}

.buttonActive:active,
.buttonActive.active {
  color: var(--base-100);
  background: var(--base-70);
  border-color: var(--base-100);
  filter: blur(1px);
}

.button.buttonFocus:focus {
  color: var(--base-120);
  background: var(--base-40);
  border-color: var(--base-10);
}

.buttonFocus:focus {
  position: relative;
  --focus-color: var(--base-100);
  outline: solid 0px var(--focus-color);
}

.buttonFocus:focus,
.buttonFocus:has(*:focus) {
  z-index: 3;
  /* Makes sure the outline goes on top of sibling elements */
  outline: solid var(--space-quark) var(--focus-color);
}

.buttonFocus:active,
.buttonFocus:has(*:active) {
  outline: solid var(--border-size) var(--base-10);
}

/* Disabled */
.button:disabled {
  cursor: not-allowed;
  pointer-events: none;
  color: var(--base-50);
  background: var(--base-10);
}

.buttonText,
.buttonText p {
  font-variation-settings: var(--font-medium);
  line-height: 1;
}

/* // Button Group ================== */
.button-group {
  display: flex;
  align-items: center;
}

.button-group .button:not(:last-child, :first-child, :focus) {
  border-right-color: transparent;
  border-radius: 0px;
}

.button-group .button:not(:focus):first-child {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right-color: transparent;
}

.button-group .button:not(:focus):last-child {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

/* // Button Group ================== */
</style>
