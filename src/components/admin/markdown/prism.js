import React, { Component } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import style from './prism-style'

export default class CodeBlock extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { value, language } = this.props
    return (
      <SyntaxHighlighter className='prism-highlight'
        language={language}
        style={style}>
        { value }
      </SyntaxHighlighter>
    )
  }
}
