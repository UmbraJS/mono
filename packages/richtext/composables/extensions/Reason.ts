import { mergeAttributes, Node } from '@tiptap/core'
// import { VueNodeViewRenderer } from '@tiptap/vue-3'

// import Reason from '@/components/Reason.vue'

export default Node.create({
  name: 'vueReason',
  priority: 1100,
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'vue-reason' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['vue-reason', mergeAttributes(HTMLAttributes), 0]
  },
  // addNodeView() {
  //   return VueNodeViewRenderer(Reason)
  // },
})
