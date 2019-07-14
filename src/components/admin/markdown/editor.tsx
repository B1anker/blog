import CodeMirror from 'codemirror'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/continuelist.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/material.css'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import { EditorStyle } from './style'

interface EditorProps {
  onChange: (snapshot: any) => void
  value: string
  height: number
}

interface EditorState {
  value: string
}

let editor: CodeMirror.Editor

export default class Editor extends Component<EditorProps, EditorState> {
  private initialled: boolean = false
  private editorRef: React.RefObject<HTMLDivElement> = React.createRef()
  private updateDebounced: () => void

  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  public shouldComponentUpdate (nextProps) {
    return !isEqual(nextProps, this.props)
  }

  public componentWillUnmount () {
    editor!.off('change', this.updateDebounced)
  }

  public getSnapshotBeforeUpdate (prevProps) {
    if (prevProps.height !== this.props.height || this.props.height) {
      return {
        height: this.props.height,
        value: this.props.value
      }
    }
    return {
      height: 0,
      value: this.props.value
    }
  }

  public componentDidUpdate (prevProps, prevState, { height, value }) {
    console.log(height, value)
    if (height && !this.initialled && value) {
      this.initialled = true
      this.initial()
    }
  }

  public render () {
    return (
      <EditorStyle id="CodeMirror"
        ref={this.editorRef}
        height={this.props.height}
      />
    )
  }

  public setValue (value) {
    editor && editor.setValue(value)
  }

  private initial () {
    if (this.editorRef.current) {
      editor = CodeMirror(this.editorRef.current, {
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
      this.updateDebounced = debounce(this.update, 300).bind(this)
      editor!.on('change', this.updateDebounced)
    }
  }

  private update () {
    this.props.onChange(editor!.getValue())
  }
}
