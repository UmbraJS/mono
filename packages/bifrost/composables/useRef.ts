import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * A wrapper around Vue's ref that provides a functional setter pattern.
 * Returns a tuple with [getter, setter] similar to React's useState.
 */

export function useRef<T>(initialValue?: T): [Ref<T | undefined>, (el: T | undefined) => void] {
  // A ref that lets you pass its setter to a child component
  const element = ref<T | undefined>(initialValue) as Ref<T | undefined>
  function setElement(el: T | undefined) {
    element.value = el
  }
  return [element, setElement] as const
}
