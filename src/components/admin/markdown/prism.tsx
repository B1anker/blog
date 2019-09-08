import React, { Component } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import style from './prism-style'

export interface  CodeBlockProps {
  value: string
  language: string
}

export default class CodeBlock extends Component<CodeBlockProps> {
  constructor (props) {
    super(props)
  }

  public render () {
    const { value, language } = this.props
    return (
      <SyntaxHighlighter className="prism-highlight"
        language={language}
        style={style}
      >
        { value }
      </SyntaxHighlighter>
    )
  }
}
