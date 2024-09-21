<script setup lang="ts">
import { computed } from 'vue'

import ButtonPrimary from './variants/ButtonPrimary.vue'
import ButtonSecondary from './variants/ButtonSecondary.vue'
import ButtonBase from './variants/ButtonBase.vue'

const components = {
  primary: ButtonPrimary,
  secondary: ButtonSecondary,
  base: ButtonBase
}

const {
  type = 'default',
  variant = 'base',
  disabled = false,
  size = 'medium'
} = defineProps<{
  variant?: keyof typeof components
  disabled?: boolean
  size?: 'medium' | 'small' | 'mini'
  type?: 'warning' | 'success' | 'default'
}>()

const ButtonVariant = computed(() => (disabled ? components.base : components[variant]))

const buttonTypes = {
  default: '--accent',
  success: '--success',
  warning: '--warning'
}

const genericColors = computed(() => {
  if (type === 'default') return
  return {
    '--color': `var(${buttonTypes[type]}, --accent)`,
    '--color-10': `var(${buttonTypes[type]}-10)`,
    '--color-20': `var(${buttonTypes[type]}-20)`,
    '--color-30': `var(${buttonTypes[type]}-30)`,
    '--color-40': `var(${buttonTypes[type]}-40)`,
    '--color-50': `var(${buttonTypes[type]}-50)`,
    '--color-60': `var(${buttonTypes[type]}-60)`,
    '--color-70': `var(${buttonTypes[type]}-70)`,
    '--color-80': `var(${buttonTypes[type]}-80)`,
    '--color-90': `var(${buttonTypes[type]}-90)`,
    '--color-100': `var(${buttonTypes[type]}-100)`,
    '--color-110': `var(${buttonTypes[type]}-110)`,
    '--color-120': `var(${buttonTypes[type]}-120)`,
    '--color-contrast': `var(${buttonTypes[type]}-contrast)`
  }
})
</script>

<template>
  <component
    tabindex="1"
    class="button focus"
    :class="size"
    :is="ButtonVariant"
    :disabled="disabled"
    :style="genericColors"
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
  background-color: var(--base);
  border: solid var(--border-size) var(--base-60);
}

@mixin button-base-structure {
  display: grid;
  justify-content: center;
  align-items: center;
  /* If it has more than one child */
  &:has(:nth-child(2)) {
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

.button:hover {
  @include button-hover;
}

.button:active,
.button.active {
  @include button-active;
  filter: blur(1px);
}

.button:focus {
  @include button-focus;
}

/* Disabled */
button:disabled {
  cursor: not-allowed;
  pointer-events: none;
  color: var(--base-50);
  background: var(--base-10);
}
</style>
