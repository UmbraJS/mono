
import { Mark } from '@tiptap/core'
import { VueMarkViewRenderer } from '@tiptap/vue-3'
import ReferenceMarkView from '../../../components/RichText/ReferenceMarkView.vue'

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
      unsetReference: () => ReturnType
    }
  }
}

export default Mark.create({
  name: 'reference',
  addAttributes() {
    return {
      'data-count': { default: 0 },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'reference',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['reference', HTMLAttributes]
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
      unsetReference:
        () =>
          ({ commands }) => {
            return commands.unsetMark(this.name)
          },
    }
  },

  addMarkView() {
    return VueMarkViewRenderer(ReferenceMarkView)
  },
})
