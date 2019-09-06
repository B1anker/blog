import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import CodeBlock from './Prism'
import { RendererStyle } from './style'

interface RendererProps {
  value: string
}

export default class Renderer extends Component<RendererProps, {}> {
  constructor (props) {
    super(props)
  }

  public render () {
    return (
      <RendererStyle>
        <ReactMarkdown source={ this.props.value }
          className="renderer"
          skipHtml={false}
          escapeHtml={false}
          renderers={{code: CodeBlock}}/>
      </RendererStyle>
    )
  }
}
