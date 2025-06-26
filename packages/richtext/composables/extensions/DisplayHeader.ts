import { mergeAttributes } from '@tiptap/core'
import Heading from '@tiptap/extension-heading'

export const DisplayHeader = Heading.extend({
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
