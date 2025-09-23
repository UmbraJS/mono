import { toast } from 'vue-sonner'
import { defineAsyncComponent, defineComponent } from 'vue'

// Composables
export { useButtonSize, type ComponentSize } from './composables/useButtonSize'

// Components
export { default as Button } from './components/ui/Button/Button.vue'
export { default as ButtonGroup } from './components/ui/Button/ButtonGroup.vue'
export { default as AddButton } from './components/ui/Button/presets/AddButton.vue'
export { default as ButtonToggle } from './components/ui/Button/Toggle.vue'
export { default as Chip } from './components/ui/Chip/Chip.vue'
export {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogModal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './components/ui/Dialog/index'
export { default as Input } from './components/ui/Input.vue'
export { default as TextArea } from "./components/ui/TextArea.vue"
export { default as PixelTransition } from './components/ui/PixelTransition.vue'
export { default as Radio } from './components/ui/Radio/Radio.vue'
export { default as ScrollArea } from './components/ui/ScrollArea.vue'
export { default as Select } from './components/ui/Select.vue'
export { default as Slider } from './components/ui/Slider/Slider.vue'
export { default as TabButton } from './components/ui/Tabs/TabButton.vue'
export { default as Tabs } from './components/ui/Tabs/Tabs.vue'
export { default as Toaster } from './components/ui/Toaster.vue'
export { default as Toggle } from './components/ui/Toggle.vue'
export { default as Tooltip } from './components/ui/Tooltip.vue'
export {
  Drawer,
  DrawerButton,
  DrawerHandle,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
  DrawerDescription,
  DrawerTitle
} from './components/ui/Drawer/index'
// SSR-safe Graph export: only load @unovis/vue on the client to avoid Emotion SSR issues
export const Graph = (import.meta as any).client
  ? defineAsyncComponent(() => import('./components/graph/Graph.vue'))
  : defineComponent({ name: 'GraphSSRStub', setup: () => () => null })

export { toast }
