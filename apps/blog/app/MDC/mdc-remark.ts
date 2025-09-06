import type { MDCNode, Parents as HastParents, Element, MDCElement } from '@nuxtjs/mdc'
import { defaultHandlers, toMdast } from 'hast-util-to-mdast'
import type { Root as HastRoot, RootContent, Text } from 'hast'
import { nodeTextContent } from '@nuxtjs/mdc/runtime/utils/node'
import type { State, Options as ToMdastOptions } from 'hast-util-to-mdast'
import { hasProtocol } from 'ufo'
import type { Nodes, Root as MDastRoot } from 'mdast'
import { toHtml } from 'hast-util-to-html'
import { visit } from 'unist-util-visit'
import { format } from 'hast-util-format'
import type { VFile } from 'vfile'

function computeHighlightRanges(input: string[] | string) {
  const numbers = Array.isArray(input) ? input.map(Number) : input.split(',').map(Number) // Convert string to array of numbers
  const ranges = []
  let start = numbers[0]

  for (let i = 1; i <= numbers.length; i++) {
    if (numbers[i] !== numbers[i - 1] + 1) {
      if (start === numbers[i - 1]) {
        ranges.push(`${start}`)
      } else {
        ranges.push(`${start}-${numbers[i - 1]}`)
      }
      start = numbers[i]
    }
  }

  return ranges.join(',')
}

function refineCodeLanguage(language?: string) {
  return String(language || '').trim()
}

/**
 * Since toMdast state uses `element` as special type and unwraps it if `node.tagName` is not in `handlers`,
 * we need to use a custom type to avoid this behavior.
 *
 * @see https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/state.js#L258-L283
 */
const mdcRemarkElementType = 'mdc-element'
const own = {}.hasOwnProperty
type Parents = HastParents & { properties: Record<string, unknown>; tagName: string }

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Options extends ToMdastOptions {}

export function mdcRemark(options?: Options | undefined | null) {
  return function (node: HastRoot, _file: VFile) {
    const tree = preProcessElementNodes(node as unknown as MDCNode)

    // return node as unknown as Root
    const mdast = toMdast(tree, {
      /**
       * Default to true in rehype-remark
       * @see https://github.com/rehypejs/rehype-remark/blob/main/lib/index.js#L37ckages/remark/lib/index.js#L100
       */
      document: true,
      newlines: true,
      ...options,
      handlers: {
        ...mdcRemarkHandlers,
        ...options?.handlers,
      } as Options['handlers'],
      nodeHandlers: {
        ...mdcRemarkNodeHandlers,
        ...options?.nodeHandlers,
      } as Options['nodeHandlers'],
    }) as MDastRoot

    return mdast
  }
}

function preProcessElementNodes(node: MDCNode): RootContent {
  if (node.type === 'element') {
    if (
      node.children?.length &&
      (node.children || []).every((child: MDCNode) => (child as MDCElement).tag === 'template')
    ) {
      // TODO: move it to remark-mdc
      node.children = (node as MDCElement).children.flatMap((child) => {
        if (
          typeof (child as MDCElement).props?.['v-slot:default'] !== 'undefined' &&
          Object.keys((child as MDCElement).props!).length === 1
        ) {
          return (child as MDCElement).children || []
        }
        return child
      })
    }

    const result = {
      type: mdcRemarkElementType,
      tagName: node.tag,
      properties: node.props,
      children: (node.children || []).map(preProcessElementNodes),
    } as unknown as RootContent

    // If there is no children in node, delete `children` property from node
    // `hast-util-minify-whitespace` checks for `children` property to remove whitespaces,
    // and having empty children will cause lossing a necessary whitespace(e.g. `:component text after` -> `:componenttext after`)
    if (!node.children?.length) {
      // @ts-expect-error: custom type
      delete result.children
    }

    return result
  }

  if ((node as unknown as MDCElement)?.children) {
    return {
      ...node,
      children: ((node as unknown as MDCElement).children || []).map(preProcessElementNodes),
    } as unknown as RootContent
  }

  return node
}

const mdcRemarkNodeHandlers = {
  [mdcRemarkElementType]: (state: State, node: Parents, parent: Parents) => {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(state.handlers, node.tagName)) {
      return state.handlers[node.tagName](state, node as Element, parent) || undefined
    }

    // Unknown literal.
    if ('value' in node && typeof node.value === 'string') {
      const result: Text = { type: 'text', value: node.value }
      state.patch(node, result)
      return result
    }

    const isInlineElement =
      (parent?.children || []).some((child) => child.type === 'text') ||
      ['p', 'li'].includes(parent?.tagName)
    if (isInlineElement) {
      return {
        type: 'textComponent',
        name: node.tagName,
        attributes: node.properties,
        children: state.all(node),
      }
    }

    return {
      type: 'containerComponent',
      name: node.tagName,
      attributes: node.properties,
      children: state.all(node),
    }
  },
}

const mdcRemarkHandlers: Record<string, (state: State, node: Parents) => unknown> = {
  template: (state: State, node: Parents) => {
    const vSlot =
      Object.keys(node.properties || {})
        .find((prop) => prop?.startsWith('v-slot:'))
        ?.replace('v-slot:', '') || 'default'

    // all props execpt v-slot
    const attributes = Object.fromEntries(
      Object.entries(node.properties || {}).filter(([key]) => !key.startsWith('v-slot:')),
    )

    return {
      type: 'componentContainerSection',
      name: vSlot,
      attributes,
      children: state.toFlow(state.all(node)),
    }
  },
  div: (state: State, node: Parents) => {
    return {
      type: 'containerComponent',
      name: 'div',
      attributes: node.properties,
      children: state.toFlow(state.all(node)),
    }
  },
  code: (state: State, node: Parents) => {
    const attributes = { ...node.properties }
    if ('style' in attributes && !attributes.style) {
      delete attributes.style
    }
    if ('class' in attributes) {
      attributes.className = String(attributes.class).split(' ').filter(Boolean)
      delete attributes.class
    }
    // Filter out language- prefixed classes, they are added by tiptap
    if (Array.isArray(attributes.className)) {
      attributes.className = attributes.className.filter((name) => !name.startsWith('language-'))
      if (Array.isArray(attributes.className) && !attributes.className.length) {
        delete attributes.className
      }
    }

    // lang is shorthand for language and is more MDC compatible
    if (attributes.language) {
      attributes.lang = refineCodeLanguage(attributes.language as string)
      delete attributes.language
    }

    const result = {
      type: 'inlineCode',
      value: nodeTextContent(node as unknown as MDCNode),
      attributes,
    }

    state.patch(node, result as Nodes)

    return result
  },
  pre: (_state: State, node: Parents) => {
    const meta = [
      node.properties.filename ? `[${String(node.properties.filename).replace(/\]/g, '\\]')}]` : '',
      (node.properties.highlights as string[])?.length
        ? `{${computeHighlightRanges(node.properties.highlights as string[])}}`
        : '',
      node.properties.meta,
    ]
      .filter(Boolean)
      .join(' ')

    // Remove trailing newline, This is to avoid the newline being rendered in the output
    const value = String(node.properties.code || '').replace(/\n$/, '')

    return {
      type: 'code',
      value,
      lang: refineCodeLanguage(node.properties.language as string),
      meta,
    }
  },
  binding: (state: State, node: Parents) => {
    return {
      type: 'textComponent',
      name: 'binding',
      attributes: node.properties,
      children: state.toFlow(state.all(node)),
    }
  },
  span: (state: State, node: Parents) => {
    const result = {
      type: 'textComponent',
      name: 'span',
      attributes: node.properties,
      children: state.all(node),
    }

    state.patch(node, result as Nodes)

    return result
  },
  video: (state: State, node: Parents) => {
    return {
      type: 'textComponent',
      name: 'video',
      attributes: node.properties,
      children: state.toFlow(state.all(node)),
    }
  },
  'nuxt-img': (state: State, node: Parents) => {
    return {
      type: 'textComponent',
      name: 'nuxt-img',
      attributes: node.properties,
      children: state.toFlow(state.all(node)),
    }
  },
  'nuxt-picture': (state: State, node: Parents) => {
    return {
      type: 'textComponent',
      name: 'nuxt-picture',
      attributes: node.properties,
      children: state.toFlow(state.all(node)),
    }
  },
  table: (state: State, node: Parents) => {
    visit(node, (node) => {
      // @ts-expect-error: custom type
      if ((node as Element).type === mdcRemarkElementType) {
        node.type = 'element'
      }
    })

    if (Object.keys(node.properties).length) {
      format({ type: 'root', children: [node as Element] })
      return {
        type: 'html',
        value: toHtml(node),
      }
    }

    return defaultHandlers.table(state, node as Element)
  },
  img: (state: State, node: Parents) => {
    const { src, title, alt, ...attributes } = node.properties || {}

    const result = {
      type: 'image',
      url: state.resolve(String(src || '') || null),
      title: title ? String(title) : null,
      alt: alt ? String(alt) : '',
      attributes,
    } as unknown as Nodes

    state.patch(node, result)
    return result
  },
  em: (state: State, node: Parents) => {
    const result = { type: 'emphasis', children: state.all(node), attributes: node.properties }
    state.patch(node, result as Nodes)
    return result
  },
  strong: (state: State, node: Parents) => {
    const result = { type: 'strong', children: state.all(node), attributes: node.properties }
    state.patch(node, result as Nodes)
    return result
  },
  a(state: State, node: Parents) {
    const { href, title, ...attributes } = node.properties || {}

    if (hasProtocol(String(href || ''))) {
      if (attributes.target === '_blank') {
        delete attributes.target
      }
      if (['nofollow,noopener,noreferrer'].includes(String(attributes.rel))) {
        delete attributes.rel
      }
    }
    const result = {
      type: 'link',
      url: state.resolve(String(href || '') || null),
      title: title ? String(title) : null,
      children: state.all(node),
      attributes,
    } as unknown as Nodes

    state.patch(node, result)
    return result
  },
  br(state: State, node: Parents) {
    return {
      type: 'textComponent',
      name: 'br',
      attributes: node.properties,
    }
  },
}
