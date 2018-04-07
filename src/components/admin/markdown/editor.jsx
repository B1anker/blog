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
    this.editor.on('change', () => {
      this.props.onChange(this.editor.getValue())
    })
  }

  render () {
    return (
      <EditorStyle id="CodeMirror" innerRef={(el) => {
        this.editorEl = el
      }} />
    )
  }
}