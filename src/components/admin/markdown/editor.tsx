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

interface EditorState {
  value: string
}

export default class Editor extends Component<EditorProps, EditorState> {
  private editor: CodeMirror.Editor | null = null
  private editorEl: React.RefObject<HTMLDivElement> = React.createRef()
  private updateDebounced: () => void

  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  public shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.value !== this.props.value) {
      return true
    }
    return false
  }

  public componentDidMount () {
    if (this.editorEl.current) {
      this.editor = CodeMirror(this.editorEl.current, {
        value: this.state.value,
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
      this.updateDebounced = debounce(this.update, 300).bind(this)
      this.editor.on('change', this.updateDebounced)
    }
  }

  public componentWillUnmount () {
    this.editor!.off('change', this.updateDebounced)
  }

  public render () {
    return (
      <EditorStyle id="CodeMirror"
        ref={this.editorEl}
      />
    )
  }

  private update () {
    this.props.onChange(this.editor!.getValue())
  }
}
