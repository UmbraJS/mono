import { ref } from 'vue'

export function useRef<T>(initialValue?: T) {
  // A ref that lets you pass its setter to a child component
  const element = ref<T | undefined>(initialValue)
  function setElement(el: any) {
    element.value = el
  }
  return [element, setElement] as const
}
