import Paragraph from '@tiptap/extension-paragraph'

//slugline is just a paragraph with a slugline class
export const Slugline = Paragraph.extend({
  name: 'slugline',
  addAttributes() {
    return {
      class: {
        default: 'slugline',
        parseHTML: (element) => {
          return {
            class: element.getAttribute('class'),
          }
        },
        renderHTML: (attributes) => {
          return {
            class: attributes.class,
          }
        },
      },
    }
  },
})
