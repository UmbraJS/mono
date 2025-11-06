import { mergeAttributes, Node } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { Component } from 'vue'
import NarrativeFrameNodeView from '../../../components/RichText/NarrativeFrameNodeView.vue'

export interface NarrativeFrameAttributes {
  image?: string
  mood?: 'positive' | 'negative' | 'neutral'
  type?: 'premise' | 'logic' | 'normative'
  claims?: unknown
}

export interface NarrativeFrameOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    narrativeFrame: {
      /**
       * Insert a narrative frame block
       * @example editor.commands.setNarrativeFrame()
       */
      setNarrativeFrame: (attributes?: NarrativeFrameAttributes) => ReturnType
      /**
       * Toggle a narrative frame block
       * @example editor.commands.toggleNarrativeFrame()
       */
      toggleNarrativeFrame: (attributes?: NarrativeFrameAttributes) => ReturnType
    }
  }
}

export const NarrativeFrame = Node.create<NarrativeFrameOptions>({
  name: 'narrativeFrame',
  group: 'block',
  content: 'block+',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      image: {
        default: null,
        parseHTML: element => element.getAttribute('data-image'),
        renderHTML: attributes => {
          if (!attributes.image) return {}
          return { 'data-image': attributes.image }
        },
      },
      mood: {
        default: 'neutral',
        parseHTML: element => element.getAttribute('data-mood'),
        renderHTML: attributes => {
          if (!attributes.mood) return {}
          return { 'data-mood': attributes.mood }
        },
      },
      type: {
        default: 'premise',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes.type) return {}
          return { 'data-type': attributes.type }
        },
      },
      claims: {
        default: null,
        parseHTML: element => {
          const claimsData = element.getAttribute('data-claims')
          return claimsData ? JSON.parse(claimsData) : null
        },
        renderHTML: attributes => {
          if (!attributes.claims) return {}
          return { 'data-claims': JSON.stringify(attributes.claims) }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'narrative-frame',
      },
      {
        tag: 'div[data-component="narrative-frame"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-component': 'narrative-frame',
      }),
      0,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(NarrativeFrameNodeView as Component<NodeViewProps>)
  },

  addCommands() {
    return {
      setNarrativeFrame:
        (attributes) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: attributes,
            })
          },
      toggleNarrativeFrame:
        (attributes) =>
          ({ commands }) => {
            return commands.toggleNode(this.name, 'paragraph', attributes)
          },
    }
  },
})

export default NarrativeFrame
