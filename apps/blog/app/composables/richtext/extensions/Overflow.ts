import Bold from '@tiptap/extension-bold'
import { mergeAttributes } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import type { Mark } from '@tiptap/pm/model'

export const Overflow = Bold.extend({
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

  function removeMark(from: number, to: number, mark: Mark) {
    return dispatch(transaction.removeMark(from, to, mark))
  }

  function addMark(from: number, to: number, mark: Mark) {
    return dispatch(transaction.addMark(from, to, mark))
  }

  const current = getCurrentBlock(editor)

  current.end = current.start + current.size + 1
  const atLimit = current.size >= props.limit
  const limit = current.start + props.limit
  const inner = Math.min(current.end, limit)

  const overflowMark = schema.marks.overflow?.create()

  if (!overflowMark) return

  removeMark(current.start, inner, overflowMark)

  if (atLimit) {
    addMark(limit, current.end, overflowMark)
  }
}
