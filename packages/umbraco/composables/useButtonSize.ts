import { computed, type Ref } from 'vue'

export type ComponentSize = 'mini' | 'small' | 'medium'

const sizeClassMap: Record<ComponentSize, string> = {
  mini: 'buttonMini',
  small: 'buttonSmall',
  medium: 'buttonMedium',
}

/**
 * Returns a computed CSS class name based on the component size
 * @param size - The size prop (reactive or static)
 * @param defaultSize - The default size to use if size is undefined
 * @returns Computed CSS class name
 */
export function useButtonSize(
  size: Ref<ComponentSize | undefined> | ComponentSize | undefined,
  defaultSize: ComponentSize = 'medium'
) {
  return computed(() => {
    const sizeValue = typeof size === 'object' && 'value' in size ? size.value : size
    return sizeClassMap[sizeValue ?? defaultSize]
  })
}
