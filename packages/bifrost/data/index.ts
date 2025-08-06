import { ref } from 'vue'
import type { CarbonObject, BifrostFiberConnections, Hook } from '../types'

const input1: Hook = {
  index: 0,
  active: false,
  type: 'input'
}

const input2: Hook = {
  index: 1,
  active: false,
  type: 'input'
}

const output1: Hook = {
  index: 0,
  active: false,
  type: 'output'
}

const output2: Hook = {
  index: 1,
  active: false,
  type: 'output'
}

export const hooks = [input1, input2, output1, output2]

const c: BifrostFiberConnections[] = [
  {
    id: 'con-1',
    component: undefined,
    type: 'output-input',
    output: {
      carbon: '1',
      hook: 0,
      component: undefined
    },
    input: {
      carbon: '2',
      hook: 0,
      component: undefined
    }
  },
  {
    id: 'con-2',
    component: undefined,
    type: 'output-input',
    output: {
      carbon: '2',
      hook: 1,
      component: undefined
    },
    input: {
      carbon: '3',
      hook: 0,
      component: undefined
    }
  },
  {
    id: 'con-3',
    component: undefined,
    type: 'output-input',
    output: {
      carbon: '2',
      hook: 0,
      component: undefined
    },
    input: {
      carbon: '5',
      hook: 0,
      component: undefined
    }
  },
  {
    id: 'con-4',
    component: undefined,
    type: 'output-input',
    output: {
      carbon: '3',
      hook: 0,
      component: undefined
    },
    input: {
      carbon: '4',
      hook: 0,
      component: undefined
    }
  }
]

const n: CarbonObject[] = [
  {
    id: '1',
    component: undefined,
    position: [100, 100],
    connections: ['con-1'],
    hooks: [input1, input2, output1, output2]
  },
  {
    id: '2',
    component: undefined,
    position: [275, 275],
    connections: ['con-2', 'con-3'],
    hooks: [input1, input2, output1, output2]
  },
  {
    id: '3',
    component: undefined,
    position: [450, 450],
    connections: ['con-4'],
    hooks: [input1, input2, output1, output2]
  },
  {
    id: '4',
    component: undefined,
    position: [600, 600],
    connections: ['con-4'],
    hooks: [input1, input2, output1, output2]
  },
  {
    id: '5',
    component: undefined,
    position: [500, 200],
    connections: ['con-3'],
    hooks: [input1, input2, output1, output2]
  }
]

export function useCarbonQuery() {
  const connections = ref<BifrostFiberConnections[]>(c)
  const carbons = ref<CarbonObject[]>(n)

  return { carbons, connections }
}
