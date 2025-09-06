declare module 'motion-v' {
  interface MotionProps {
    class?: string
    animate?: Record<string, unknown>
    transition?: Record<string, unknown>
  }
  // minimal component typing compatible with Vue's defineComponent usage
  export const motion: {
    div: new () => {
      $props: MotionProps
    }
  }
}
