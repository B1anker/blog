import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { PostStyle } from './style'
import CodeBlock from '@/components/admin/markdown/codeBlock'

export default class Post extends Component {
  render () {
    return (
      <PostStyle>
        <ReactMarkdown source={ this.convertRenderValue(this.props.value) }
          className="renderer"
          skipHtml={false}
          escapeHtml={false}
          renderers={{code: CodeBlock}}/>
      </PostStyle>
    )
  }

  convertRenderValue (value) {
    const removeMore = value.replace(/<!-- more -->/, '')
    return removeMore.replace(/---\n(.|\n)*\n---/g, '')
  }
}