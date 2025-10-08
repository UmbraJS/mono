<script setup lang="ts">
import { onMounted, computed } from 'vue'
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
  (e: 'update:open', open: boolean): void
}>()

interface DyeProps {
  default?: string
  open?: boolean
}

const props = withDefaults(defineProps<DyeProps>(), {
  default: '#ff0000'
})

// Provide isolated context for this DyePicker instance
const context = provideDyeContext(props.default)

// Logic
const internalCompact = ref(true)
const dye = context.dye

// Use controlled mode if open prop is provided (not undefined)
// Otherwise use uncontrolled mode with internal state
const compact = computed(() => {
  return props.open !== undefined ? !props.open : internalCompact.value
})

onMounted(() => dye.setColor(props.default, true))

function change(color: OutputColor) {
  dye.setColor(color)
  emit('change', {
    name: color.name,
    color: swatch(color.hex)
  })
}

function handleOpen() {
  if (props.open !== undefined) {
    // Controlled mode - emit event for parent to handle
    emit('update:open', true)
  } else {
    // Uncontrolled mode - update internal state
    internalCompact.value = false
  }
}

function handleClose() {
  if (props.open !== undefined) {
    // Controlled mode - emit event for parent to handle
    emit('update:open', false)
  } else {
    // Uncontrolled mode - update internal state
    internalCompact.value = true
  }
}
</script>

<template>
  <DyeWrapper :compact="compact" v-on-click-outside="handleClose">
    <Pallet :compact="compact" @click="handleOpen" />
    <ColorCanvas @change="change" :min="0" :max="100" />
    <HueCanvas @change="change" :min="0" :max="100" />
  </DyeWrapper>
</template>
