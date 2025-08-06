import BifrostCarbon from '../components/BifrostCarbon.vue'
import BifrostFiber from '../components/BifrostFiber.vue'

/**
 * Represents a connection between two carbon components via fiber.
 * Connections can be either horizontal (output-input) or vertical (source-sink).
 */
export interface BifrostFiberConnections {
  /** Unique identifier for the connection */
  id: string
  /** Reference to the fiber component rendering this connection (is only optional because the component might not have loaded) */
  component?: InstanceType<typeof BifrostFiber>
  /**
   * Type of connection:
   * - 'output-input': Horizontal connection (left-right sides of carbons)
   * - 'source-sink': Vertical connection (top-bottom sides of carbons)
   */
  type: 'output-input' | 'source-sink'
  /** Origin point of the connection */
  output: {
    /** ID of the carbon component this connection originates from */
    carbon: string
    /** Index of the hook on the origin carbon */
    hook: number
    /** Reference to the origin carbon component (is only optional because the component might not have loaded) */
    component?: InstanceType<typeof BifrostCarbon>
  }
  /** Destination point of the connection */
  input: {
    /** ID of the carbon component this connection terminates at */
    carbon: string
    /** Index of the hook on the destination carbon */
    hook: number
    /** Reference to the destination carbon component (is only optional because the component might not have loaded) */
    component?: InstanceType<typeof BifrostCarbon>
  }
}

/**
 * Represents a carbon component in the Bifrost system.
 * Carbon components are nodes that can be connected via fiber connections.
 */
export interface CarbonObject {
  /** Unique identifier for the carbon component */
  id: string
  /** Optional reference to the carbon component instance */
  component?: InstanceType<typeof BifrostCarbon>
  /** Position of the carbon component as [x, y] coordinates */
  position: [number, number]
  /** Array of connection IDs that this carbon is part of */
  connections: string[]
  /** Array of hook points available on this carbon */
  hooks: Hook[]
}

/**
 * Hook types define the connection points on carbon components:
 * - 'input': Right side of carbon - receives horizontal fiber connections
 * - 'output': Left side of carbon - sends horizontal fiber connections
 * - 'sink': Bottom side of carbon - receives vertical fiber connections
 * - 'source': Top side of carbon - sends vertical fiber connections
 */
export type HookType = 'input' | 'output' | 'sink' | 'source'

/**
 * Represents a connection point (hook) on a carbon component.
 * Hooks are positioned on different sides of the carbon based on their type.
 */
export interface Hook {
  /** Position index of this hook among hooks of the same type */
  index: number
  /** Whether this hook is currently connected to a fiber */
  active: boolean
  /**
   * Type of hook determining its position on the carbon:
   * - 'input': Right side - for receiving horizontal connections
   * - 'output': Left side - for sending horizontal connections
   * - 'sink': Bottom side - for receiving vertical connections
   * - 'source': Top side - for sending vertical connections
   */
  type: HookType
}
