<script setup lang="ts">
import { colord } from 'colord'
import { computed } from 'vue'
import { mostReadable } from '@umbrajs/core'
import type { UmbraOutputs } from '@umbrajs/core'

export interface Props {
  variable?: string
  text?: string
  color?: string
  name?: string
  index?: number
  prefix?: string
  umbra?: UmbraOutputs
  meta?: boolean
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '6rem',
  height: undefined,
  meta: false
})

function getIndex() {
  if (props.index === undefined) return 0
  return props.index * 10 + 10
}

const colorId = computed(() => {
  return props.index !== undefined ? '-' + getIndex() : ''
})

const cssVariable = computed(() => {
  if (props.variable) return `var(--${props.variable})`
  if (!props.color) return 'var(--base)'
  return props.prefix
    ? `var(--${props.name}-${props.prefix})`
    : `var(--${props.name}${colorId.value})`
})

const textColor = computed(() => {
  if (props.text) return `var(--${props.text})`
  if (!props.color) return 'var(--base-contrast)'
  if (!props.umbra) return 'var(--base-contrast)'

  const black = colord('#000000')
  const white = colord('#ffffff')

  const x = mostReadable(black, [black, white]).toHex()

  console.log(x)

  return 'var(--base-contrast)'
})

const size = computed(() => {
  return {
    width: props.width,
    height: props.height ? props.height : props.width
  }
})
</script>

<template>
  <div class="range">
    <div class="pallet" :style="{ color: textColor }">
      <p v-if="meta" :style="{ color: textColor }">
        {{ getIndex() }}
      </p>
      <p v-if="meta">{{ color }}</p>
    </div>
  </div>
</template>

<style scoped>
.pallet {
  padding: 0.2rem 0.5rem;
  height: v-bind('size.height');
  background-color: v-bind(cssVariable);
}
</style>
