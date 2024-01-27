<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import { ref, watch } from 'vue'

const emit = defineEmits(['edit'])
const props = defineProps<{
  hueWidth: number
  compact: boolean
  compactSize: number
  color: {
    name: string
    value: string
  }
}>()

const pallet = ref<HTMLElement>()

watch(
  () => props.color,
  (color) => {
    if (!pallet.value) return
    umbra({
      background: color.value
    }).apply({ target: pallet.value })
  }
)

const copied = ref(false)

function copyToClipboard() {
  if (!navigator?.clipboard) return
  navigator.clipboard.writeText(props.color.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 800)
}

function handleClick() {
  props.compact ? emit('edit') : copyToClipboard()
}
</script>

<template>
  <div ref="pallet" class="pallet" :class="{ copied }" @click="handleClick">
    <div class="edit" v-if="compact">
      <p>Edit</p>
    </div>

    <div class="content">
      <p>{{ color.value }}</p>
      <p class="h3 name">{{ color.name }}</p>
    </div>

    <div class="shade" style="background: var(--base)"></div>
    <div class="shade" style="background: var(--base-10)"></div>
    <div class="shade" style="background: var(--base-20)"></div>

    <div class="cap">
      <p>{{ copied ? 'copied' : 'copy' }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pallet {
  position: relative;
  display: grid;
  --hueWidth: calc(v-bind(hueWidth) * 1px);
  grid-template-columns:
    1fr
    var(--hueWidth)
    var(--hueWidth);
  justify-content: center;
  align-items: center;

  background: var(--base);
  color: var(--base-120);
  height: 75px;
  user-select: none;
  cursor: pointer;
  * {
    margin: 0px;
    line-height: 1;
  }
}

.content {
  position: absolute;
  overflow: hidden;
  max-width: 80%;

  display: flex;
  flex-direction: column;
  padding: var(--space-s);
  p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.2;
  }
}

.shade {
  height: 100%;
}

.pallet.copied .cap {
  background-color: var(--base-20);
  animation: flash 0.6s ease-in-out;
}

@keyframes flash {
  0% {
    background-color: var(--base-100);
  }
  100% {
    background-color: var(--base-20);
  }
}

.edit {
  display: flex;
  justify-content: center;
  align-items: center;

  --size: calc(v-bind(compactSize) * 1px);
  width: var(--size);
  height: var(--size);

  position: absolute;
  left: 0px;
  top: 0px;
}

.cap {
  border-radius: var(--radius);
  position: absolute;
  right: var(--space-s);
  background-color: var(--base-20);
  padding: var(--space-s);
  min-width: 60px;

  clip-path: circle(0%);
  transition: 0.2s;
}

.pallet:hover .cap {
  clip-path: circle(100%);
}

.compact .pallet {
  .content p,
  .shade,
  .cap {
    opacity: 0;
  }
}
</style>
