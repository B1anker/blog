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

export default class Editor extends Component {
  constructor (props) {
    super(props)
    this.editor = null
    this.editorEl = null
    this.state = {
      value: ''
    }
  }

  setValue (content) {
    if (this.state.value === '') {
      this.editor.setValue(content)
    }
  }

  componentDidMount () {
    this.editor = CodeMirror(this.editorEl, {
      value: this.props.value,
      mode: 'markdown',
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      lineWrapping: true,  // 长句子折行
      theme: "material",
      keyMap: 'sublime',
      extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    })
    this.editor.on('change', (value) => {
      this.setState({
        value: this.editor.getValue()
      })
    })
    this.setValue(this.props.value)
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
      <EditorStyle id="CodeMirror" innerRef={(el) => {
        this.editorEl = el
      }} />
    )
  }
}