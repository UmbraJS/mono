import { mergeAttributes, Node } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { Component } from 'vue'
import CitationNodeView from '../../../components/RichText/CitationNodeView.vue'

export interface CitationAttributes {
  reliance?: string
  distance?: string
  scope?: string
}

export interface CitationOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    citation: {
      /**
       * Insert a citation block
       * @example editor.commands.setCitation()
       */
      setCitation: (attributes?: CitationAttributes) => ReturnType
      /**
       * Toggle a citation block
       * @example editor.commands.toggleCitation()
       */
      toggleCitation: (attributes?: CitationAttributes) => ReturnType
    }
  }
}

export const Citation = Node.create<CitationOptions>({
  name: 'citation',
  group: 'block',
  content: 'block+',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  }, addAttributes() {
    return {
      reliance: {
        default: 'deductive',
        parseHTML: element => element.getAttribute('data-reliance'),
        renderHTML: attributes => {
          if (!attributes.reliance) return {}
          return { 'data-reliance': attributes.reliance }
        },
      },
      distance: {
        default: 'primary',
        parseHTML: element => element.getAttribute('data-distance'),
        renderHTML: attributes => {
          if (!attributes.distance) return {}
          return { 'data-distance': attributes.distance }
        },
      },
      scope: {
        default: 'study',
        parseHTML: element => element.getAttribute('data-scope'),
        renderHTML: attributes => {
          if (!attributes.scope) return {}
          return { 'data-scope': attributes.scope }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'citation',
      },
      {
        tag: 'div[data-type="citation"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'citation',
      }),
      0,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(CitationNodeView as Component<NodeViewProps>)
  },

  addCommands() {
    return {
      setCitation:
        (attributes) =>
          ({ state, commands }) => {
            const { selection } = state
            const { $from, $to } = selection

            // Get the selected content
            const selectedText = state.doc.textBetween($from.pos, $to.pos, ' ')

            // If there's a selection, wrap it in a citation
            if (selectedText) {
              return commands.insertContentAt(
                { from: $from.pos, to: $to.pos },
                {
                  type: this.name,
                  attrs: attributes,
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: selectedText }],
                    },
                  ],
                }
              )
            }

            // Otherwise insert an empty citation with placeholder
            return commands.insertContent({
              type: this.name,
              attrs: attributes,
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Add citation text...' }],
                },
              ],
            })
          },
      toggleCitation:
        (attributes) =>
          ({ commands }) => {
            return commands.toggleNode(this.name, 'paragraph', attributes)
          },
    }
  },
})
