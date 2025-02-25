<script setup lang="ts">
import { computed } from 'vue'

import ButtonPrimary from './variants/ButtonPrimary.vue'
import ButtonSecondary from './variants/ButtonSecondary.vue'
import ButtonBase from './variants/ButtonBase.vue'

const components = {
  primary: ButtonPrimary,
  secondary: ButtonSecondary,
  base: ButtonBase,
}

const {
  color = 'default',
  variant = 'base',
  disabled = false,
  size = 'medium',
  type = 'button',
} = defineProps<{
  variant?: keyof typeof components
  disabled?: boolean
  size?: 'medium' | 'small' | 'mini'
  color?: 'warning' | 'success' | 'default'
  type?: HTMLButtonElement['type']
}>()

const ButtonVariant = computed(() => (disabled ? components.base : components[variant]))

const buttonColors = {
  default: '--accent',
  success: '--success',
  warning: '--warning',
}

const genericColors = computed(() => {
  if (color === 'default') return
  return {
    '--color': `var(${buttonColors[color]}, --accent)`,
    '--color-10': `var(${buttonColors[color]}-10)`,
    '--color-20': `var(${buttonColors[color]}-20)`,
    '--color-30': `var(${buttonColors[color]}-30)`,
    '--color-40': `var(${buttonColors[color]}-40)`,
    '--color-50': `var(${buttonColors[color]}-50)`,
    '--color-60': `var(${buttonColors[color]}-60)`,
    '--color-70': `var(${buttonColors[color]}-70)`,
    '--color-80': `var(${buttonColors[color]}-80)`,
    '--color-90': `var(${buttonColors[color]}-90)`,
    '--color-100': `var(${buttonColors[color]}-100)`,
    '--color-110': `var(${buttonColors[color]}-110)`,
    '--color-120': `var(${buttonColors[color]}-120)`,
    '--color-contrast': `var(${buttonColors[color]}-contrast)`,
  }
})
</script>

<template>
  <component
    :is="ButtonVariant"
    tabindex="1"
    class="button buttonText buttonHover buttonActive buttonFocus focus"
    :class="size"
    :disabled="disabled"
    :style="genericColors"
    :type="type"
  >
    <slot></slot>
  </component>
</template>

<style lang="scss">
@mixin button-medium {
  height: var(--block-big);
  min-width: var(--block-big);
  padding: 0px var(--space-quark);
}

@mixin button-small {
  height: var(--block);
  min-width: var(--block);
  padding: 0px var(--space-quark);
}

@mixin button-mini {
  height: var(--block-small);
  min-width: var(--block-small);
  padding: 0px;
}

@mixin button-base-theme {
  color: var(--base-120);
  background-color: var(--base-10);
  border: solid var(--border-size) var(--base-60);
}

@mixin button-base-structure {
  display: grid;
  justify-content: center;
  align-items: center;
  /* If it has more than one child */
  &:has(> :nth-child(2)) {
    gap: var(--space-1);
    grid-template-columns: auto 1fr;
  }
}

@mixin button-hover {
  color: var(--color-100);
  background: var(--color-40);
  border-color: var(--color-100);
}

@mixin button-active {
  color: var(--color-100);
  background: var(--color-70);
  border-color: var(--color-100);
}

@mixin button-focus {
  color: var(--color-100);
  background: var(--color-70);
  border-color: var(--base-10);
}

/* Base */
.button {
  --focus-color: var(--color-100);
  border-radius: var(--radius);
  transition: all var(--time);
  @include button-base-theme;
  @include button-base-structure;
}

.button.medium {
  @include button-medium;
}

.button.small {
  @include button-small;
}

.button.mini {
  @include button-mini;
}

.buttonHover:hover {
  @include button-hover;
}

.buttonActive:active,
.buttonActive.active {
  @include button-active;
  filter: blur(1px);
}

.button.buttonFocus:focus {
  @include button-focus;
}

.buttonFocus:focus {
  position: relative;
  --focus-color: var(--color-100);
  outline: solid 0px var(--focus-color);
}

.buttonFocus:focus,
.buttonFocus:has(*:focus) {
  z-index: 3; /* Makes sure the outline goes on top of sibling elements */
  outline: solid var(--space-quark) var(--focus-color);
}

.buttonFocus:active,
.buttonFocus:has(*:active) {
  outline: solid var(--border-size) var(--color-10);
}

/* Disabled */
.button:disabled {
  cursor: not-allowed;
  pointer-events: none;
  color: var(--base-50);
  background: var(--base-10);
}

.buttonText {
  font-variation-settings: var(--font-medium);
  line-height: 1;
}
</style>
