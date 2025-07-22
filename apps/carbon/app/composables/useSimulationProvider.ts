import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'
import { useSimulation } from '~/stores/useStore'
import type { Card, Character } from '../../types'

// Define the simulation type based on what useSimulation returns
type SimulationType = ReturnType<typeof useSimulation>

// Create a unique injection key
const simulationKey: InjectionKey<SimulationType> = Symbol('simulation')

// Composable to provide simulation to child components
export function useSimulationProvider(props: {
  userDeck: Card[],
  botDeck: Card[],
  userCharacters: Character[],
  botCharacters: Character[],
}) {
  const simulation = useSimulation(props)

  provide(simulationKey, simulation)

  return simulation
}

// Composable to inject simulation in child components
export function useSimulationInject() {
  const simulation = inject(simulationKey)

  if (!simulation) {
    throw new Error('useSimulationInject must be called within a component that has useSimulationProvider in its parent tree')
  }

  return simulation
}
