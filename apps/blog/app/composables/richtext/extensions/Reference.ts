import { mergeAttributes, Node } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { Component } from 'vue'
import Reference from '../../components/Reference.vue'

interface ReferenceOptions {
  id: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    reference: {
      /**
       * Set an italic mark
       * @example editor.commands.setReference()
       */
      setReference: () => ReturnType
      /**
       * Toggle an italic mark
       * @example editor.commands.toggleItalic()
       */
      toggleReference: () => ReturnType
      /**
       * Unset an italic mark
       * @example editor.commands.unsetItalic()
       */
      unsetReferece: () => ReturnType
    }
  }
}

export default Node.create<ReferenceOptions>({
  name: 'reference',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      count: {
        id: '0',
      },
    }
  },
  addOptions() {
    return {
      id: '0',
    }
  },
  parseHTML() {
    return [{ tag: 'reference' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['reference', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(Reference as Component<NodeViewProps>)
  },
  addCommands() {
    return {
      setReference:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name)
        },
      toggleReference:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
      unsetReferece:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
