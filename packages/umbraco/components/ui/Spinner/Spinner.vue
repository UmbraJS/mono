<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

export interface SpinnerProps {
  /** Spinner variant - primary uses gooey-balls, secondary uses 3-dots */
  variant?: 'primary' | 'secondary'
  /** Size of the spinner (CSS units or iconify size) */
  size?: string | number
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  variant: 'primary',
  size: '2em',
})

const iconName = computed(() =>
  props.variant === 'primary'
    ? 'svg-spinners:gooey-balls-2'
    : 'svg-spinners:3-dots-move'
)
</script>

<template>
  <Icon :icon="iconName" :width="size" :height="size" class="Spinner" />
</template>

<style scoped>
.Spinner {
  display: inline-block;
  vertical-align: middle;
}
</style>
