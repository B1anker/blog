import CodeMirror from 'codemirror'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/continuelist.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/keymap/sublime.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/material.css'
import debounce from 'lodash/debounce'
import React, { Component } from 'react'
import { EditorStyle } from './style'

interface EditorProps {
  onChange: (snapshot: any) => void
  value: string
}

export default class Editor extends Component<EditorProps, {}> {
  private editor: CodeMirror.Editor | null = null
  private editorEl: React.RefObject<HTMLDivElement> = React.createRef()

  constructor (props) {
    super(props)
  }

  public setValue (content) {
    if (this.props.value === '' && this.editor) {
      this.editor.setValue(content)
    }
  }

  public componentDidUpdate () {
    console.log('update')
  }

  public componentDidMount () {
    if (this.editorEl.current) {
      this.editor = CodeMirror(this.editorEl.current, {
        value: this.props.value,
        mode: 'markdown',
        lineNumbers: true,
        showCursorWhenSelecting: true,
        lineWrapping: true,  // 长句子折行
        theme: 'material',
        keyMap: 'sublime',
        extraKeys: {
          Enter: 'newlineAndIndentContinueMarkdownList'
        }
      })
      if (this.editor) {
        const debounced = debounce(this.update, 300)
        this.editor.on('change', (value) => {
          debounced.call(this)
        })
        this.setValue(this.props.value)
      }
    }
  }

  public render () {
    return (
      <EditorStyle id="CodeMirror"
        ref={this.editorEl}
      />
    )
  }

  private update () {
    if (this.editor) {
      this.props.onChange(this.editor.getValue())
    }
  }
}
