import Carbon from '../components/BifrostCarbon.vue'
import Fiber from '../components/BifrostFiber.vue'

export interface Connection {
  id: string
  component?: InstanceType<typeof Fiber>
  type: 'output-input' | 'source-sink'
  output: {
    carbon: string
    hook: number
    component?: InstanceType<typeof Carbon>
  }
  input: {
    carbon: string
    hook: number
    component?: InstanceType<typeof Carbon>
  }
}

export interface CarbonObject {
  id: string
  component?: InstanceType<typeof Carbon>
  position: [number, number]
  connections: string[]
  hooks: Hook[]
}

export type HookType = 'input' | 'output' | 'source' | 'sink'

export interface Hook {
  index: number
  active: boolean
  type: HookType
}
