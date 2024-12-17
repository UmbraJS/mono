import Heading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'

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
