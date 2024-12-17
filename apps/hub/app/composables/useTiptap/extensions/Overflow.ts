import TextStyle from '@tiptap/extension-placeholder'
import { mergeAttributes } from '@tiptap/core'
import type { Editor } from '@tiptap/core'

export const Overflow = TextStyle.extend({
  name: 'overflow',
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'overflow' }), 0]
  },
})

export function getCurrentBlock(editor: Editor) {
  const { state } = editor
  return {
    start: state.selection.$from.before(),
    node: state.doc.nodeAt(state.selection.$from.before()),
    size: state.doc.nodeAt(state.selection.$from.before())?.content.size || 0,
    end: 0,
  }
}

export function validateOverflow(editor: Editor, props: { limit: number }) {
  const { state, view, schema } = editor
  const dispatch = view.dispatch
  const transaction = state.tr

  function removeMark(from: number, to: number, mark: any) {
    return dispatch(transaction.removeMark(from, to, mark))
  }

  function addMark(from: number, to: number, mark: any) {
    return dispatch(transaction.addMark(from, to, mark))
  }

  const current = getCurrentBlock(editor)

  current.end = current.start + current.size + 1
  const atLimit = current.size >= props.limit
  const limit = current.start + props.limit
  const inner = Math.min(current.end, limit)

  const overflowMark = schema.marks.overflow.create()

  removeMark(current.start, inner, overflowMark)
  atLimit && addMark(limit, current.end, overflowMark)
}
