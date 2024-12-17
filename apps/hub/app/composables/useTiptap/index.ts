import { useEditor as tiptap } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { Overflow, validateOverflow } from './Overflow'
import { Slugline } from './Slugline'

interface useTiptapProps {
  limit?: number
  placeholder?: string
  content?: string
  onChange?: (editor: Editor) => void
}

export function useTitleEditor({
  limit = 280,
  placeholder = 'Write a title...',
  content,
  onChange = () => {},
}: useTiptapProps) {
  const editor = tiptap({
    content,
    onUpdate: ({ editor }) => onChange(editor),
    extensions: [
      Document,
      Text,
      Heading,
      Paragraph,
      CharacterCount.configure({ limit }),
      Placeholder.configure({ placeholder }),
    ],
  })

  onBeforeUnmount(() => {
    if (!editor.value) return
    editor.value.destroy()
  })

  return editor
}

export function useEditor({
  limit = 4000,
  placeholder = 'Write something...',
  content,
  onChange = () => {},
}: useTiptapProps) {
  const editor = tiptap({
    content,
    onUpdate,
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Heading,
      Paragraph,
      Slugline,
      History,
      Overflow,
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit }),
    ],
  })

  const currentNodeLength = ref(0)
  function countNodeLength(editor: Editor) {
    const { $head } = editor.state.selection
    const nodeSize = $head.parent.content.size
    currentNodeLength.value = nodeSize
  }

  function onUpdate({ editor }: { editor: Editor }) {
    onChange(editor)
    countNodeLength(editor)
    validateOverflow(editor, {
      limit: 280,
    })
  }

  onBeforeUnmount(() => {
    if (!editor.value) return
    editor.value.destroy()
  })

  return editor
}
