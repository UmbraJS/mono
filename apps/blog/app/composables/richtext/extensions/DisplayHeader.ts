import { mergeAttributes } from '@tiptap/core'
import Heading from '@tiptap/extension-heading'

export const DisplayHeader = Heading.extend({
  name: 'displayHeader',

  parseHTML() {
    return [
      {
        tag: 'h1.display',
        attrs: { level: 1 },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      `h1`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `display`,
      }),
      0,
    ]
  },
})
