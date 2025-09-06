<script lang="ts">
import {
  h,
  resolveComponent as vueResolveComponent,
  reactive,
  watch,
  Text,
  Comment,
  defineAsyncComponent,
  defineComponent,
  toRaw,
  computed,
  getCurrentInstance,
} from 'vue'
import { kebabCase, pascalCase } from 'scule'
import { find, html } from 'property-information'
import type { VNode, ConcreteComponent, PropType } from 'vue'
import type { MDCElement, MDCNode, MDCRoot, MDCData, MDCRenderOptions } from '@nuxtjs/mdc'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import htmlTags from './html-tags-list'
import { flatUnwrap, nodeTextContent } from './node'
import { pick } from './utils'

type CreateElement = typeof h

interface PropTypes {
  body: MDCRoot
  data: MDCData
  class: string
  tag: string | boolean
  unwrap: string | boolean
}

interface ContextOut {
  tags: TagMap
  contentKey: string
  route: RouteLocationNormalizedLoaded | undefined
  runtimeData: {
    [x: string]: any
  }
}

interface ContextIn {
  tags: TagMap
  contentKey: globalThis.ComputedRef<string>
  route: RouteLocationNormalizedLoaded | undefined
  runtimeData: {
    [x: string]: any
  }
}

/**
 *  Default slot name
 */
const DEFAULT_SLOT = 'default'
const specialParentTags = ['math', 'svg']

const tagMap = {
  p: 'prose-p',
  a: 'prose-a',
  blockquote: 'prose-blockquote',
  code: 'prose-code',
  pre: 'prose-pre',
  em: 'prose-em',
  h1: 'prose-h1',
  h2: 'prose-h2',
  h3: 'prose-h3',
  h4: 'prose-h4',
  h5: 'prose-h5',
  h6: 'prose-h6',
  hr: 'prose-hr',
  img: 'prose-img',
  ul: 'prose-ul',
  ol: 'prose-ol',
  li: 'prose-li',
  strong: 'prose-strong',
  table: 'prose-table',
  thead: 'prose-thead',
  tbody: 'prose-tbody',
  td: 'prose-td',
  th: 'prose-th',
  tr: 'prose-tr',
  script: 'prose-script',
} as const

type Tag = keyof typeof tagMap
type TagMap = typeof tagMap

function useAsignedWatch<T extends object>(data: T) {
  const runtimeData = reactive({
    ...data,
  })

  watch(
    () => data,
    (newData) => {
      Object.assign(runtimeData, newData)
    },
  )

  return runtimeData
}

export default defineComponent({
  props: {
    /**
     * Content to render
     */
    body: {
      type: Object as PropType<MDCRoot>,
      required: true,
    },
    /**
     * Document meta data
     */
    data: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Class(es) to bind to the component
     */
    class: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * Root tag to use for rendering
     */
    tag: {
      type: [String, Boolean],
      default: undefined,
    },
    /**
     * Tags to unwrap separated by spaces
     * Example: 'ul li'
     */
    unwrap: {
      type: [Boolean, String],
      default: false,
    },
  },
  async setup(props) {
    const $nuxt = getCurrentInstance()?.appContext?.app?.$nuxt
    const route: RouteLocationNormalizedLoaded | undefined = $nuxt?._route

    const tags: TagMap = {
      ...tagMap,
      ...toRaw(props.data?.mdc?.components || {}),
    }

    const contentKey = computed(() => {
      const components = props.body.children
        .map((n) => (n as MDCElement).tag || n.type)
        .filter((t) => !htmlTags.includes(t))
      console.log('components', components)
      return Array.from(new Set(components)).sort().join('.')
    })

    await resolveContentComponents(props.body, tags)

    const runtimeData = useAsignedWatch(props.data)
    return { tags, contentKey, route, runtimeData } as ContextIn
  },
  render(ctx: ContextOut & PropTypes) {
    const { tags, tag, body, data, contentKey, route, unwrap, runtimeData } = ctx
    if (!body) return null
    const meta = { ...data, tags, $route: route, runtimeData }

    // Resolve root component
    const component: string | ConcreteComponent =
      tag !== false ? resolveComponentInstance((tag || 'div') as string) : undefined

    // Return Vue component
    return h(
      component,
      { class: ctx.class, ...this.$attrs, key: contentKey },
      { default: defaultSlotRenderer },
    )

    function defaultSlotRenderer() {
      const defaultSlot = _renderSlots(body, h, {
        documentMeta: meta,
        parentScope: meta,
        resolveComponent: resolveComponentInstance,
      })
      if (!defaultSlot?.default) return null
      if (!unwrap) return defaultSlot.default()
      return flatUnwrap(
        defaultSlot.default(),
        typeof unwrap === 'string' ? unwrap.split(' ') : ['*'],
      )
    }
  },
})

/**
 * Render a markdown node
 */
function _renderNode(node: MDCNode, h: CreateElement, options: MDCRenderOptions): VNode {
  const { documentMeta, parentScope, resolveComponent } = options
  /**
   * Render Text node
   */
  if (node.type === 'text') {
    return h(Text, node.value)
  }

  if (node.type === 'comment') {
    return h(Comment, null, node.value)
  }

  const originalTag = node.tag!
  // `_ignoreMap` is an special prop to disables tag-mapper
  const renderTag: string = findMappedTag(node as MDCElement, documentMeta.tags)

  if (node.tag === 'binding') {
    return renderBinding(node, h, documentMeta, parentScope)
  }

  const _resolveComponent = isUnresolvableTag(renderTag)
    ? (component: unknown) => component
    : resolveComponent

  // Prevent script execution by converting script tags to pre tags
  // This code will excute only when prose components are disabled, otherwise the script will be handled by ProseScript component
  if (renderTag === 'script') {
    return h(
      'pre',
      { class: 'script-to-pre' },
      '<' + 'script' + '>\n' + nodeTextContent(node) + '\n<' + '/script' + '>',
    )
  }

  const component = _resolveComponent(renderTag)
  if (typeof component === 'object') {
    component.tag = originalTag
  }

  const props = propsToData(node)

  return h(
    component,
    props,
    _renderSlots(node, h, {
      documentMeta,
      parentScope: { ...parentScope, ...props },
      resolveComponent: _resolveComponent,
    }),
  )
}
/**
 * Create slots from `node` template children.
 */
function _renderSlots(
  node: MDCNode | MDCRoot,
  h: CreateElement,
  options: MDCRenderOptions,
): Record<string, () => VNode[]> {
  const { documentMeta, parentScope, resolveComponent } = options
  const children: MDCNode[] = (node as MDCElement).children || []

  console.log('rex in render: ', node)

  const slotNodes: Record<string, { props?: Record<string, any>; children: MDCNode[] }> =
    children.reduce(
      (data, node) => {
        if (!isTemplate(node)) {
          data[DEFAULT_SLOT].children.push(node)
          return data
        }

        const slotName = getSlotName(node)

        console.log('rex slotName: ', slotName)
        data[slotName] = data[slotName] || { props: {}, children: [] }
        if (node.type === 'element') {
          data[slotName].props = node.props
          // Append children to slot
          data[slotName].children.push(...(node.children || []))
        }

        return data
      },
      {
        [DEFAULT_SLOT]: { props: {}, children: [] },
      } as Record<string, { props?: Record<string, any>; children: MDCNode[] }>,
    )

  const slots = Object.entries(slotNodes).reduce(
    (slots, [name, { props, children }]) => {
      if (!children.length) {
        return slots
      }

      slots[name] = (data = {}) => {
        const scopedProps = pick(data, Object.keys(props || {}))
        let vNodes = children.map((child) =>
          _renderNode(child, h, {
            documentMeta,
            parentScope: { ...parentScope, ...scopedProps },
            resolveComponent,
          }),
        )

        if (props?.unwrap) {
          vNodes = flatUnwrap(vNodes, props.unwrap) as VNode[]
        }
        return mergeTextNodes(vNodes)
      }

      return slots
    },
    {} as Record<string, (data?: Record<string, any>) => VNode[]>,
  )

  return slots
}

function renderBinding(
  node: MDCElement,
  h: CreateElement,
  documentMeta: MDCData,
  parentScope: any = {},
): VNode {
  const data = {
    ...documentMeta.runtimeData,
    ...parentScope,
    $document: documentMeta,
    $doc: documentMeta,
  }
  const splitter = /\.|\[(\d+)\]/
  const keys: string[] = node.props?.value.trim().split(splitter).filter(Boolean)
  const value = keys.reduce((data, key) => {
    if (data && key in data) {
      if (typeof data[key] === 'function') {
        return data[key]()
      } else {
        return data[key]
      }
    }
    return undefined
  }, data)
  const defaultValue = node.props?.defaultValue

  return h(Text, value ?? defaultValue ?? '')
}

/**
 * Create component data from node props.
 */
function propsToData(node: MDCElement) {
  const { props = {} } = node
  return Object.keys(props).reduce(function (data, key) {
    // Ignore internal `__ignoreMap` prop.
    if (key === '__ignoreMap') {
      return data
    }

    const value = props[key]
    const { attribute } = find(html, key)

    // Join string arrays using space, see: https://github.com/nuxt/content/issues/247
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      data[attribute] = value.join(' ')
      return data
    }

    data[attribute] = value

    return data
  }, {} as any)
}

/**
 * Resolve component if it's a Vue component
 */
const resolveComponentInstance = (component: TagMap[keyof TagMap]) => {
  if (typeof component !== 'string') return component

  if (htmlTags.includes(component)) {
    return component
  }

  const _component = vueResolveComponent(pascalCase(component), false)

  if (!component || _component?.name === 'AsyncComponentWrapper') {
    return _component
  }

  if (typeof _component === 'string') {
    return _component
  }

  if ('setup' in _component) {
    return defineAsyncComponent(() => new Promise((resolve) => resolve(_component)))
  }

  return _component
}

/**
 * Get the slot name from a node.
 * @param node - The MDCNode to extract the slot name from.
 * @returns The slot name or the default slot if none is found.
 */
function getSlotName(node: MDCNode): string {
  // Ensure the node has props and is of type MDCElement
  if (!isMDCElement(node)) {
    return DEFAULT_SLOT
  }

  const props = node.props || {}
  for (const propName of Object.keys(props)) {
    // Check if the prop name corresponds to a slot
    if (propName.startsWith('#') || propName.startsWith('v-slot:')) {
      // Extract and return the slot name
      const [, slotName] = propName.split(/[:#]/, 2)
      return slotName || DEFAULT_SLOT
    }
  }

  return DEFAULT_SLOT
}

/**
 * Type guard to check if a node is an MDCElement.
 */
function isMDCElement(node: MDCNode): node is MDCElement {
  return (node as MDCElement).props !== undefined
}

/**
 * Check if node is Vue template tag
 */
function isTemplate(node: MDCNode): node is MDCElement {
  return (node as MDCElement).tag === 'template'
}

/**
 * Check if tag is a special tag that should not be resolved to a component
 */
function isUnresolvableTag(tag: unknown) {
  return specialParentTags.includes(tag as string)
}

/**
 * Merge consequent Text nodes into single node
 */
function mergeTextNodes(nodes: Array<VNode>) {
  const mergedNodes: Array<VNode> = []
  for (const node of nodes) {
    const previousNode = mergedNodes[mergedNodes.length - 1]
    if (node.type === Text && previousNode?.type === Text) {
      previousNode.children = (previousNode.children as string) + node.children
    } else {
      mergedNodes.push(node)
    }
  }
  return mergedNodes
}

async function resolveContentComponents(body: MDCRoot, tags: TagMap) {
  if (!body) return

  const components = Array.from(new Set(loadComponents(body, tags))) as Tag[]
  await Promise.all(
    components.map(async (c) => {
      const resolvedComponent = resolveComponentInstance(c)
      if (resolvedComponent?.__asyncLoader && !resolvedComponent.__asyncResolved) {
        await resolvedComponent.__asyncLoader()
      }
    }),
  )
}

function loadComponents(node: MDCRoot | MDCNode, tags: TagMap) {
  const tag = (node as MDCElement).tag
  if (node.type === 'text') return []
  if (node.type === 'comment') return []
  if (tag === 'binding') return []

  const renderTag = findMappedTag(node as MDCElement, tags)

  if (isUnresolvableTag(renderTag)) return []

  const components: string[] = []

  if (node.type !== 'root' && !htmlTags.includes(renderTag)) {
    components.push(renderTag)
  }
  for (const child of node.children || []) {
    components.push(...loadComponents(child, tags))
  }
  return components
}

function findMappedTag({ tag }: MDCElement, tags: TagMap) {
  const tagged = tags[tag as Tag]
  if (tagged) return tagged
  const taggedPascal = tags[pascalCase(tag) as Tag]
  if (taggedPascal) return taggedPascal
  const taggedKebab = tags[kebabCase(tag) as Tag]
  if (taggedKebab) return taggedKebab
  return tag as Tag
}
</script>
