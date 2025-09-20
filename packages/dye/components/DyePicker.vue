<script setup lang="ts">
import { onMounted } from 'vue'
import { swatch, UmbraSwatch } from '../../umbra/swatch'
import { vOnClickOutside } from '@vueuse/components'
import { ref } from 'vue'
import type { OutputColor } from '../composables/canvas'
import { provideDyeContext } from '../composables/useDyeContext'
import Pallet from './Pallet.vue'
import ColorCanvas from './Canvas/ColorCanvas.vue'
import HueCanvas from './Canvas/HueCanvas.vue'
import DyeWrapper from './DyeWrapper.vue'

// Props
interface Dye {
  name: string
  color: UmbraSwatch
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
  compact: true
})

// Provide isolated context for this DyePicker instance
const context = provideDyeContext(props.default)

// Logic
const compact = ref(props.compact)
const dye = context.dye

onMounted(() => dye.setColor(props.default, true))

function change(color: OutputColor) {
  dye.setColor(color)
  emit('change', {
    name: color.name,
    color: swatch(color.hex)
  })
}
</script>

<template>
  <DyeWrapper :compact="compact" v-on-click-outside="() => (compact = true)">
    <Pallet :compact="compact" @click="() => (compact = false)" />
    <ColorCanvas @change="change" :min="0" :max="100" />
    <HueCanvas @change="change" :min="0" :max="100" />
  </DyeWrapper>
</template>
