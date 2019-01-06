import React, { Component } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/edit/continuelist.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import { EditorStyle } from './style'
import debounce from 'lodash/debounce'

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

  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  setValue (content) {
    if (this.state.value === '' && this.editor) {
      this.editor.setValue(content)
    }
  }

  componentDidMount () {
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
        const debounced = debounce(this.update, 600)
        this.editor.on('change', (value) => {
          debounced.call(this)
        })
        this.setValue(this.props.value)   
      }
    }
  }

  update () {
    if (this.editor) {
      this.setState({
        value: this.editor.getValue()
      })
    }
  }

  getSnapshotBeforeUpdate (prevProps, prevState) {
    if (this.state.value !== prevState.value) {
      return this.state.value
    }
    return null
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (snapshot) {
      this.props.onChange(snapshot)
    }
    this.setValue(prevProps.value)
  }

  render () {
    return (
      <EditorStyle id="CodeMirror"
        ref={this.editorEl}
      />
    )
  }
}