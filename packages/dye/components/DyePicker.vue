<script setup lang="ts">
import { onMounted } from 'vue'
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
const dye = useDye()

onMounted(() => dye.setColor(props.default, true))

function change(color: OutputColor) {
  dye.setColor(color)
  emit('change', {
    name: color.name,
    color: colord(color.hex)
  })
}

function clickOutside() {
  dye.setColor('#50b7be', true)
}
</script>

<template>
  <DyeWrapper :compact="compact" v-on-click-outside="clickOutside">
    <Pallet :compact="compact" @click="() => (compact = !compact)" />
    <ColorCanvas @change="change" :min="0" :max="100" />
    <HueCanvas @change="change" />
  </DyeWrapper>
</template>
