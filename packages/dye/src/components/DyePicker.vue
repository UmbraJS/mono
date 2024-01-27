<script setup lang="ts">
import tinycolor from "tinycolor2"
import { vOnClickOutside } from '@vueuse/components'

import { ref } from 'vue'
import { colorName } from "../composables/colorName"
import { hexType } from '../composables/canvas'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";

const emit = defineEmits(['change'])
const props = defineProps<{
  default: string;
}>()

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
  value: props.default,
})

function handleChange(hex?: hexType) {
  if (!hex) return
  const get = colorName(hex.color)
  const { name, value } = get()
  color.value = { name, value }

  emit('change', {
    name,
    value: tinycolor(value),
    position: hex.position
  })
}

const compact = ref(true)
const compactSize = ref(50)
const hueWidth = ref(25)
</script>

<template>
  <div 
    class="dyepicker-wrapper" 
    :class="{ compact }"
    v-on-click-outside="() => compact = true"
  >
    <div 
      ref="pallet" 
      class="pallet-wrapper"
    >
      <slot :color="color" >
        <Pallet
          :color="color"
          :hueWidth="hueWidth"
          :compact="compact"
          :compactSize="compactSize"
          @edit="() => compact = false"
        />
      </slot>
    </div>
    <ColorCanvas
      @change="handleChange"
      :getRef="getRef"
      :setRef="setRef"
      :color="color"
    />
    <HueCanvas
      @change="handleChange"
      :colorCanvas="getRef"
      :color="color"
      :width="hueWidth"
    />
  </div>
</template>

<style lang="scss" scoped>
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

  transition: .4s;
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
