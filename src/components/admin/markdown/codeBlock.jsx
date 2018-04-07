import React, { Component } from 'react'
import hljs from 'highlightjs'
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
    hljs.highlightBlock(this.el)
  }

  render () {
    const { value } = this.props
    return (
      <pre>
        <code ref={(el) => this.el = el}
          className={`language-${this.props.language}`}>
          { this.props.value }
        </code>
      </pre>
    )
  }
}