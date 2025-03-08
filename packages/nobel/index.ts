import { toast } from 'vue-sonner'

import { presetNobel } from './uno.config'

import Input from './components/ui/Input.vue'
import Select from './components/ui/Select.vue'
import Button from './components/ui/Button/Button.vue'
import ButtonGroup from './components/ui/Button/ButtonGroup.vue'
import ButtonToggle from './components/ui/Button/Toggle.vue'
import AddButton from './components/ui/Button/presets/AddButton.vue'
import Toggle from './components/ui/Toggle.vue'
import Toaster from './components/ui/Toaster.vue'
import {
  DialogRoot,
  DialogTrigger,
  Dialog,
  DialogModal,
  DialogClose,
} from './components/ui/Dialog/index'

import Chip from './components/ui/Chip/Chip.vue'

import Radio from './components/ui/Radio/Radio.vue'
import Slider from './components/ui/Slider/Slider.vue'

import IconAdd from './components/Icons/IconAdd.vue'
import IconClose from './components/Icons/IconClose.vue'
import IconHome from './components/Icons/IconHome.vue'
import IconPaint from './components/Icons/IconPaint.vue'
import IconText from './components/Icons/IconText.vue'
import IconUI from './components/Icons/IconUI.vue'
import IconWidth from './components/Icons/IconWidth.vue'

import SVG from './components/Icons/SVG.vue'

export { toast }
export { IconAdd, IconClose, IconHome, IconPaint, IconText, IconUI, IconWidth, SVG }
export {
  Button,
  ButtonGroup,
  Select,
  Toggle,
  ButtonToggle,
  AddButton,
  Chip,
  Radio,
  Slider,
  Toaster,
  Input,
  Dialog,
  DialogModal,
  DialogRoot,
  DialogTrigger,
  DialogClose,
}
export { presetNobel }
