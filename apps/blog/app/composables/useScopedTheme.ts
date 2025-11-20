import { onMounted, useTemplateRef, type Ref, type ComponentPublicInstance } from 'vue'
import { umbra } from '@umbrajs/core'
import { useUmbra } from './useUmbra'

/**
 * Apply a scoped theme to an element with a unique color accent.
 *
 * @param refName - The template ref name for the target element
 * @param accentColor - Reactive color value or ref for the accent
 * @returns The template ref for use in the template
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const props = defineProps<{ color: string }>()
 * const templateRef = useScopedTheme('myRef', () => props.color)
 * </script>
 *
 * <template>
 *   <div ref="myRef">
 *     <!-- Content with scoped theme -->
 *   </div>
 * </template>
 * ```
 */
export function useScopedTheme(
  refName: string,
  accentColor: (() => string) | Ref<string> | string
) {
  const theme = useUmbra()
  const templateRef = useTemplateRef<ComponentPublicInstance | HTMLElement>(refName)

  onMounted(() => {
    if (!templateRef.value) return

    // Handle both component instances (with $el) and raw HTML elements
    const el = '$el' in templateRef.value ? templateRef.value.$el : templateRef.value
    if (!el) return

    const color = typeof accentColor === 'function'
      ? accentColor()
      : typeof accentColor === 'string'
        ? accentColor
        : accentColor.value

    umbra({
      foreground: theme.input.foreground,
      background: theme.input.background,
      accents: [color],
    }).apply({ target: el })
  })

  return templateRef
}
