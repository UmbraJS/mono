<script setup lang="ts">
import { colord } from 'colord'
import type { Colord } from 'colord'
import { vOnClickOutside } from '@vueuse/components'

import { umbra } from '@umbrajs/core'
import { ref, onMounted } from 'vue'
import { OutputColor, useColorCanvas } from '../composables/canvas'
import Pallet from './Pallet.vue'
import ColorCanvas from './Canvas/ColorCanvas.vue'
import HueCanvas from './Canvas/HueCanvas.vue'

interface Dye {
  name: string
  color: Colord
  position: { x: number; y: number }
}

const emit = defineEmits<{
  (e: 'change', dye: Dye): void
}>()

interface DyeProps {
  default?: string
  compact?: boolean
  compactSize?: number
}

const props = withDefaults(defineProps<DyeProps>(), {
  default: '#ff0000',
  compact: false,
  compactSize: 50
})

const color = ref({
  name: 'red',
  hex: props.default
})

const [colorCanvas, setColorCanvas] = useColorCanvas()
const pickerRef = ref<HTMLElement | null>(null)

function applyPaint(background: string) {
  if (!pickerRef.value) return
  umbra({ background }).apply({ target: pickerRef.value })
}

onMounted(() => applyPaint(color.value.hex))

function change(dye: OutputColor) {
  color.value = dye
  if (dye.mounted) return

  applyPaint(dye.hex)

  emit('change', {
    name: dye.name,
    color: colord(dye.hex),
    position: dye.position
  })
}

const compact = ref(props.compact)
const compactSize = ref(props.compactSize)
</script>

<template>
  <div
    ref="pickerRef"
    class="dyepicker-wrapper"
    :class="{ compact }"
    v-on-click-outside="() => (compact = true)"
  >
    <Pallet :color="color" :compact="compact" @click="() => (compact = false)" />
    <ColorCanvas
      @change="change"
      :colorCanvas="colorCanvas"
      :setColorCanvas="setColorCanvas"
      :color="color"
    />
    <HueCanvas @change="change" :colorCanvas="colorCanvas" :color="color" />
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
  display: grid;
  grid-template-columns: 1fr 25px;

  height: 400px;
  width: auto;

  max-height: 400px;
  max-width: 400px;

  border-radius: var(--radius);
  overflow: hidden;

  transition: 0.2s ease-in-out;
  .pallet {
    grid-column: span 2;
  }
}

.dyepicker-wrapper.compact {
  --compactSize: calc(v-bind(compactSize) * 1px);
  max-height: var(--compactSize);
  max-width: var(--compactSize);
}
</style>
