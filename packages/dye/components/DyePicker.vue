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
import DyeWrapper from './DyeWrapper.vue'

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
}

const props = withDefaults(defineProps<DyeProps>(), {
  default: '#ff0000',
  compact: false
})

const color = ref({
  name: 'red',
  hex: props.default
})

const [colorCanvas, setColorCanvas] = useColorCanvas()
const pickerRef = ref<HTMLElement | null>(null)

function paintComponent(background: string) {
  if (!pickerRef.value) return
  console.log('lolers', pickerRef.value)
  umbra({ background }).apply({ target: pickerRef.value })
}

onMounted(() => paintComponent(color.value.hex))

function change(dye: OutputColor) {
  if (dye.mounted) return

  color.value = dye
  paintComponent(dye.hex)

  emit('change', {
    name: dye.name,
    color: colord(dye.hex),
    position: dye.position
  })
}

const compact = ref(props.compact)
</script>

<template>
  <DyeWrapper ref="pickerRef" :compact="compact" v-on-click-outside="() => (compact = true)">
    <Pallet :color="color" :compact="compact" @click="() => (compact = false)" />
    <ColorCanvas
      @change="change"
      :colorCanvas="colorCanvas"
      :setColorCanvas="setColorCanvas"
      :color="color"
    />
    <HueCanvas @change="change" :colorCanvas="colorCanvas" :color="color" />
  </DyeWrapper>
</template>

<style lang="scss" scoped>
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
  --compactSize: 50px;
  max-height: var(--compactSize);
  max-width: var(--compactSize);
}
</style>
