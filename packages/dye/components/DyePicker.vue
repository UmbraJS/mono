<script setup lang="ts">
import { colord } from 'colord'
import type { Colord } from 'colord'
import { vOnClickOutside } from '@vueuse/components'
import { ref } from 'vue'
import { OutputColor } from '../composables/canvas'
import { useDye } from '../composables/useDye'
import Pallet from './Pallet.vue'
import ColorCanvas from './Canvas/ColorCanvas.vue'
import HueCanvas from './Canvas/HueCanvas.vue'
import DyeWrapper from './DyeWrapper.vue'

// Props
interface Dye {
  name: string
  color: Colord
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

// Logic
const compact = ref(props.compact)
const { color, colorCanvas, setColorCanvas, wrapper } = useDye(props.default)

function change(dye: OutputColor) {
  color.value = dye
  emit('change', {
    name: dye.name,
    color: colord(dye.hex)
  })
}

function clickOutside() {
  color.value = {
    hex: '#ff0000',
    name: 'ccool'
  }
}
</script>

<template>
  <DyeWrapper ref="wrapper" :compact="compact" v-on-click-outside="clickOutside">
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
