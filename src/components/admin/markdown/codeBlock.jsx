import React, { Component } from 'react'
import { highlightBlock } from 'highlightjs'
import 'highlightjs/styles/solarized_light.css'

export default class CodeBlock extends Component {
  constructor (props) {
    super(props)
    this.el = null
  }

  componentDidMount () {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    highlightBlock(this.el)
  }

  render () {
    const { value } = this.props
    return (
      <pre>
        <code ref={(el) => this.el = el}
          className={`language-${this.props.language || 'vim'}`}>
          { this.props.value }
        </code>
      </pre>
    )
  }
}