<script setup lang="ts">
import { colord } from 'colord'
import type { Colord } from 'colord'
import { vOnClickOutside } from '@vueuse/components'

import { ref } from 'vue'
import { colorName } from '../composables/colorName'
import { hexType } from '../composables/canvas'
import Pallet from './Pallet.vue'
import ColorCanvas from './Canvas/ColorCanvas.vue'
import HueCanvas from './Canvas/HueCanvas.vue'

const emit = defineEmits<{
  (
    e: 'change',
    color: {
      name: string
      value: Colord
      position: { x: number; y: number }
    }
  ): void
}>()

interface Props {
  default: string
  compact: boolean
  compactSize: number
  hueWidth: number
}

const props = withDefaults(defineProps<Props>(), {
  default: '#ff0000',
  compact: true,
  compactSize: 50,
  hueWidth: 25
})

const pallet = ref<HTMLElement | null>(null)
const colorCanvas = ref<HTMLCanvasElement | null>(null)

function getRef() {
  return colorCanvas
}

function setRef(el: HTMLCanvasElement) {
  colorCanvas.value = el
}

const color = ref({
  name: 'red',
  value: props.default
})

function handleChange(hex?: hexType, mounted = false) {
  if (!hex) return
  const get = colorName(hex.color)
  const { name, value } = get()
  color.value = { name, value }

  if (mounted) return
  emit('change', {
    name,
    value: colord(value),
    position: hex.position
  })
}

const compact = ref(props.compact)
const compactSize = ref(props.compactSize)
const hueWidth = ref(props.hueWidth)
</script>

<template>
  <div class="dyepicker-wrapper" :class="{ compact }" v-on-click-outside="() => (compact = true)">
    <div ref="pallet" class="pallet-wrapper">
      <slot :color="color">
        <Pallet
          :color="color"
          :hueWidth="hueWidth"
          :compact="compact"
          :compactSize="compactSize"
          @edit="() => (compact = false)"
        />
      </slot>
    </div>
    <ColorCanvas @change="handleChange" :getRef="getRef" :setRef="setRef" :color="color" />
    <HueCanvas
      @change="(props) => handleChange(props.hex, props.mounted)"
      :colorCanvas="getRef"
      :color="color"
      :width="hueWidth"
    />
  </div>
</template>

<style lang="scss" scoped>
$mobile: 360px;
$phablet: 540px;
$tablet: 850px;
$desktop: 1200px;

.dyepicker-wrapper {
  --radius: 5px;
  --space-xs: calc(var(--space) / 4);
  --space-s: calc(var(--space) / 2);
  --space: 25px;
  --space-m: calc(2 * var(--space));
  --space-l: calc(4 * var(--space));
  --space-xl: calc(8 * var(--space));
  @media only screen and (max-width: $tablet) {
    --space: 12px;
  }
  @media only screen and (max-width: $mobile) {
    --space: 6px;
  }
}

.dyepicker-wrapper {
  --hueWidth: calc(v-bind(hueWidth) * 1px);

  display: grid;
  grid-template-columns: 1fr var(--hueWidth);

  height: 400px;
  width: auto;

  max-height: 400px;
  max-width: 400px;

  border-radius: var(--radius);
  overflow: hidden;

  transition: 0.4s;
  .pallet-wrapper {
    grid-column: span 2;
  }
}

.dyepicker-wrapper.compact {
  --compactSize: calc(v-bind(compactSize) * 1px);
  max-height: var(--compactSize);
  max-width: var(--compactSize);
}
</style>
